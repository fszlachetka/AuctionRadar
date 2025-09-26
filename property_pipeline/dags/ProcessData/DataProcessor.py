import logging
from typing import List, Dict, Any, Optional
from dataclasses import dataclass
from datetime import datetime
import re
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut, GeocoderServiceError
from ScrapData.Property_Data import PropertyData
import json

logger = logging.getLogger(__name__)

def clean_int(value: Any) -> Optional[int]:
    """
    Converts value to int
    """
    if value is None:
        return None
    if isinstance(value, int):
        return value
    match = re.search(r"\d+", str(value))
    return int(match.group()) if match else None


def clean_float(value: Any) -> Optional[float]:
    """
    Converts value to float, change ',' to '.', extract only numeric
    """
    if value is None:
        return None
    if isinstance(value, (int, float)):
        return float(value)
    match = re.search(r"[\d,.]+", str(value).replace(",", "."))
    return float(match.group()) if match else None


def clean_floor(value: Any) -> Optional[int]:
    """
    Normalizes floor, 'parter' = 0
    """
    if value is None:
        return None
    val = str(value).lower()
    if "parter" in val:
        return 0
    return clean_int(val)


def clean_postal_code(value: Any) -> Optional[str]:
    """
    Normalizes postal code to XY-ABC, invalid = 00-000
    """
    if value is None:
        return None
    val = str(value).strip()
    val = val.replace(" ", "-")
    match = re.match(r"^(\d{2})[- ]?(\d{3})$", val)
    if match:
        return f"{match.group(1)}-{match.group(2)}"
    return "00-000"


def clean_datetime(value: Any) -> Optional[datetime]:
    """
    Converts value to datetime
    """
    if value is None:
        return None
    if isinstance(value, datetime):
        return value
    for fmt in ("%Y-%m-%d %H:%M:%S", "%d.%m.%Y %H:%M", "%Y-%m-%d"):
        try:
            return datetime.strptime(str(value), fmt)
        except ValueError:
            continue
    return None


def normalize_city(value: Any) -> str:
    """
    Normalizes city name
    """
    if value is None:
        return None
    val = str(value).strip()
    return val.title()


def validate_ksiega(numer_ksiegi: str) -> str:
    """
    Validates land register number
    Last digit is a control sum
    Invalid = 0000/00000000/0
    """
    niepoprawny = "0000/00000000/0"

    if not isinstance(numer_ksiegi, str):
        return niepoprawny

    match = re.match(r"^([A-Z0-9]{4})/(\d{8})/(\d)$", numer_ksiegi.upper())
    if not match:
        return niepoprawny

    sad_id_i_litery, nieruchomosc_id, cyfra_kontrolna = match.groups()
    cyfra_kontrolna = int(cyfra_kontrolna)

    znak_do_wartosci = {
        '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
        'X': 10, 'A': 11, 'B': 12, 'C': 13, 'D': 14, 'E': 15, 'F': 16, 'G': 17, 'H': 18,
        'I': 19, 'J': 20, 'K': 21, 'L': 22, 'M': 23, 'N': 24, 'O': 25, 'P': 26, 'R': 27,
        'S': 28, 'T': 29, 'U': 30, 'W': 31, 'Y': 32, 'Z': 33
    }

    wagi = [1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7]

    suma_wazona = 0

    czesc_do_obliczen = sad_id_i_litery + nieruchomosc_id

    for i, znak in enumerate(czesc_do_obliczen):
        if znak not in znak_do_wartosci:
            return niepoprawny
        wartosc_znaku = znak_do_wartosci[znak]
        waga = wagi[i]
        suma_wazona += wartosc_znaku * waga

    obliczona_cyfra_kontrolna = suma_wazona % 10

    return numer_ksiegi if obliczona_cyfra_kontrolna == cyfra_kontrolna else niepoprawny

def booleanize(value: Any) -> Optional[int]:
    """
    Converts 'tak/nie/yes/no/1/0' to 1/0.
    """
    if value is None:
        return None
    val = str(value).strip().lower()
    if val in {"tak", "yes", "1", "true"}:
        return 1
    if val in {"nie", "no", "0", "false"}:
        return 0
    return None


def get_coordinates_from_address(ulica: str, miasto: str) -> tuple[Optional[str], Optional[str]]:
    """
    Calculates latitude and longitude from ulica + miasto
    Returns latitude and longitude as a pair of strings
    """
    if not ulica or not miasto:
        return None, None
    
    try:
        geolocator = Nominatim(user_agent="property_pipeline_geocoder", timeout=10)
        
        query = f"{ulica}, {miasto}, Poland"
        
        logger.info(f"Geocoding query: {query}")
        
        location = geolocator.geocode(query)
        
        if location:
            longitude = str(location.longitude)
            latitude = str(location.latitude)
            logger.info(f"Found coordinates for {ulica}, {miasto}: {latitude}, {longitude}")
            return longitude, latitude
        else:
            logger.warning(f"No coordinates found for address: {ulica}, {miasto}")
            return None, None
            
    except (GeocoderTimedOut, GeocoderServiceError) as e:
        logger.error(f"Geocoding error for {ulica}, {miasto}: {e}")
        return None, None
    except Exception as e:
        logger.error(f"Unexpected error during geocoding for {ulica}, {miasto}: {e}")
        return None, None


class DataProcessor:
    def process_data(self, raw_properties: List[Dict]) -> List[PropertyData]:
        """
        Transforms list of raw data into PropertyData
        """
        processed_data = []
        for prop in raw_properties:
            try:
                processed_prop = self._process_single_property(prop)
                processed_data.append(processed_prop)
            except Exception as e:
                logger.warning(f"Failed to process property record: {prop}. Reason: {str(e)}")
        return processed_data

    def _process_single_property(self, full_data: Dict[str, Any]) -> PropertyData:
        """
        Helper method to process single property
        """
        url = full_data.get("url")
        data = full_data.get("data")
        if url is None or data is None:
            raise ValueError("Missing 'url' or 'data' in property record")
        if not isinstance(data, dict):
            raise ValueError("'data' field is not a dictionary")
        ulica = str(data.get("ulica", "")).strip()
        miasto = normalize_city(data.get("miasto"))
        
        xCoord, yCoord = get_coordinates_from_address(ulica, miasto)
        return PropertyData(
            #mieszkanie_id=mieszkanie_id,
            rozmiar=clean_float(data.get("rozmiar")) or 0.0,
            pokoje=clean_int(data.get("pokoje")) or 0,
            ulica=ulica,
            miasto=miasto,
            kod_pocztowy= clean_postal_code(data.get("kod_pocztowy")),
            wywolawcza=clean_int(data.get("wywolawcza")) or 0,
            nr_ksiegi_wieczystej=validate_ksiega(data.get("ksiegawieczysta")),
            wadium=clean_int(data.get("wadium")) or 0,
            pietro=clean_floor(data.get("pietro")) or 0,
            termin_ogledzin=clean_datetime(data.get("termin_ogledzin")),
            piwnica=booleanize(data.get("piwnica")),
            inne=data.get("inne"),
            nr_dzialki=data.get("dzialka_NR"),
            prawo=data.get("prawo"),
            xCoord=xCoord,
            yCoord=yCoord,
        )

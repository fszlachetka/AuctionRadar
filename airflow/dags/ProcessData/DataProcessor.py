import logging
from typing import List, Dict, Any, Optional
from dataclasses import dataclass
from datetime import datetime
import re
from ..ScrapData.Property_Data import PropertyData

logger = logging.getLogger(__name__)


def clean_int(value: Any) -> Optional[int]:
    """Konwertuje wartość na int, wyciąga liczby ze stringów typu '3/10'."""
    if value is None:
        return None
    if isinstance(value, int):
        return value
    match = re.search(r"\d+", str(value))
    return int(match.group()) if match else None


def clean_float(value: Any) -> Optional[float]:
    """Konwertuje na float, usuwa jednostki typu 'm2', 'm²' itp."""
    if value is None:
        return None
    if isinstance(value, (int, float)):
        return float(value)
    match = re.search(r"[\d,.]+", str(value).replace(",", "."))
    return float(match.group()) if match else None


def clean_floor(value: Any) -> Optional[int]:
    """Normalizuje piętro – 'parter' = 0, liczby/napisy -> int."""
    if value is None:
        return None
    val = str(value).lower()
    if "parter" in val:
        return 0
    return clean_int(val)


def clean_postal_code(value: Any) -> Optional[str]:
    """Waliduje kod pocztowy w formacie XX-XXX, poprawia jeśli trzeba."""
    if value is None:
        return None
    val = str(value).strip()
    val = val.replace(" ", "-")
    match = re.match(r"^(\d{2})[- ]?(\d{3})$", val)
    if match:
        return f"{match.group(1)}-{match.group(2)}"
    return "00-000"


def clean_datetime(value: Any) -> Optional[datetime]:
    """Konwertuje datę z tekstu/obiektu na datetime."""
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
    """Czyści nazwy miast (spacje, duże litery)."""
    if value is None:
        return None
    val = str(value).strip()
    return val.title()


def validate_ksiega(value: Any) -> Optional[str]:
    """Księga wieczysta powinna mieć 15 znaków."""
    if value is None:
        return None
    val = str(value).strip()
    return val if len(val) == 15 else None


def booleanize(value: Any) -> Optional[int]:
    """Zamienia 'tak/nie/yes/no/1/0' -> 1/0."""
    if value is None:
        return None
    val = str(value).strip().lower()
    if val in {"tak", "yes", "1", "true"}:
        return 1
    if val in {"nie", "no", "0", "false"}:
        return 0
    return None


class DataProcessor:
    def process_data(self, raw_properties: List[Dict]) -> List[PropertyData]:
        """
        Przetwarza listę surowych danych i zwraca listę obiektów PropertyData.
        """
        processed_data = []
        for prop in raw_properties:
            try:
                processed_prop = self._process_single_property(prop)
                processed_data.append(processed_prop)
            except Exception as e:
                logger.warning(f"Failed to process property record: {prop}. Reason: {str(e)}")
        return processed_data

    def _process_single_property(self, data: Dict[str, Any]) -> PropertyData:
        """
        Przetwarza pojedynczy słownik surowych danych.
        """

        #mieszkanie_id = clean_int(data.get("mieszkanie_id"))

        return PropertyData(
            #mieszkanie_id=mieszkanie_id,
            rozmiar=clean_float(data.get("rozmiar")) or 0.0,
            pokoje=clean_int(data.get("pokoje")) or 0,
            ulica=str(data.get("ulica", "")).strip(),
            miasto=normalize_city(data.get("miasto")),
            kod_pocztowy=clean_postal_code(data.get("kod_pocztowy")),
            wywolawcza=clean_int(data.get("wywolawcza")) or 0,
            nr_ksiegi_wieczystej=validate_ksiega(data.get("ksiegawieczysta")),
            wadium=clean_int(data.get("wadium")) or 0,
            pietro=clean_floor(data.get("pietro")) or 0,
            termin_ogledzin=clean_datetime(data.get("termin_ogledzin")),
            piwnica=booleanize(data.get("piwnica")),
            inne=data.get("inne"),
            nr_dzialki=data.get("dzialka_NR"),
            prawo=data.get("prawo"),
        )
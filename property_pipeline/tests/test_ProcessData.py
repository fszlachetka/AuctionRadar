import pytest
from datetime import datetime
import sys
import os

from dags.ProcessData.DataProcessor import (
    clean_int,
    clean_float,
    clean_floor,
    clean_postal_code,
    clean_datetime,
    normalize_city,
    validate_ksiega,
    booleanize,
    DataProcessor,
    get_coordinates_from_address,
)

from dags.ScrapData.Property_Data import PropertyData


# ======================================================================
# Test cleaning functions
# ======================================================================

def test_clean_int():
    assert clean_int("123") == 123
    assert clean_int("123 m2") == 123
    assert clean_int("3/10") == 3
    assert clean_int(123) == 123
    assert clean_int("abc") is None
    assert clean_int(None) is None


def test_clean_float():
    assert clean_float("50.5m2") == 50.5
    assert clean_float("50,5 m2") == 50.5
    assert clean_float(50.5) == 50.5
    assert clean_float(50) == 50.0
    assert clean_float("abc") is None
    assert clean_float(None) is None


def test_clean_floor():
    assert clean_floor("parter") == 0
    assert clean_floor("PARTER") == 0
    assert clean_floor("piętro 3") == 3
    assert clean_floor(5) == 5
    assert clean_floor(None) is None
    assert clean_floor("piętro 1/2") == 1


def test_clean_postal_code():
    assert clean_postal_code("31-133") == "31-133"
    assert clean_postal_code("31 133") == "31-133"
    assert clean_postal_code("31133") == "31-133"
    assert clean_postal_code("abc") == "00-000"
    assert clean_postal_code(None) is None


def test_clean_datetime():
    assert clean_datetime("2025-05-15 10:00:00") == datetime(2025, 5, 15, 10, 0, 0)
    assert clean_datetime("15.05.2025 10:00") == datetime(2025, 5, 15, 10, 0)
    assert clean_datetime("2025-05-15") == datetime(2025, 5, 15)
    assert clean_datetime("abc") is None
    assert clean_datetime(None) is None


def test_normalize_city():
    assert normalize_city(" kraków ") == "Kraków"
    assert normalize_city("WARSZAWA") == "Warszawa"
    assert normalize_city(None) is None
    assert normalize_city("krakow") == "Krakow"


def test_booleanize():
    assert booleanize("tak") == 1
    assert booleanize("TAK") == 1
    assert booleanize("yes") == 1
    assert booleanize("1") == 1
    assert booleanize("nie") == 0
    assert booleanize("0") == 0
    assert booleanize("false") == 0
    assert booleanize(None) is None


# ======================================================================
# Test KW
# ======================================================================

def test_validate_ksiega_valid_number():
    assert validate_ksiega("WL1A/00272852/9") == "WL1A/00272852/9"
    assert validate_ksiega("LU1I/00012345/1") == "LU1I/00012345/1"


def test_validate_ksiega_invalid_control_digit():
    assert validate_ksiega("WL1A/00272852/8") == "0000/00000000/0"
    assert validate_ksiega("WL1A/00272852/0") == "0000/00000000/0"


def test_validate_ksiega_invalid_format():
    assert validate_ksiega("WL1A/00272852") == "0000/00000000/0"
    assert validate_ksiega("WL1A/00272852/90") == "0000/00000000/0"
    assert validate_ksiega("123/45678901/2") == "0000/00000000/0"
    assert validate_ksiega("123456789012345") == "0000/00000000/0"


# ======================================================================
# Test Data Processor
# ======================================================================

def test_data_processor_valid_data():
    processor = DataProcessor()
    raw_data = [
        {
            "mieszkanie_id": "1",
            "rozmiar": "50.5 m2",
            "pokoje": "3",
            "ulica": "Główna",
            "miasto": "Kraków",
            "kod_pocztowy": "31-000",
            "wywolawcza": "100000",
            "ksiegawieczysta": "WL1A/00272852/9",
            "wadium": "5000",
            "pietro": "parter",
            "termin_ogledzin": "2025-05-15",
            "piwnica": "tak",
            "inne": "Balkon",
            "dzialka_NR": "120123.1234.567",
            "prawo": "własność",
        },
        {
            "mieszkanie_id": "2",
            "rozmiar": "75.0 m2",
            "pokoje": "4",
            "ulica": "Kwiatowa",
            "miasto": "Warszawa",
            "kod_pocztowy": "02-123",
            "wywolawcza": "200000",
            "ksiegawieczysta": "WA1W/00012345/6",
            "wadium": "10000",
            "pietro": "1",
            "termin_ogledzin": "2025-06-20 12:00",
            "piwnica": "nie",
            "inne": "Balkon",
            "dzialka_NR": "140456.7890.123",
            "prawo": "spółdzielcze",
        },
    ]

    processed_list = processor.process_data(raw_data)

    assert len(processed_list) == 2

    prop1 = processed_list[0]
    assert isinstance(prop1, PropertyData)
    assert prop1.rozmiar == 50.5
    assert prop1.pietro == 0
    assert prop1.piwnica == 1
    assert prop1.nr_ksiegi_wieczystej == "WL1A/00272852/9"
    assert prop1.termin_ogledzin == datetime(2025, 5, 15, 0, 0)
    assert prop1.xCoord is None or isinstance(prop1.xCoord, str)
    assert prop1.yCoord is None or isinstance(prop1.yCoord, str)

    prop2 = processed_list[1]
    assert isinstance(prop2, PropertyData)
    assert prop2.rozmiar == 75.0
    assert prop2.piwnica == 0
    assert prop2.nr_ksiegi_wieczystej == "0000/00000000/0"
    assert prop2.nr_dzialki == "140456.7890.123"
    assert prop2.xCoord is None or isinstance(prop2.xCoord, str)
    assert prop2.yCoord is None or isinstance(prop2.yCoord, str)


def test_data_processor_invalid_data():
    processor = DataProcessor()
    raw_data = [
        {"puste_dane": "xyz"}
    ]

    processed_data = processor.process_data(raw_data)
    assert len(processed_data) == 1
    
    prop = processed_data[0]
    assert prop.rozmiar == 0.0
    assert prop.pokoje == 0
    assert prop.ulica == ""
    assert prop.miasto is None
    assert prop.xCoord is None
    assert prop.yCoord is None


# ======================================================================
# Test geocoding
# ======================================================================

def test_get_coordinates_selected():
    lon, lat = get_coordinates_from_address("ul. Prof. S. Łojasiewicza 6", "Kraków")

    assert lat is not None and lon is not None
    assert float(lat) == pytest.approx(50.030769, abs=0.001)
    assert float(lon) == pytest.approx(19.906825, abs=0.001)

    lon, lat = get_coordinates_from_address("al. Księcia Józefa Poniatowskiego 1", "Warszawa")

    assert lat is not None and lon is not None
    assert float(lat) == pytest.approx(52.2365, abs=0.001)
    assert float(lon) == pytest.approx(21.04299, abs=0.001)


def test_get_coordinates_from_address():
    xCoord, yCoord = get_coordinates_from_address("ul. Główna 1", "Kraków")
    assert xCoord is None or isinstance(xCoord, str)
    assert yCoord is None or isinstance(yCoord, str)
    
    xCoord, yCoord = get_coordinates_from_address("", "Kraków")
    assert xCoord is None
    assert yCoord is None
    
    xCoord, yCoord = get_coordinates_from_address("ul. Testowa", "")
    assert xCoord is None
    assert yCoord is None



import os
from dags.ScrapData.scrape_utils import extract_text_from_links, extract_data_with_gpt
import pytest
from dags.ProcessData.DataProcessor import DataProcessor

def test_extract_text_and_gpt_on_valid_pdf():
    pdf_path = "file:///opt/airflow/tests/test_pdf1.pdf"
    result = extract_text_from_links([pdf_path])
    assert isinstance(result, list)
    assert result[0]["url"].endswith("test_pdf1.pdf")
    assert result[0]["text"].strip() != ""

    api_key = os.getenv("OPENAI_API_KEY")
    assert api_key is not None and api_key != "", "OPENAI_API_KEY is not set"

    try:
        gpt_result = extract_data_with_gpt(result)
    except Exception as e:
        pytest.fail(f"Error during extract_data_with_gpt: {e}")

    assert isinstance(gpt_result, list)
    assert len(gpt_result) == 1
    assert gpt_result[0]["url"].endswith("test_pdf1.pdf")
    assert isinstance(gpt_result[0]["data"], dict)

    data = gpt_result[0]["data"]

    assert data["rozmiar"] == 73.05
    assert data["pokoje"] == 3
    assert data["ulica"] == "Buchenwaldczyków 3"
    assert data["miasto"] == "Zabrze"
    assert data["kod_pocztowy"] == "41-807"
    assert data["cena"] == 74533
    assert data["nr_ksiegi_wieczystej"] == "GL1Z/00033323/3"
    assert data["wadium"] == 11180
    assert data["piwnica"] is True

def test_extract_text_and_gpt_on_invalid_pdf():
    pdf_path = "file:///opt/airflow/tests/test_pdf2.pdf"
    result = extract_text_from_links([pdf_path])
    assert isinstance(result, list)
    assert result[0]["url"].endswith("test_pdf2.pdf")
    assert result[0]["text"].strip() != ""

    api_key = os.getenv("OPENAI_API_KEY")
    assert api_key is not None and api_key != "", "OPENAI_API_KEY is not set"

    try:
        gpt_result = extract_data_with_gpt(result)
    except Exception as e:
        pytest.fail(f"Error during extract_data_with_gpt: {e}")

    assert isinstance(gpt_result, list)
    assert len(gpt_result) == 1
    assert gpt_result[0]["url"].endswith("test_pdf2.pdf")
    assert isinstance(gpt_result[0]["data"], dict)
    data = gpt_result[0]["data"]

    assert data["rozmiar"] is None
    assert data["pokoje"] is None
    assert data["ulica"] is None
    assert data["miasto"] is None
    assert data["kod_pocztowy"] is None
    assert data["cena"] is None
    assert data["nr_ksiegi_wieczystej"] is None
    assert data["wadium"] is None
    assert data["pietro"] is None
    assert data["termin_ogledzin"] is None
    assert data["piwnica"] is None
    assert data["nr_dzialki"] is None
    assert data["prawo"] is None
    assert data["inne"] is None

def test_full_pdf_to_property_data_pipeline():
    pdf_path = "file:///opt/airflow/tests/test_pdf1.pdf"
    result = extract_text_from_links([pdf_path])
    assert isinstance(result, list)
    assert result[0]["url"].endswith("test_pdf1.pdf")
    assert result[0]["text"].strip() != ""

    api_key = os.getenv("OPENAI_API_KEY")
    assert api_key is not None and api_key != "", "OPENAI_API_KEY is not set"

    try:
        gpt_result = extract_data_with_gpt(result)
    except Exception as e:
        pytest.fail(f"Error during extract_data_with_gpt: {e}")

    assert isinstance(gpt_result, list)
    assert len(gpt_result) == 1
    assert gpt_result[0]["url"].endswith("test_pdf1.pdf")
    assert isinstance(gpt_result[0]["data"], dict)

    processor = DataProcessor()
    processed = processor.process_data(gpt_result)
    assert isinstance(processed, list)
    assert len(processed) == 1
    prop = processed[0]

    assert prop.rozmiar == 73.05
    assert prop.pokoje == 3
    assert prop.ulica == "Buchenwaldczyków 3"
    assert prop.miasto == "Zabrze"
    assert prop.kod_pocztowy == "41-807"
    assert prop.cena == 74533
    assert prop.nr_ksiegi_wieczystej == "GL1Z/00033323/3"
    assert prop.wadium == 11180
    assert prop.piwnica == 1
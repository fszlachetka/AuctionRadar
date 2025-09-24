import os
from dags.ScrapData.scrape_utils import extract_text_from_links, extract_data_with_gpt
import pytest

def test_extract_text_and_gpt_on_pdf2():
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
    assert isinstance(gpt_result[0]["data"], str)
    assert len(gpt_result[0]["data"].strip()) > 0

    expected_fragments = [
        '"rozmiar": None',
        '"pokoje": None',
        '"ulica": None',
        '"miasto": None',
        '"kod_pocztowy": None',
        '"wywolawcza": None',
        '"ksiegawieczysta": None',
        '"wadium": None',
        '"pietro": None',
        '"termin_ogledzin": None',
        '"piwnica": None',
        '"dzialka_nr": None',
        '"prawo": None',
        '"inne": None'
    ]
    for fragment in expected_fragments:
        assert fragment in gpt_result[0]["data"]

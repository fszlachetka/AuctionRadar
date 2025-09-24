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
    assert isinstance(gpt_result[0]["data"], dict)
    data = gpt_result[0]["data"]

    assert data["rozmiar"] is None
    assert data["pokoje"] is None
    assert data["ulica"] is None
    assert data["miasto"] is None
    assert data["kod_pocztowy"] is None
    assert data["wywolawcza"] is None
    assert data["ksiegawieczysta"] is None
    assert data["wadium"] is None
    assert data["pietro"] is None
    assert data["termin_ogledzin"] is None
    assert data["piwnica"] is None
    assert data["dzialka_nr"] is None
    assert data["prawo"] is None
    assert data["inne"] is None

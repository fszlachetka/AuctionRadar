import os
from dags.ScrapData.scrape_utils import extract_text_from_links, extract_data_with_gpt
import pytest
import ast

def test_extract_text_and_gpt_on_pdf():
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
    assert data["wywolawcza"] == 74533.33
    assert data["ksiegawieczysta"] == "GL1Z/00033323/3"
    assert data["wadium"] == 11180
    assert data["piwnica"] is True
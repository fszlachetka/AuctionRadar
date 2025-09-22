import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../dags')))

from utils import fetch_urls, download_final_links, extract_text_from_links, extract_data_with_gpt

import pytest
from unittest.mock import patch, MagicMock

def test_fetch_urls():
    with patch("utils.requests.get") as mock_get:
        mock_response = MagicMock()
        mock_response.text = "<html><a href='test.pdf'>PDF</a></html>"
        mock_get.return_value = mock_response
        test_urls = {"http://example.com": [[".pdf"], ("doc,")]}
        result = fetch_urls(test_urls)
        assert ('http://example.com/test.pdf', 'doc,') in result

def test_download_final_links():
    with patch("utils.requests.get") as mock_get:
        mock_response = MagicMock()
        mock_response.text = "<html><a href='file.pdf'>PDF</a></html>"
        mock_get.return_value = mock_response
        all_urls = [("http://example.com", [".pdf"])]
        kwargs = {"ti": MagicMock()}
        kwargs["ti"].xcom_pull.return_value = all_urls
        result = download_final_links(**kwargs)
        assert 'http://example.com/file.pdf' in result

def test_extract_text_from_links():
    with patch("utils.requests.get") as mock_get, \
         patch("utils.PdfReader") as mock_pdf_reader, \
         patch("builtins.open", MagicMock()):
        mock_pdf_response = MagicMock()
        mock_pdf_response.content = b"PDFDATA"
        mock_pdf_response.text = ""
        mock_html_response = MagicMock()
        mock_html_response.text = "<html>Test HTML</html>"
        mock_html_response.content = b""
        mock_get.side_effect = [mock_pdf_response, mock_html_response]

        mock_pdf = MagicMock()
        mock_page = MagicMock()
        mock_page.extract_text.return_value = "PDF text"
        mock_pdf.pages = [mock_page]
        mock_pdf_reader.return_value = mock_pdf

        final_links = ["http://example.com/test.pdf", "http://example.com/test.html"]
        kwargs = {"ti": MagicMock()}
        kwargs["ti"].xcom_pull.return_value = final_links
        result = extract_text_from_links(**kwargs)
        assert result[0]["url"] == "http://example.com/test.pdf"
        assert "PDF text" in result[0]["text"]
        assert result[1]["url"] == "http://example.com/test.html"
        assert "Test HTML" in result[1]["text"]

def test_extract_data_with_gpt():
    fake_ti = MagicMock()
    fake_ti.xcom_pull.return_value = [
        {'url': 'http://example.com/test.pdf', 'text': 'Test tekst PDF'},
        {'url': 'http://example.com/test.html', 'text': 'Test tekst HTML'}
    ]
    kwargs = {"ti": fake_ti}

    with patch("utils.openai.ChatCompletion.create") as mock_create, \
         patch("utils.prompt_template", "PROMPT: "), \
         patch("utils.load_dotenv"), \
         patch("utils.os.getenv", return_value="FAKE_KEY"):
        mock_create.return_value = MagicMock(
            choices=[MagicMock(message={'content': 'Wynik GPT'})]
        )

        result = extract_data_with_gpt(**kwargs)

        assert result[0]['url'] == 'http://example.com/test.pdf'
        assert result[0]['data'] == 'Wynik GPT'
        assert result[1]['url'] == 'http://example.com/test.html'
        assert result[1]['data'] == 'Wynik GPT'
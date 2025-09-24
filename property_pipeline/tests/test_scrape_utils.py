import sys
import os
from types import SimpleNamespace
from dags.ScrapData.scrape_utils import fetch_urls, download_final_links, extract_text_from_links, extract_data_with_gpt

import pytest
from unittest.mock import patch, MagicMock


def test_fetch_urls():
    with patch("dags.ScrapData.scrape_utils.requests.get") as mock_get:
        mock_response = MagicMock()
        mock_response.text = "<html><a href='test.pdf'>PDF</a></html>"
        mock_get.return_value = mock_response
        test_urls = {"http://example.com": [[".pdf"], ("doc,")]}
        result = fetch_urls(test_urls)
        assert ('http://example.com/test.pdf', 'doc,') in result

def test_download_final_links():
    with patch("dags.ScrapData.scrape_utils.requests.get") as mock_get:
        mock_response = MagicMock()
        mock_response.text = "<html><a href='file.pdf'>PDF</a></html>"
        mock_get.return_value = mock_response
        all_urls = [("http://example.com", [".pdf"])]
        result = download_final_links(all_urls)
        assert 'http://example.com/file.pdf' in result

def test_extract_text_from_links():
    with patch("dags.ScrapData.scrape_utils.requests.get") as mock_get, \
            patch("dags.ScrapData.scrape_utils.PdfReader") as mock_pdf_reader, \
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
        result = extract_text_from_links(final_links)
        assert result[0]["url"] == "http://example.com/test.pdf"
        assert "PDF text" in result[0]["text"]
        assert result[1]["url"] == "http://example.com/test.html"
        assert "Test HTML" in result[1]["text"]


def test_extract_data_with_gpt():
    texts = [
        {'url': 'http://example.com/test.pdf', 'text': 'Test tekst PDF'},
        {'url': 'http://example.com/test.html', 'text': 'Test tekst HTML'}
    ]
    with patch("dags.ScrapData.scrape_utils.openai.OpenAI") as mock_openai, \
         patch("dags.ScrapData.scrape_utils.prompt_template", "PROMPT: "), \
         patch("dags.ScrapData.scrape_utils.load_dotenv"), \
         patch("dags.ScrapData.scrape_utils.os.getenv", return_value="FAKE_KEY"):
        class Message:
            def __init__(self, content):
                self.content = content
        class Choice:
            def __init__(self, message):
                self.message = message
        class Response:
            def __init__(self, choices):
                self.choices = choices
        mock_client = MagicMock()
        mock_openai.return_value = mock_client
        mock_client.chat.completions.create.side_effect = [
            Response([Choice(Message("{'rozmiar': 73.05, 'pokoje': 3}"))]),
            Response([Choice(Message("{'rozmiar': 55.0, 'pokoje': 2}"))])
        ]
        result = extract_data_with_gpt(texts)
        pdf_data = next(item for item in result if item['url'] == 'http://example.com/test.pdf')
        html_data = next(item for item in result if item['url'] == 'http://example.com/test.html')

        assert isinstance(pdf_data['data'], dict)
        assert pdf_data['data']['rozmiar'] == 73.05
        assert pdf_data['data']['pokoje'] == 3

        assert isinstance(html_data['data'], dict)
        assert html_data['data']['rozmiar'] == 55.0
        assert html_data['data']['pokoje'] == 2

def test_full_pipeline():
    with patch("dags.ScrapData.scrape_utils.requests.get") as mock_get, \
            patch("dags.ScrapData.scrape_utils.PdfReader") as mock_pdf_reader, \
            patch("builtins.open", MagicMock()), \
            patch("dags.ScrapData.scrape_utils.openai.OpenAI") as mock_openai, \
            patch("dags.ScrapData.scrape_utils.prompt_template", "PROMPT: "), \
            patch("dags.ScrapData.scrape_utils.load_dotenv"), \
            patch("dags.ScrapData.scrape_utils.os.getenv", return_value="FAKE_KEY"):

        mock_response_fetch = MagicMock()
        mock_response_fetch.text = "<html><a href='test.pdf'>PDF</a><a href='test.html'>HTML</a></html>"
        mock_response_final_pdf = MagicMock()
        mock_response_final_pdf.text = "<html><a href='file.pdf'>PDF</a></html>"
        mock_response_final_html = MagicMock()
        mock_response_final_html.text = "<html><a href='file.html'>HTML</a></html>"
        mock_pdf_response = MagicMock()
        mock_pdf_response.content = b"PDFDATA"
        mock_pdf_response.text = ""
        mock_html_response = MagicMock()
        mock_html_response.text = "<html>Test HTML</html>"
        mock_html_response.content = b""
        mock_get.side_effect = [
            mock_response_fetch,
            mock_response_final_pdf,
            mock_response_final_html,
            mock_pdf_response,
            mock_html_response
        ]

        mock_pdf = MagicMock()
        mock_page = MagicMock()
        mock_page.extract_text.return_value = "PDF text"
        mock_pdf.pages = [mock_page]
        mock_pdf_reader.return_value = mock_pdf

        class Message:
            def __init__(self, content):
                self.content = content
        class Choice:
            def __init__(self, message):
                self.message = message
        class Response:
            def __init__(self, choices):
                self.choices = choices
        mock_client = MagicMock()
        mock_openai.return_value = mock_client

        mock_client.chat.completions.create.side_effect = [
            Response([Choice(Message("{'rozmiar': 73.05, 'pokoje': 3}"))]),
            Response([Choice(Message("{'rozmiar': 55.0, 'pokoje': 2}"))])
        ]

        test_urls = {
            "http://example.com": [["test"], (".pdf", ".html")]
        }
        urls_result = fetch_urls(test_urls)
        final_links_result = download_final_links(urls_result)
        text_result = extract_text_from_links(final_links_result)
        gpt_result = extract_data_with_gpt(text_result)

        pdf_data = next(item for item in gpt_result if item['url'].endswith('.pdf'))
        html_data = next(item for item in gpt_result if item['url'].endswith('.html'))

        assert isinstance(pdf_data['data'], dict)
        assert pdf_data['data']['rozmiar'] == 73.05
        assert pdf_data['data']['pokoje'] == 3

        assert isinstance(html_data['data'], dict)
        assert html_data['data']['rozmiar'] == 55.0
        assert html_data['data']['pokoje'] == 2
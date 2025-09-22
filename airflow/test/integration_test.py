import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../dags')))

from unittest.mock import patch, MagicMock

def test_full_pipeline():
    with patch("utils.requests.get") as mock_get, \
         patch("utils.PdfReader") as mock_pdf_reader, \
         patch("builtins.open", MagicMock()), \
         patch("utils.openai.ChatCompletion.create") as mock_create, \
         patch("utils.prompt_template", "PROMPT: "), \
         patch("utils.load_dotenv"), \
         patch("utils.os.getenv", return_value="FAKE_KEY"):

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

        mock_create.return_value = MagicMock(
            choices=[MagicMock(message={'content': 'Wynik GPT'})]
        )

        from utils import fetch_urls, download_final_links, extract_text_from_links, extract_data_with_gpt

        test_urls = {
            "http://example.com": [["test"], (".pdf", ".html")]
        }
        urls_result = fetch_urls(test_urls)
        print("Fetched URLs:", urls_result)
    
        kwargs_final = {"ti": MagicMock()}
        kwargs_final["ti"].xcom_pull.return_value = urls_result
        final_links_result = download_final_links(**kwargs_final)
        print("Final Links:", final_links_result)
        kwargs_text = {"ti": MagicMock()}
        kwargs_text["ti"].xcom_pull.return_value = final_links_result
        text_result = extract_text_from_links(**kwargs_text)
        print("Extracted Text:", text_result)
    
        kwargs_gpt = {"ti": MagicMock()}
        kwargs_gpt["ti"].xcom_pull.return_value = text_result
        gpt_result = extract_data_with_gpt(**kwargs_gpt)
        print("GPT Results:", gpt_result)

        assert any("PDF text" in item["text"] for item in text_result)
        assert any("Test HTML" in item["text"] for item in text_result)
        assert all(item["data"] == "Wynik GPT" for item in gpt_result)

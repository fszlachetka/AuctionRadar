import requests
from bs4 import BeautifulSoup
import openai
from urllib.parse import urljoin
from PyPDF2 import PdfReader
import os
from dags.ScrapData.sources import urls, prompt_template
from dotenv import load_dotenv


def fetch_urls(urls_arg=None):
    all_urls = set()
    urls_arg = urls if urls_arg is None else urls_arg
    for key, value in urls_arg.items():
        response = requests.get(key)
        soup = BeautifulSoup(response.text, 'html.parser')
        for a in soup.find_all('a', href=True):
            for pattern in value[0]:
                if pattern in a['href']:
                    full_url = urljoin(key, a['href'])
                    all_urls.add((full_url, value[1]))
    return list(all_urls)


def download_final_links(all_urls):
    final_links = []
    for url, patterns in all_urls:
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        links = [a['href'] for a in soup.find_all('a', href=True) if any (pattern in a['href'] for pattern in patterns)]
        full_links = [l if l.startswith('http') else urljoin(url, l) for l in links]
        final_links.extend(full_links)
    return final_links


def extract_text_from_links(final_links):
    texts = []

    for pdf_url in final_links:
        text = ""
        r = requests.get(pdf_url)
        if pdf_url.endswith('.pdf') or pdf_url.endswith('/pdf'):
            with open('/tmp/temp.pdf', 'wb') as f:
                f.write(r.content)
            reader = PdfReader('/tmp/temp.pdf')
            for page in reader.pages:
                text += page.extract_text() or ""
        else:
            soup = BeautifulSoup(r.text, 'html.parser')
            text = soup.get_text(separator="\n", strip=True)
        texts.append({'url': pdf_url, 'text': text})
    return texts


def extract_data_with_gpt(texts):
    load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "../../.env"))
    openai.api_key = os.getenv('OPENAI_API_KEY')
    model="gpt-4"
    results = []
    for item in texts:
        prompt = prompt_template + f"\n{item['text']}"
        response = openai.ChatCompletion.create(
            model=model,
            messages=[{"role": "user", "content": prompt}]
        )
        results.append({'url': item['url'], 'data': response.choices[0].message['content']})
    return results
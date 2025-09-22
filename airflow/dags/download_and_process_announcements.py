from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta
from utils import fetch_urls, download_final_links, extract_text_from_links, extract_data_with_gpt

default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

with DAG(
    dag_id = 'download_and_process_announcements',
    default_args = default_args,
    description = 'Downloads announcements and extracts data using GPT',
    schedule = '@daily',
    start_date = datetime(2025, 9, 15),
    catchup = False,
) as dag:
    fetch_urls = PythonOperator(
        task_id = 'fetch_urls',
        python_callable = fetch_urls
    )
    download_final_links = PythonOperator(
        task_id = 'download_final_links',
        python_callable = download_final_links
    )
    extract_text = PythonOperator(
        task_id = 'extract_text_from_links',
        python_callable = extract_text_from_links
    )
    extract_data = PythonOperator(
        task_id = 'extract_data_with_gpt',
        python_callable = extract_data_with_gpt
    )
    send_to_backend = PythonOperator(
        task_id = 'send_to_backend',
        python_callable = lambda: print("Sending data") #to be implemented
    )
    fetch_urls >> download_final_links >> extract_text >> extract_data >> send_to_backend
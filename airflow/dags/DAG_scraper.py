import sys
import logging
from datetime import timedelta
from typing import List

from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.utils.dates import days_ago

logger = logging.getLogger(__name__)

sys.path.append('/opt/airflow/dags/ScrapData')
sys.path.append('/opt/airflow/dags/ProcessData')
sys.path.append('/opt/airflow/dags/InsertData')

# from ScrapData import DataScraper
from ProcessData import DataProcessor
from InsertData import DB_insert as DbInsert

default_args = {
    'owner': 'IO9',
    'retries': 5,
    'retry_delay': timedelta(minutes=5),
}

dag_params = {
    "scraper_name": "PropertyScraper"  # typu parser albo ai agent
}


def scrape_data(scraper_name: str, **context) -> List[dict]:
    """
    Zadanie do scrapowania danych z użyciem dynamicznie wybranego scrapera.
    Zwraca listę surowych danych (słowników).
    """
    try:
        # Pamiętaj, aby plik z bazowym scraperem nazywał się "DataScraper.py"
        scraper_class = getattr(DataScraper, scraper_name)
        scraper = scraper_class()

        logger.info(f"Using scraper: {scraper_name}")
        raw_properties = scraper.scrape_properties()

        task_instance = context['ti']
        task_instance.xcom_push(key='raw_properties', value=raw_properties)

        return raw_properties
    except AttributeError:
        logger.error(f"Scraper class '{scraper_name}' not found.")
        raise
    except Exception as e:
        logger.error(f"An error occurred during scraping: {e}")
        raise


def process_data(**context) -> List[dict]:
    """
    Zadanie do przetwarzania surowych danych.
    Pobiera dane z XComs, przetwarza i zwraca oczyszczone dane.
    """
    task_instance = context['ti']
    raw_properties = task_instance.xcom_pull(task_ids='scrape_data', key='raw_properties')

    if not raw_properties:
        logger.info("No data to process. Exiting.")
        return []

    processor = DataProcessor.DataProcessor()
    processed_properties = processor.process_data(raw_properties)

    task_instance.xcom_push(key='processed_properties', value=processed_properties)

    return processed_properties


def insert_data(**context):
    """
    Zadanie do wstawiania przetworzonych danych do bazy danych.
    Pobiera dane z XComs i wywołuje funkcję insert_property.
    """
    task_instance = context['ti']
    processed_properties = task_instance.xcom_pull(task_ids='process_data', key='processed_properties')

    if not processed_properties:
        logger.info("No processed data to insert. Exiting.")
        return

    # Inicjalizacja bazy danych
    # DbInsert.init_db()

    inserted_count = 0
    for prop in processed_properties:
        if isinstance(prop, DbInsert.PropertyData):
            DbInsert.insert_property(prop)
            inserted_count += 1
        else:
            logger.warning(f"Invalid data format received for insertion: {type(prop)}")

    logger.info(f"Successfully inserted {inserted_count} records into the database.")


with DAG(
        dag_id='property_scraper_dag',
        default_args=default_args,
        schedule_interval='@daily',
        catchup=False,
        start_date=days_ago(1),
        tags=['real_estate', 'scraping'],
        params=dag_params,
) as dag:
    scrape_task = PythonOperator(
        task_id='scrape_data',
        python_callable=scrape_data,
        op_kwargs={'scraper_name': '{{ dag_run.conf.get("scraper_name", params.scraper_name) }}'},
        provide_context=True,
    )

    process_task = PythonOperator(
        task_id='process_data',
        python_callable=process_data,
        provide_context=True,
    )

    insert_task = PythonOperator(
        task_id='insert_data',
        python_callable=insert_data,
        provide_context=True,
    )

    scrape_task >> process_task >> insert_task
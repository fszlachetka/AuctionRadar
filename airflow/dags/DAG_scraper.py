import sys
from datetime import timedelta

from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.utils.dates import days_ago


sys.path.append('/opt/airflow/dags/ScrapData')
sys.path.append('/opt/airflow/dags/ProcessData')
sys.path.append('/opt/airflow/dags/InsertData')

from ScrapData import Scraper
from ProcessData import DataProcessor

default_args = {
    'owner': '<IO9>',
    'retries': 5,
    'retry_delay': timedelta(minutes=5),
}


def create_dag():
    with DAG(
            dag_id='property_scraper_dag',
            default_args=default_args,
            schedule_interval='@daily',
            catchup=False,
            start_date=days_ago(1),
            tags=['real_estate', 'scraping'],
    ) as dag:

        scraper = Scraper.PropertyScraper()
        #processor = DataProcessor
        #db_handler = DatabaseHandler()

        def scrape_data():
            """Task to scrape property data"""
            return scraper.scrape_properties()

        def process_data(**context):
            """Task to process scraped data"""
            pass

        def insert_data(**context):
            """Task to insert processed data into database"""
            pass

        # Define tasks
        scrape_task = PythonOperator(
            task_id='scrape_data',
            python_callable=scrape_data,
            provide_context=False,
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

        return dag


property_scraper_dag = create_dag()
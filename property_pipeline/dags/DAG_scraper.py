import logging
from datetime import timedelta, datetime
from typing import List, Dict, Any, Optional

from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.utils.dates import days_ago
from airflow.models import Variable

from ProcessData.DataProcessor import DataProcessor
from InsertData.DB_insert import insert_property, init_db
from ScrapData.Property_Data import PropertyData

logger = logging.getLogger(__name__)

default_args = {
    'owner': 'IO9',
    'retries': 3,
    'retry_delay': timedelta(minutes=5),
    'email_on_failure': False,
    'email_on_retry': False,
}

SCRAPER_CONFIGS = {
    'property_scraper': {
        'scraper_name': 'PropertyScraper',
        'schedule': '@daily',
        'description': 'Daily property scraping from main sources',
        'tags': ['real_estate', 'scraping', 'daily'],
        'max_active_runs': 1,
    },
    'property_scraper_hourly': {
        'scraper_name': 'PropertyScraper',
        'schedule': '@hourly',
        'description': 'Hourly property scraping for high-frequency updates',
        'tags': ['real_estate', 'scraping', 'hourly'],
        'max_active_runs': 1,
    },
    'property_scraper_weekly': {
        'scraper_name': 'PropertyScraper',
        'schedule': '@weekly',
        'description': 'Weekly property scraping for comprehensive updates',
        'tags': ['real_estate', 'scraping', 'weekly'],
        'max_active_runs': 1,
    },
}

SCRAPER_REGISTRY = {
    'PropertyScraper': PropertyScraper,  # To implement
    'CustomScraper': None,  # To implement
}


def get_scraper_instance(scraper_name: str, *args, **kwargs):
    """
    Returns instance of scraper using name
    """
    if scraper_name not in SCRAPER_REGISTRY:
        raise ValueError(
            f"Scraper '{scraper_name}' not found in registry. "
            f"Available scrapers: {list(SCRAPER_REGISTRY.keys())}"
        )

    scraper_class = SCRAPER_REGISTRY[scraper_name]
    return scraper_class(*args, **kwargs)



def scrape_data(scraper_name: str, **context) -> List[dict]:
    """
    Task for scraping data using selected scraper
    """
    try:
        logger.info(f"Starting scraping with scraper: {scraper_name}")

        scraper = get_scraper_instance(scraper_name)
        raw_properties = scraper.scrape_properties()

        task_instance = context['ti']
        task_instance.xcom_push(key='raw_properties', value=raw_properties)
        task_instance.xcom_push(key='scraper_name', value=scraper_name)

        logger.info(f"Successfully scraped {len(raw_properties)} properties")
        return raw_properties

    except Exception as e:
        logger.error(f"Error during scraping with {scraper_name}: {e}")
        raise


def process_data(**context) -> List[PropertyData]:
    """
    Task for processing raw data
    """
    task_instance = context['ti']
    raw_properties = task_instance.xcom_pull(task_ids='scrape_data', key='raw_properties')
    scraper_name = task_instance.xcom_pull(task_ids='scrape_data', key='scraper_name')

    if not raw_properties:
        logger.warning("No data to process. Exiting.")
        return []

    try:
        logger.info(f"Processing {len(raw_properties)} properties from {scraper_name}")

        processor = DataProcessor()
        processed_properties = processor.process_data(raw_properties)

        task_instance.xcom_push(key='processed_properties', value=processed_properties)

        logger.info(f"Processed {len(processed_properties)} properties")
        return processed_properties

    except Exception as e:
        logger.error(f"Error while data processing: {e}")
        raise


def insert_data(**context):
    """
    Task for inserting data into database
    """
    task_instance = context['ti']
    processed_properties = task_instance.xcom_pull(task_ids='process_data', key='processed_properties')
    scraper_name = task_instance.xcom_pull(task_ids='scrape_data', key='scraper_name')

    if not processed_properties:
        logger.warning("No data to insert. Exiting.")
        return

    try:
        logger.info(f"Inserting {len(processed_properties)} properties from {scraper_name}")

        # Only invoked when db doesn't exist
        init_db()

        inserted_count = 0
        failed_count = 0

        for prop in processed_properties:
            try:
                if isinstance(prop, PropertyData):
                    insert_property(prop)
                    inserted_count += 1
                else:
                    logger.warning(f"Invalid data format received: {type(prop)}")
                    failed_count += 1
            except Exception as e:
                logger.error(f"Failed to insert property: {e}")
                failed_count += 1

        logger.info(f"Successfully inserted {inserted_count} records, {failed_count} failed")

        task_instance.xcom_push(key='inserted_count', value=inserted_count)
        task_instance.xcom_push(key='failed_count', value=failed_count)

    except Exception as e:
        logger.error(f"Error during data insertion: {e}")
        raise


def create_property_dag(config_name: str, config: Dict[str, Any]) -> DAG:
    """
    Factory to create DAG instances with different configurations
    """

    dag_id = f'property_scraper_{config_name}'

    scraper_name = config.get('scraper_name', 'PropertyScraper')

    with DAG(
            dag_id=dag_id,
            default_args=default_args,
            description=config.get('description', f'Property scraping DAG - {config_name}'),
            schedule_interval=config.get('schedule', '@daily'),
            catchup=False,
            start_date=days_ago(1),
            tags=config.get('tags', ['real_estate', 'scraping']),
            max_active_runs=config.get('max_active_runs', 1),
            params={
                'scraper_name': scraper_name,
                'config_name': config_name
            }
    ) as dag:
        scrape_task = PythonOperator(
            task_id='scrape_data',
            python_callable=scrape_data,
            op_kwargs={
                'scraper_name': '{{ dag_run.conf.get("scraper_name", params.scraper_name) }}'
            },
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

        return dag


daily_dag = create_property_dag('daily', SCRAPER_CONFIGS['property_scraper'])
dag = daily_dag
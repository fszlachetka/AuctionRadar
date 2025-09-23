import pytest
import os
import sys
import subprocess
from pathlib import Path

project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

dags_path = project_root / "dags"
sys.path.insert(0, str(dags_path))

TEST_DATABASE_URL = "postgresql+psycopg2://postgres:postgres@db_test:5432/testdb"

os.environ.setdefault("TESTING", "true")
os.environ.setdefault("DATABASE_URL", TEST_DATABASE_URL)


@pytest.fixture(scope="session")
def test_database_url():
    return TEST_DATABASE_URL


@pytest.fixture(scope="session", autouse=True)
def setup_test_environment():
    """
    Setup test environment before running tests
    """
    os.environ["TESTING"] = "true"
    yield
    if "TESTING" in os.environ:
        del os.environ["TESTING"]

@pytest.fixture(scope="session", autouse=True)
def copy_pdf_to_container():
    """
    Copy a test PDF file into the Docker container
    """
    local_pdf = "./property_pipeline/tests/test_pdf1.pdf"
    if not os.path.exists(local_pdf):
        print(f"Test PDF file does not exist at {local_pdf}")
        return
    try:
        subprocess.run(
            [
                "docker", "cp",
                local_pdf,
                "airflow-webserver:/opt/airflow/tests/test_pdf1.pdf"
            ],
            check=True
        )
    except Exception as e:
        print(f"Couldn't copy PDF file to the container: {e}")


def pytest_configure(config):
    """
    Configure pytest with custom markers
    """
    config.addinivalue_line(
        "markers", "integration: mark test as integration test"
    )
    config.addinivalue_line(
        "markers", "unit: mark test as unit test"
    )
    config.addinivalue_line(
        "markers", "slow: mark test as slow running"
    )

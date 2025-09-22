import pytest
import datetime
from faker import Faker
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from dags.InsertData.DB_insert import Base, Mieszkanie, insert_property
from dags.ProcessData.DataProcessor import DataProcessor
from dags.ScrapData.Property_Data import PropertyData

fake = Faker('pl_PL')

TEST_DATABASE_URL = "postgresql+psycopg2://postgres:postgres@db_test:5432/testdb"


@pytest.fixture(scope="session")
def test_engine():
    """
    Engine for test database in separate container
    """
    engine = create_engine(TEST_DATABASE_URL)
    Base.metadata.create_all(engine)
    yield engine
    Base.metadata.drop_all(engine)
    engine.dispose()


@pytest.fixture
def db_session(test_engine):
    """
    Clean session for each test
    """
    SessionLocal = sessionmaker(bind=test_engine)
    session = SessionLocal()
    try:
        session.query(Mieszkanie).delete()
        session.commit()
        yield session
    finally:
        session.rollback()
        session.close()


@pytest.fixture
def mock_property_data():
    """
    Generate mock data for testing
    """
    return {
        "mieszkanie_id": "1",
        "rozmiar": f"{fake.random_int(min=30, max=150)}.5 m2",
        "pokoje": str(fake.random_int(min=1, max=5)),
        "ulica": fake.street_name(),
        "miasto": fake.city(),
        "kod_pocztowy": fake.postcode(),
        "wywolawcza": str(fake.random_int(min=100000, max=1000000)),
        "ksiegawieczysta": "WL1A/00272852/9",  # Valid księga wieczysta
        "wadium": str(fake.random_int(min=1000, max=10000)),
        "pietro": fake.random_element(elements=("parter", "1", "2", "3", "4", "5")),
        "termin_ogledzin": fake.date_time_between(start_date='+1d', end_date='+30d').strftime("%Y-%m-%d %H:%M:%S"),
        "piwnica": fake.random_element(elements=("tak", "nie", "1", "0")),
        "inne": fake.text(max_nb_chars=100),
        "dzialka_NR": fake.bothify(text="###/##"),
        "prawo": fake.random_element(elements=("własność", "spółdzielcze", "użytkowanie wieczyste")),
    }


@pytest.fixture
def mock_property_data_list():
    """
    Generate a list of mock property data
    """
    return [
        {
            "mieszkanie_id": str(i),
            "rozmiar": f"{fake.random_int(min=30, max=150)}.5 m2",
            "pokoje": str(fake.random_int(min=1, max=5)),
            "ulica": fake.street_name(),
            "miasto": fake.city(),
            "kod_pocztowy": fake.postcode(),
            "wywolawcza": str(fake.random_int(min=100000, max=1000000)),
            "ksiegawieczysta": "WL1A/00272852/9",
            "wadium": str(fake.random_int(min=1000, max=10000)),
            "pietro": fake.random_element(elements=("parter", "1", "2", "3", "4", "5")),
            "termin_ogledzin": fake.date_time_between(start_date='+1d', end_date='+30d').strftime("%Y-%m-%d %H:%M:%S"),
            "piwnica": fake.random_element(elements=("tak", "nie", "1", "0")),
            "inne": fake.text(max_nb_chars=100),
            "dzialka_NR": f"{fake.random_int(min=1, max=16):02d}{fake.random_int(min=1, max=99):02d}{fake.random_int(min=1, max=99):02d}.{fake.random_int(min=1000, max=9999)}.{fake.random_int(min=100, max=999)}",
            "prawo": fake.random_element(elements=("własność", "spółdzielcze", "użytkowanie wieczyste")),
        }
        for i in range(1, 6)
    ]


class TestDataProcessorIntegration:

    def test_process_single_property(self, mock_property_data):
        """
        Test processing a single property
        """
        processor = DataProcessor()
        processed_data = processor.process_data([mock_property_data])
        
        assert len(processed_data) == 1
        prop = processed_data[0]
        assert isinstance(prop, PropertyData)
        assert prop.rozmiar > 0
        assert prop.pokoje > 0
        assert prop.ulica is not None
        assert prop.miasto is not None
        assert prop.kod_pocztowy is not None
        assert prop.wywolawcza > 0
        assert prop.wadium > 0
        assert prop.pietro >= 0
        assert prop.termin_ogledzin is not None

    def test_process_multiple_properties(self, mock_property_data_list):
        """
        Test processing multiple records
        """
        processor = DataProcessor()
        processed_data = processor.process_data(mock_property_data_list)
        
        assert len(processed_data) == 5
        for prop in processed_data:
            assert isinstance(prop, PropertyData)
            assert prop.rozmiar > 0
            assert prop.pokoje > 0

    def test_process_invalid_data(self):
        """
        Test processing invalid data
        """
        processor = DataProcessor()
        invalid_data = [{"invalid": "data"}]
        
        processed_data = processor.process_data(invalid_data)
        assert len(processed_data) == 1
        
        prop = processed_data[0]
        assert prop.rozmiar == 0.0
        assert prop.pokoje == 0
        assert prop.ulica == ""
        assert prop.miasto is None


class TestDatabaseIntegration:

    def test_insert_single_property(self, db_session, test_engine, mock_property_data):
        """
        Test inserting a single processed property
        """
        processor = DataProcessor()
        processed_data = processor.process_data([mock_property_data])
        assert len(processed_data) == 1
        
        import dags.InsertData.DB_insert as db_insert
        db_insert.SessionLocal = sessionmaker(bind=test_engine)     # switching db
        
        prop = processed_data[0]
        mieszkanie_id = insert_property(prop)
        
        assert mieszkanie_id is not None
        
        result = db_session.query(Mieszkanie).filter_by(mieszkanie_id=mieszkanie_id).first()
        assert result is not None
        assert result.rozmiar == prop.rozmiar
        assert result.pokoje == prop.pokoje
        assert result.ulica == prop.ulica
        assert result.miasto == prop.miasto

    def test_insert_multiple_properties(self, db_session, test_engine, mock_property_data_list):
        """
        Test inserting multiple processed properties
        """
        processor = DataProcessor()
        processed_data = processor.process_data(mock_property_data_list)
        assert len(processed_data) == 5
        
        import dags.InsertData.DB_insert as db_insert
        db_insert.SessionLocal = sessionmaker(bind=test_engine)
        
        inserted_ids = []
        for prop in processed_data:
            mieszkanie_id = insert_property(prop)
            assert mieszkanie_id is not None
            inserted_ids.append(mieszkanie_id)
        
        results = db_session.query(Mieszkanie).filter(Mieszkanie.mieszkanie_id.in_(inserted_ids)).all()
        assert len(results) == 5
        
        for result in results:
            assert result.rozmiar > 0
            assert result.pokoje > 0
            assert result.ulica is not None
            assert result.miasto is not None


class TestFullPipelineIntegration:
    def test_full_pipeline_single_property(self, db_session, test_engine, mock_property_data):
        """
        Test complete pipeline
        """

        processor = DataProcessor()
        processed_data = processor.process_data([mock_property_data])
        assert len(processed_data) == 1
        
        import dags.InsertData.DB_insert as db_insert
        db_insert.SessionLocal = sessionmaker(bind=test_engine)
        
        prop = processed_data[0]
        mieszkanie_id = insert_property(prop)
        assert mieszkanie_id is not None
        
        result = db_session.query(Mieszkanie).filter_by(mieszkanie_id=mieszkanie_id).first()
        assert result is not None
        
        assert result.rozmiar == prop.rozmiar
        assert result.pokoje == prop.pokoje
        assert result.ulica == prop.ulica
        assert result.miasto == prop.miasto
        assert result.kod_pocztowy == prop.kod_pocztowy
        assert result.wywolawcza == prop.wywolawcza
        assert result.ksiegawieczysta == prop.nr_ksiegi_wieczystej
        assert result.wadium == prop.wadium
        assert result.pietro == prop.pietro
        assert result.termin_ogledzin == prop.termin_ogledzin
        assert result.piwnica == prop.piwnica
        assert result.inne == prop.inne
        assert result.dzialka_nr == prop.nr_dzialki
        assert result.prawo == prop.prawo

    def test_full_pipeline_multiple_properties(self, db_session, test_engine, mock_property_data_list):
        """
        Test complete pipeline with multiple properties
        """
        processor = DataProcessor()
        processed_data = processor.process_data(mock_property_data_list)
        assert len(processed_data) == 5
        
        import dags.InsertData.DB_insert as db_insert
        db_insert.SessionLocal = sessionmaker(bind=test_engine)
        
        inserted_ids = []
        for prop in processed_data:
            mieszkanie_id = insert_property(prop)
            assert mieszkanie_id is not None
            inserted_ids.append(mieszkanie_id)
        
        results = db_session.query(Mieszkanie).filter(Mieszkanie.mieszkanie_id.in_(inserted_ids)).all()
        assert len(results) == 5
        
        for i, result in enumerate(results):
            original_prop = processed_data[i]
            assert result.rozmiar == original_prop.rozmiar
            assert result.pokoje == original_prop.pokoje
            assert result.ulica == original_prop.ulica
            assert result.miasto == original_prop.miasto

    def test_pipeline_with_mixed_valid_invalid_data(self, db_session, test_engine):
        """
        Test pipeline with mix of valid and invalid data
        """
        mixed_data = [
            {
                "mieszkanie_id": "1",
                "rozmiar": "50.5 m2",
                "pokoje": "3",
                "ulica": "Testowa 1",
                "miasto": "Kraków",
                "kod_pocztowy": "31-000",
                "wywolawcza": "100000",
                "ksiegawieczysta": "WL1A/00272852/9",
                "wadium": "5000",
                "pietro": "parter",
                "termin_ogledzin": "2025-05-15",
                "piwnica": "tak",
                "inne": "Balkon",
                "dzialka_NR": "123",
                "prawo": "własność",
            },
            {
                "invalid": "data"
            },
            {
                "mieszkanie_id": "3",
                "rozmiar": "75.0 m2",
                "pokoje": "4",
                "ulica": "Kwiatowa 2",
                "miasto": "Warszawa",
                "kod_pocztowy": "02-123",
                "wywolawcza": "200000",
                "ksiegawieczysta": "WA1W/00012345/6",
                "wadium": "10000",
                "pietro": "1",
                "termin_ogledzin": "2025-06-20 12:00:00",
                "piwnica": "nie",
                "inne": "Balkon",
                "dzialka_NR": "456",
                "prawo": "spółdzielcze",
            }
        ]
        
        processor = DataProcessor()
        processed_data = processor.process_data(mixed_data)
        assert len(processed_data) == 3
        
        import dags.InsertData.DB_insert as db_insert
        db_insert.SessionLocal = sessionmaker(bind=test_engine)
        
        inserted_ids = []
        for prop in processed_data:
            if (prop.rozmiar is not None and prop.rozmiar > 0 and
                prop.miasto is not None and prop.termin_ogledzin is not None):
                mieszkanie_id = insert_property(prop)
                assert mieszkanie_id is not None
                inserted_ids.append(mieszkanie_id)
        
        results = db_session.query(Mieszkanie).filter(Mieszkanie.mieszkanie_id.in_(inserted_ids)).all()
        assert len(results) == 2
        
        cities = [result.miasto for result in results]
        assert "Kraków" in cities
        assert "Warszawa" in cities


class TestDataValidationIntegration:
    def test_ksiega_wieczysta_validation(self, db_session, test_engine):
        """
        Test księga wieczysta validation in the pipeline
        """
        test_data = [
            {
                "mieszkanie_id": "1",
                "rozmiar": "50.5 m2",
                "pokoje": "3",
                "ulica": "Testowa 1",
                "miasto": "Kraków",
                "kod_pocztowy": "31-000",
                "wywolawcza": "100000",
                "ksiegawieczysta": "WL1A/00272852/9",
                "wadium": "5000",
                "pietro": "parter",
                "termin_ogledzin": "2025-05-15",
                "piwnica": "tak",
                "inne": "Balkon",
                "dzialka_NR": "123",
                "prawo": "własność",
            },
            {
                "mieszkanie_id": "2",
                "rozmiar": "75.0 m2",
                "pokoje": "4",
                "ulica": "Kwiatowa 2",
                "miasto": "Warszawa",
                "kod_pocztowy": "02-123",
                "wywolawcza": "200000",
                "ksiegawieczysta": "INVALID/123456/7",
                "wadium": "10000",
                "pietro": "1",
                "termin_ogledzin": "2025-06-20 12:00:00",
                "piwnica": "nie",
                "inne": "Balkon",
                "dzialka_NR": "456",
                "prawo": "spółdzielcze",
            }
        ]
        
        processor = DataProcessor()
        processed_data = processor.process_data(test_data)
        assert len(processed_data) == 2
        
        assert processed_data[0].nr_ksiegi_wieczystej == "WL1A/00272852/9"
        assert processed_data[1].nr_ksiegi_wieczystej == "0000/00000000/0"
        
        import dags.InsertData.DB_insert as db_insert
        db_insert.SessionLocal = sessionmaker(bind=test_engine)
        
        inserted_ids = []
        for prop in processed_data:
            mieszkanie_id = insert_property(prop)
            assert mieszkanie_id is not None
            inserted_ids.append(mieszkanie_id)
        
        results = db_session.query(Mieszkanie).filter(Mieszkanie.mieszkanie_id.in_(inserted_ids)).all()
        assert len(results) == 2
        
        valid_ksiega = [r for r in results if r.ksiegawieczysta == "WL1A/00272852/9"]
        invalid_ksiega = [r for r in results if r.ksiegawieczysta == "0000/00000000/0"]
        
        assert len(valid_ksiega) == 1
        assert len(invalid_ksiega) == 1

    def test_postal_code_normalization(self, db_session, test_engine):
        """
        Test postal code normalization in the pipeline
        """
        test_data = [
            {
                "mieszkanie_id": "1",
                "rozmiar": "50.5 m2",
                "pokoje": "3",
                "ulica": "Testowa 1",
                "miasto": "Kraków",
                "kod_pocztowy": "31 133",
                "wywolawcza": "100000",
                "ksiegawieczysta": "WL1A/00272852/9",
                "wadium": "5000",
                "pietro": "parter",
                "termin_ogledzin": "2025-05-15",
                "piwnica": "tak",
                "inne": "Balkon",
                "dzialka_NR": "123",
                "prawo": "własność",
            }
        ]
        
        processor = DataProcessor()
        processed_data = processor.process_data(test_data)
        assert len(processed_data) == 1
        
        assert processed_data[0].kod_pocztowy == "31-133"
        
        import dags.InsertData.DB_insert as db_insert
        db_insert.SessionLocal = sessionmaker(bind=test_engine)
        
        mieszkanie_id = insert_property(processed_data[0])
        assert mieszkanie_id is not None
        
        result = db_session.query(Mieszkanie).filter_by(mieszkanie_id=mieszkanie_id).first()
        assert result.kod_pocztowy == "31-133"


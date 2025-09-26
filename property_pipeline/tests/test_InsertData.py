import datetime
import pytest
from faker import Faker

from dags.InsertData.DB_insert import Base, Mieszkanie, insert_property, init_db
from dags.ScrapData.Property_Data import PropertyData
import dags.InsertData.DB_insert as db_insert

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

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
def sample_property_data():
    """
    Generate sample data for testing
    """
    return PropertyData(
        rozmiar=45.0,
        pokoje=2,
        ulica="Testowa 1",
        miasto="Kraków",
        kod_pocztowy="30-001",
        cena=200000,
        nr_ksiegi_wieczystej="KR1P/123456/7",
        wadium=2000,
        pietro=3,
        termin_ogledzin=datetime.datetime(year=2025, month=9, day=10),
        piwnica=1,
        inne=None,
        nr_dzialki="123/4",
        prawo="własność",
        xCoord=None,
        yCoord=None,
    )


@pytest.fixture
def multiple_property_data():
    """
    Generate multiple data for testing
    """
    return [
        PropertyData(
            rozmiar=45.0,
            pokoje=2,
            ulica="Testowa 1",
            miasto="Kraków",
            kod_pocztowy="30-001",
            cena=200000,
            nr_ksiegi_wieczystej="KR1P/123456/7",
            wadium=2000,
            pietro=3,
            termin_ogledzin=datetime.datetime(year=2025, month=9, day=10),
            piwnica=1,
            inne=None,
            nr_dzialki="123/4",
            prawo="własność",
            xCoord=None,
            yCoord=None,
        ),
        PropertyData(
            rozmiar=75.5,
            pokoje=4,
            ulica="Kwiatowa 15",
            miasto="Warszawa",
            kod_pocztowy="02-123",
            cena=350000,
            nr_ksiegi_wieczystej="WA1W/00012345/6",
            wadium=5000,
            pietro=1,
            termin_ogledzin=datetime.datetime(year=2025, month=10, day=15),
            piwnica=0,
            inne="Balkon",
            nr_dzialki="456/7",
            prawo="spółdzielcze",
            xCoord=None,
            yCoord=None,
        ),
        PropertyData(
            rozmiar=32.0,
            pokoje=1,
            ulica="Główna 3",
            miasto="Gdańsk",
            kod_pocztowy="80-001",
            cena=150000,
            nr_ksiegi_wieczystej="GD1G/00098765/4",
            wadium=1500,
            pietro=0,
            termin_ogledzin=datetime.datetime(year=2025, month=11, day=20),
            piwnica=1,
            inne="Antresola",
            nr_dzialki="789/1",
            prawo="użytkowanie wieczyste",
            xCoord=None,
            yCoord=None,
        )
    ]


class TestDatabaseSchema:
    def test_table_creation(self, test_engine):
        """
        Test that the mieszkania table is created correctly
        """
        with test_engine.connect() as conn:
            result = conn.execute(text("""
                SELECT column_name, data_type, is_nullable 
                FROM information_schema.columns 
                WHERE table_name = 'mieszkania'
                ORDER BY ordinal_position
            """))
            columns = result.fetchall()
            
            column_names = [col[0] for col in columns]
            expected_columns = [
                'mieszkanie_id', 'rozmiar', 'pokoje', 'ulica', 'miasto',
                'kod_pocztowy', 'cena', 'nr_ksiegi_wieczystej', 'wadium',
                'pietro', 'termin_ogledzin', 'piwnica', 'inne', 'nr_dzialki', 'prawo'
            ]
            
            for expected_col in expected_columns:
                assert expected_col in column_names, f"Column {expected_col} not found"

    def test_primary_key_constraint(self, test_engine):
        """
        Test that mieszkanie_id is the primary key
        """
        with test_engine.connect() as conn:
            result = conn.execute(text("""
                SELECT constraint_name, constraint_type
                FROM information_schema.table_constraints
                WHERE table_name = 'mieszkania' AND constraint_type = 'PRIMARY KEY'
            """))
            constraints = result.fetchall()
            assert len(constraints) == 1
            assert constraints[0][1] == 'PRIMARY KEY'

    def test_auto_increment_primary_key(self, test_engine):
        """
        Test that mieszkanie_id is serial
        """
        with test_engine.connect() as conn:
            result = conn.execute(text("""
                SELECT column_default
                FROM information_schema.columns
                WHERE table_name = 'mieszkania' AND column_name = 'mieszkanie_id'
            """))
            default_value = result.fetchone()[0]
            assert 'nextval' in default_value, "Primary key should auto-increment"


class TestDataInsertion:

    def test_insert_single_property(self, db_session, test_engine, sample_property_data):
        """
        Test inserting a single record
        """
        db_insert.SessionLocal = sessionmaker(bind=test_engine)
        
        mieszkanie_id = insert_property(sample_property_data)
        assert mieszkanie_id is not None
        assert isinstance(mieszkanie_id, int)
        assert mieszkanie_id > 0

        result = db_session.query(Mieszkanie).filter_by(mieszkanie_id=mieszkanie_id).first()
        assert result is not None
        assert result.rozmiar == sample_property_data.rozmiar
        assert result.pokoje == sample_property_data.pokoje
        assert result.ulica == sample_property_data.ulica
        assert result.miasto == sample_property_data.miasto
        assert result.kod_pocztowy == sample_property_data.kod_pocztowy
        assert result.cena == sample_property_data.cena
        assert result.nr_ksiegi_wieczystej == sample_property_data.nr_ksiegi_wieczystej
        assert result.wadium == sample_property_data.wadium
        assert result.pietro == sample_property_data.pietro
        assert result.termin_ogledzin == sample_property_data.termin_ogledzin
        assert result.piwnica == sample_property_data.piwnica
        assert result.inne == sample_property_data.inne
        assert result.nr_dzialki == sample_property_data.nr_dzialki
        assert result.prawo == sample_property_data.prawo

    def test_insert_multiple_properties(self, db_session, test_engine, multiple_property_data):
        """
        Test inserting multiple records
        """
        db_insert.SessionLocal = sessionmaker(bind=test_engine)
        
        inserted_ids = []
        for prop_data in multiple_property_data:
            mieszkanie_id = insert_property(prop_data)
            assert mieszkanie_id is not None
            inserted_ids.append(mieszkanie_id)
        
        assert len(inserted_ids) == 3
        
        results = db_session.query(Mieszkanie).filter(Mieszkanie.mieszkanie_id.in_(inserted_ids)).all()
        assert len(results) == 3
        
        cities = [result.miasto for result in results]
        assert "Kraków" in cities
        assert "Warszawa" in cities
        assert "Gdańsk" in cities

    def test_insert_with_null_values(self, db_session, test_engine):
        """
        Test inserting property with null values for optional fields
        """
        prop_with_nulls = PropertyData(
            rozmiar=50.0,
            pokoje=3,
            ulica="Testowa 2",
            miasto="Poznań",
            kod_pocztowy="60-001",
            cena=250000,
            nr_ksiegi_wieczystej="PO1P/00011111/2",
            wadium=3000,
            pietro=2,
            termin_ogledzin=datetime.datetime(year=2025, month=12, day=1),
            piwnica=None,
            inne=None,
            nr_dzialki=None,
            prawo=None,
            xCoord=None,
            yCoord=None,
        )
        
        db_insert.SessionLocal = sessionmaker(bind=test_engine)
        mieszkanie_id = insert_property(prop_with_nulls)
        assert mieszkanie_id is not None
        
        result = db_session.query(Mieszkanie).filter_by(mieszkanie_id=mieszkanie_id).first()
        assert result.piwnica is None
        assert result.inne is None
        assert result.nr_dzialki is None
        assert result.prawo is None

    def test_auto_increment_behavior(self, db_session, test_engine, sample_property_data):
        """
        Test that auto-increment works correctly for multiple insertions
        """
        db_insert.SessionLocal = sessionmaker(bind=test_engine)
        
        id1 = insert_property(sample_property_data)
        assert id1 is not None
        
        prop2 = PropertyData(
            rozmiar=60.0,
            pokoje=3,
            ulica="Irysowa 5",
            miasto="Wrocław",
            kod_pocztowy="50-001",
            cena=300000,
            nr_ksiegi_wieczystej="WR1W/00022222/3",
            wadium=4000,
            pietro=1,
            termin_ogledzin=datetime.datetime(year=2025, month=12, day=15),
            piwnica=0,
            inne="Taras",
            nr_dzialki="999/9",
            prawo="własność",
            xCoord=None,
            yCoord=None,
        )
        id2 = insert_property(prop2)
        assert id2 is not None
        assert id2 > id1, "Second ID should be greater than first"


class TestDataIntegrity:

    def test_required_fields_not_null(self, test_engine):
        """
        Test that required fields can't be null
        """
        db_insert.SessionLocal = sessionmaker(bind=test_engine)
        
        prop_with_nulls = PropertyData(
            rozmiar=None,
            pokoje=2,
            ulica="Testowa",
            miasto="Test",
            kod_pocztowy="00-000",
            cena=100000,
            nr_ksiegi_wieczystej="TE1T/00000000/0",
            wadium=1000,
            pietro=1,
            termin_ogledzin=datetime.datetime.now(),
            piwnica=0,
            inne=None,
            nr_dzialki=None,
            prawo=None,
            xCoord=None,
            yCoord=None,
        )
        
        result = insert_property(prop_with_nulls)
        assert result is None

    def test_data_type_validation(self, db_session, test_engine):
        """
        Test that data types are enforced
        """
        db_insert.SessionLocal = sessionmaker(bind=test_engine)
        
        prop = PropertyData(
            rozmiar=45.5,
            pokoje=2,
            ulica="Testowa 1",
            miasto="Kraków",
            kod_pocztowy="30-001",
            cena=200000,
            nr_ksiegi_wieczystej="KR1P/123456/7",
            wadium=2000,
            pietro=3,
            termin_ogledzin=datetime.datetime(year=2025, month=9, day=10),
            piwnica=1,
            inne="Test",
            nr_dzialki="123/4",
            prawo="własność",
            xCoord=None,
            yCoord=None,
        )
        
        mieszkanie_id = insert_property(prop)
        assert mieszkanie_id is not None
        
        result = db_session.query(Mieszkanie).filter_by(mieszkanie_id=mieszkanie_id).first()
        assert isinstance(result.rozmiar, float)
        assert isinstance(result.pokoje, int)
        assert isinstance(result.cena, int)
        assert isinstance(result.wadium, int)
        assert isinstance(result.pietro, int)
        assert isinstance(result.piwnica, int)
        assert isinstance(result.termin_ogledzin, datetime.datetime)

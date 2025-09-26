from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Boolean
from sqlalchemy.orm import declarative_base, sessionmaker
from ScrapData.Property_Data import PropertyData

Base = declarative_base()

class Mieszkanie(Base):
    __tablename__ = "mieszkania"

    mieszkanie_id = Column(Integer, primary_key=True, autoincrement=True)
    rozmiar = Column(Float, nullable=False)
    pokoje = Column(Integer, nullable=False)
    ulica = Column(String, nullable=False)
    miasto = Column(String, nullable=False)
    kod_pocztowy = Column(String, nullable=True)
    cena = Column(Integer, nullable=False)
    nr_ksiegi_wieczystej = Column(String(15), nullable=False)
    wadium = Column(Integer, nullable=False)
    pietro = Column(Integer, nullable=False)
    termin_ogledzin = Column(DateTime, nullable=False)
    piwnica = Column(Boolean, nullable=True)
    inne = Column(String, nullable=True)
    nr_dzialki = Column(String, nullable=True)
    prawo = Column(String, nullable=True)
    x_coord = Column(String, nullable=True)
    y_coord = Column(String, nullable=True)


# TODO: zmienne srodowiskowe
DB_LOGIN = "postgres"
DB_PASSWORD = "postgres"
HOST = "db" # container name
PORT = 5432
DB_NAME = "postgres"

DATABASE_URL = f"postgresql+psycopg2://{DB_LOGIN}:{DB_PASSWORD}@{HOST}:{PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(bind=engine)


def init_db():
    """
    Creates all the tables in the database if not exists
    """
    Base.metadata.create_all(engine)


def insert_property(prop: PropertyData):
    """
    Insert Propertydata into the database
    """
    session = SessionLocal()
    try:
        mieszkanie = Mieszkanie(
            # mieszkanie_id=prop.mieszkanie_id,
            rozmiar=prop.rozmiar,
            pokoje=prop.pokoje,
            ulica=prop.ulica,
            miasto=prop.miasto,
            kod_pocztowy=prop.kod_pocztowy,
            cena=prop.cena,
            nr_ksiegi_wieczystej=prop.nr_ksiegi_wieczystej,
            wadium=prop.wadium,
            pietro=prop.pietro,
            termin_ogledzin=prop.termin_ogledzin,
            piwnica=prop.piwnica,
            inne=prop.inne,
            nr_dzialki=prop.nr_dzialki,
            prawo=prop.prawo,
            x_coord=prop.xCoord,
            y_coord=prop.yCoord,
        )
        session.add(mieszkanie)
        session.commit()
        return mieszkanie.mieszkanie_id
    except Exception as e:
        session.rollback()
        print(f"[DB_insert] Error during insertion: {e}")
        return None
    finally:
        session.close()

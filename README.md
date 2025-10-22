# Auction Radar
Auction Radar is an application for collecting and processing data on real estate tenders and foreclosure auctions.
It consists of a **Spring Boot** backend, a **React** frontend, and a data processing pipeline built with **Apache Airflow** and **OPEN AI API**.
## How to Run the Project
### Requirements
Docker
Docker Compose
Maven
### Environment Setup
Go to the property_pipeline directory
Create a .env file and add your OpenAI API key following the example:
cp .env.example .env
Then fill in the value for OPENAI_API_KEY in your .env file.
### Running the Whole Project
Build and start all containers:
mvn clean package
docker compose up --build -d
### Running a Single Component
When working on a specific module (e.g., the frontend), you can start only that container:
docker compose up frontend -d
To stop all containers:
docker compose down
### Services and Ports
Component	Address / Port	Description
Frontend (React)	http://localhost:5173	User interface
Backend (Spring Boot)	http://localhost:8080	REST API
Airflow Webserver	http://localhost:8081	Workflow management UI
PostgreSQL	localhost:55004	Application database
Redis	localhost:6379	Task queue for Airflow
### Airflow Login
After starting the containers, open your browser and go to:
http://localhost:8081
Default credentials:
Username: admin
Password: admin
Once logged in, click the Trigger DAG button to start data collection by the Property Scraper.
The scraping logic can be modified in the DAG_scraper file, which provides flexible methods open for extension.
By default, data is fetched from tenders organized by the city of Łódź (Poland).
### Frontend Login
After the frontend container starts, visit:
http://localhost:5173
You can access the dashboard directly to browse fetched auction data.

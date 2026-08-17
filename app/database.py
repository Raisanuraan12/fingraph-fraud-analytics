import os
from dotenv import load_dotenv
from neo4j import GraphDatabase

load_dotenv()

URI = os.getenv("NEO4J_URI")
USERNAME = os.getenv("neo4j")
PASSWORD = os.getenv("Sandip@123")

driver = GraphDatabase.driver(
    URI,
    auth=(USERNAME, PASSWORD)
)
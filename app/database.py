from neo4j import GraphDatabase

URI = "neo4j://127.0.0.1:7687"
USER = "neo4j"
PASSWORD = "sandip123"

driver = GraphDatabase.driver(URI, auth=(USER, PASSWORD))
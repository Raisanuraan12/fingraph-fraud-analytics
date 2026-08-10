// FinGraph - Neo4j Graph Schema

// Constraints for unique IDs

CREATE CONSTRAINT person_id_unique IF NOT EXISTS
FOR (p:Person)
REQUIRE p.person_id IS UNIQUE;

CREATE CONSTRAINT account_id_unique IF NOT EXISTS
FOR (a:Account)
REQUIRE a.account_id IS UNIQUE;

CREATE CONSTRAINT bank_id_unique IF NOT EXISTS
FOR (b:Bank)
REQUIRE b.bank_id IS UNIQUE;

CREATE CONSTRAINT device_id_unique IF NOT EXISTS
FOR (d:Device)
REQUIRE d.device_id IS UNIQUE;

CREATE CONSTRAINT ip_address_unique IF NOT EXISTS
FOR (ip:IPAddress)
REQUIRE ip.ip_address IS UNIQUE;
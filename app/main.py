from fastapi import FastAPI
from app.database import driver

app = FastAPI(title="FinGraph API")

@app.get("/")
def root():
    return {"message": "FinGraph Backend Running"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/db-test")
def db_test():
    try:
        with driver.session() as session:
            result = session.run(
                "MATCH (a:Account) RETURN count(a) AS total_accounts"
            )
            record = result.single()

            return {
                "database": "connected",
                "total_accounts": record["total_accounts"]
            }

    except Exception as e:
        return {"error": str(e)}

# NEW: Dashboard statistics API
@app.get("/stats")
def get_stats():
    try:
        with driver.session() as session:

            # Total accounts
            accounts = session.run(
                "MATCH (a:Account) RETURN count(a) AS count"
            ).single()["count"]

            # Total transactions
            transactions = session.run(
                "MATCH (t:Transaction) RETURN count(t) AS count"
            ).single()["count"]

            # Fraud transactions
            fraud = session.run(
                "MATCH (t:Transaction) WHERE t.fraud_label <> 'normal' RETURN count(t) AS count"
            ).single()["count"]

            # High risk transactions
            high_risk = session.run(
                "MATCH (t:Transaction) WHERE t.risk_index >= 0.8 RETURN count(t) AS count"
            ).single()["count"]

            return {
                "total_accounts": accounts,
                "total_transactions": transactions,
                "fraud_transactions": fraud,
                "high_risk_transactions": high_risk
            }

    except Exception as e:
        return {"error": str(e)}
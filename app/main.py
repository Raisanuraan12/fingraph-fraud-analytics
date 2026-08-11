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
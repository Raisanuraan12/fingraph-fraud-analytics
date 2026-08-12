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


# Dashboard statistics API
@app.get("/stats")
def get_stats():
    try:
        with driver.session() as session:

            accounts = session.run(
                "MATCH (a:Account) RETURN count(a) AS count"
            ).single()["count"]

            transactions = session.run(
                "MATCH (t:Transaction) RETURN count(t) AS count"
            ).single()["count"]

            fraud = session.run(
                "MATCH (t:Transaction) WHERE t.fraud_label <> 'normal' RETURN count(t) AS count"
            ).single()["count"]

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

# Latest transactions API
@app.get('/transactions')
def get_transactions(limit: int = 10):
    try:
        with driver.session() as session:
            result = session.run(
                '''
                MATCH (a:Account)-[:MADE]->(t:Transaction)
                RETURN
                    t.txn_id AS txn_id,
                    a.account_id AS account_id,
                    t.txn_amount AS amount,
                    t.txn_currency AS currency,
                    t.payment_channel AS channel,
                    t.fraud_label AS fraud_label,
                    t.risk_index AS risk_index,
                    t.txn_datetime AS txn_datetime
                ORDER BY t.txn_datetime DESC
                LIMIT $limit
                ''',
                limit=limit
            )

            transactions = [dict(record) for record in result]

            return {
                'count': len(transactions),
                'transactions': transactions
            }

    except Exception as e:
        return {'error': str(e)}


# High risk alerts API
@app.get('/high-risk')
def get_high_risk(limit: int = 20):
    try:
        with driver.session() as session:
            result = session.run(
                '''
                MATCH (a:Account)-[:MADE]->(t:Transaction)
                WHERE t.risk_index >= 0.8
                RETURN
                    t.txn_id AS txn_id,
                    a.account_id AS account_id,
                    t.txn_amount AS amount,
                    t.payment_channel AS channel,
                    t.fraud_label AS fraud_label,
                    t.risk_index AS risk_index,
                    t.txn_datetime AS txn_datetime
                ORDER BY t.risk_index DESC
                LIMIT $limit
                ''',
                limit=limit
            )

            alerts = [dict(record) for record in result]

            return {
                'count': len(alerts),
                'alerts': alerts
            }

    except Exception as e:
        return {'error': str(e)}

@app.get('/fraud-summary')
def get_fraud_summary():
    try:
        with driver.session() as session:

            total = session.run(
                'MATCH (t:Transaction) RETURN count(t) AS count'
            ).single()['count']

            suspicious = session.run(
                '''
                MATCH (t:Transaction)
                WHERE t.fraud_label <> 'normal'
                RETURN count(t) AS count
                '''
            ).single()['count']

            high_risk = session.run(
                '''
                MATCH (t:Transaction)
                WHERE t.risk_index >= 0.8
                RETURN count(t) AS count
                '''
            ).single()['count']

            fraud_percentage = round((suspicious / total) * 100, 2) if total else 0
            high_risk_percentage = round((high_risk / total) * 100, 2) if total else 0

            return {
                'total_transactions': total,
                'suspicious_transactions': suspicious,
                'high_risk_transactions': high_risk,
                'fraud_percentage': fraud_percentage,
                'high_risk_percentage': high_risk_percentage
            }

    except Exception as e:
        return {'error': str(e)}
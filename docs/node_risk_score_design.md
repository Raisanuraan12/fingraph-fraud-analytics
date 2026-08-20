# FinGraph – Node Risk Score Analysis & Execution Report

## 1. Objective

The objective of this document is to define the methodology, query design, and verified execution results for calculating node-level risk scores in FinGraph.

This satisfies the official Week 2 Analytics Lead deliverable:
> "Cypher Queries: Write complex Cypher queries to detect circular money flows (A → B → C → A) and calculate node risk scores."

---

## 2. Risk Scoring Methodology

To prevent reliance on isolated transaction anomalies, the node risk scoring model combines behavioral velocity, geographical flags, transaction volume, and model confidence into a single composite score (0–100) per `Account` node.

### Risk Weight Allocation

| Factor | Source Property / Graph Metric | Risk Threshold / Condition | Point Weight |
| :--- | :--- | :--- | :--- |
| **Transaction Velocity** | `txn_count_past_hour` | `> 10` transactions within 1 hour | 25 pts |
| **Base Risk Index** | `risk_index` | `≥ 0.70` base model confidence | 25 pts |
| **Cross-Border Activity** | `foreign_txn_flag` | `= 1` (Foreign transaction) | 20 pts |
| **High Value Anomaly** | `txn_amount` | `> 50,000` transfer amount | 15 pts |
| **Graph Degree / Volume** | Connected `MADE` transactions | `> 5` total transactions linked | 15 pts |

**Total Maximum Risk Score:** 100 points

---

## 3. Risk Tiers and Thresholds

Accounts are categorized based on their cumulative calculated score:

- **0 – 29 (LOW):** Normal baseline activity; standard monitoring.
- **30 – 59 (MEDIUM):** Elevated anomalous indicators; flagged for automated periodic review.
- **60 – 79 (HIGH):** Multiple high-risk signals; prioritized for compliance analyst inspection.
- **80 – 100 (CRITICAL):** Coordinated syndicate / high-risk activity; immediate operational review.

---

## 4. Implemented Cypher Query

The following Cypher query was executed against the Neo4j graph database to aggregate transaction properties, compute the risk score, and update the properties on the `Account` nodes:

MATCH (a:Account)-[:MADE]->(t:Transaction)
WITH a,
     count(t) AS total_txns,
     max(t.risk_index) AS max_risk_index,
     max(t.txn_count_past_hour) AS max_velocity,
     max(t.foreign_txn_flag) AS has_foreign_txn,
     max(t.txn_amount) AS max_amount
WITH a,
     total_txns,
     (CASE WHEN max_velocity > 10 THEN 25 ELSE 0 END) AS velocity_score,
     (CASE WHEN max_risk_index >= 0.70 THEN 25 ELSE 0 END) AS risk_index_score,
     (CASE WHEN has_foreign_txn = 1 THEN 20 ELSE 0 END) AS foreign_score,
     (CASE WHEN max_amount > 50000 THEN 15 ELSE 0 END) AS amount_score,
     (CASE WHEN total_txns > 5 THEN 15 ELSE 0 END) AS degree_score
WITH a,
     (velocity_score + risk_index_score + foreign_score + amount_score + degree_score) AS calculated_risk_score
SET a.risk_score = calculated_risk_score,
    a.risk_tier = CASE 
        WHEN calculated_risk_score >= 80 THEN "CRITICAL"
        WHEN calculated_risk_score >= 60 THEN "HIGH"
        WHEN calculated_risk_score >= 30 THEN "MEDIUM"
        ELSE "LOW"
    END
RETURN 
    a.account_id AS account_id,
    a.risk_score AS risk_score,
    a.risk_tier AS risk_tier
ORDER BY risk_score DESC;

---

## 5. Verified Database Execution Results

The risk scoring query was executed on the live Neo4j database instance with the following verified execution metrics:

- **Total Accounts Processed:** 2,120 records
- **Properties Updated:** 4,240 properties (`risk_score` and `risk_tier` set for each node)
- **Execution Time:** ~62 ms to stream initial records

### Sample Output Results

| Account ID | Risk Score | Risk Tier |
| :--- | :--- | :--- |
| `ACC95357` | 50 | MEDIUM |
| `ACC74177` | 50 | MEDIUM |
| `ACC77922` | 50 | MEDIUM |
| `ACC99142` | 25 | LOW |
| `ACC59105` | 25 | LOW |
| `ACC84099` | 25 | LOW |
| `ACC21050` | 25 | LOW |
| `ACC76156` | 25 | LOW |
| `ACC36092` | 25 | LOW |
| `ACC97743` | 25 | LOW |

---


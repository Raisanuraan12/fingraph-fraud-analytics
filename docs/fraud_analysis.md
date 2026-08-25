# FinGraph – Fraud Analytics

## 1. Objective

FinGraph is a real-time fraud syndicate analytics project. This
analysis uses the imported transaction graph in Neo4j/FingraphDB to
identify suspicious transactions, high-risk activity, foreign
transaction patterns, merchant patterns, and transaction-frequency
behavior.

The analysis was performed using Cypher queries on the shared
FingraphDB Neo4j instance.

---

## 2. Neo4j Graph Verification

The latest verified FingraphDB analytics report contains the
following nodes:

| Node Type | Count |
|---|---:|
| Account | 2,123 |
| Card | 2,150 |
| Location | 19 |
| Merchant | 19 |
| Transaction | 2,150 |

The graph structure and fraud-analysis queries were successfully
verified on the shared FingraphDB setup.

---

## 3. Suspicious Transaction Analysis

### Query

```cypher
MATCH (t:Transaction)
WHERE t.fraud_label = 'suspicious'
RETURN count(t) AS suspicious_transactions;
```

### Result

- Total transactions: 2,150
- Suspicious transactions: 150
- Suspicious transaction rate: 6.98%

The suspicious transaction count confirms that 150 transactions in
the dataset are labelled as suspicious.

---

## 4. Top Suspicious Transaction Analysis

### Query

```cypher
MATCH (t:Transaction)
WHERE t.fraud_label = 'suspicious'
RETURN
    t.txn_id,
    t.txn_amount,
    t.risk_index
ORDER BY t.risk_index DESC
LIMIT 10;
```

### Verified Samples

| Transaction ID | Amount | Risk Index |
|---|---:|---:|
| 72710ccb... | 993.63 | 0.990 |
| 5741d3ca... | 790.70 | 0.990 |
| 3831ae9c... | 992.77 | 0.989 |
| 8c9c317b... | 2713.98 | 0.985 |
| 4bf8d7ca... | 249.98 | 0.984 |

The highest observed risk score in the verified suspicious transaction
samples is 0.990.

---

## 5. High-Risk Transaction Analysis

### Query

```cypher
MATCH (t:Transaction)
WHERE t.risk_index >= 0.658
RETURN
    t.txn_id,
    t.txn_amount,
    t.risk_index,
    t.fraud_label
ORDER BY t.risk_index DESC
LIMIT 20;
```

### Result

- High-risk transactions: 84
- Highest observed risk score: 0.990

The verified analysis shows a strong association between high risk
scores and suspicious transaction activity.

---

## 6. Foreign Transaction Analysis

### Query

```cypher
MATCH (t:Transaction)
RETURN
    t.foreign_txn_flag AS foreign_transaction,
    t.fraud_label AS fraud_label,
    count(t) AS transaction_count
ORDER BY foreign_transaction, fraud_label;
```

### Verified Results

| Foreign Flag | Fraud Label | Count |
|---:|---|---:|
| 0 | normal | 2,000 |
| 0 | suspicious | 123 |
| 1 | suspicious | 27 |

### Finding

There are **27 suspicious foreign transactions** in the dataset.

Foreign transaction activity is therefore one of the observable
behavioral indicators available for fraud analysis.

---

## 7. Suspicious Transactions by Merchant

### Query

```cypher
MATCH (t:Transaction)-[:AT_MERCHANT]->(m:Merchant)
WHERE t.fraud_label = 'suspicious'
RETURN
    m.merchant_type AS merchant_type,
    count(t) AS suspicious_transactions
ORDER BY suspicious_transactions DESC;
```

### Verified Results

| Merchant Type | Suspicious Transactions |
|---|---:|
| Travel | 21 |
| Entertainment | 15 |
| Coffee Shop | 10 |
| Subscription | 9 |
| Gas Station | 9 |

### Finding

**Travel** has the highest number of suspicious transactions among the
merchant categories in the verified results, with **21 suspicious
transactions**.

---

## 8. Overall Merchant Distribution

### Query

```cypher
MATCH (t:Transaction)-[:AT_MERCHANT]->(m:Merchant)
RETURN
    m.merchant_type,
    count(t) AS txn_count
ORDER BY txn_count DESC
LIMIT 5;
```

### Verified Results

| Merchant Type | Total Transactions |
|---|---:|
| Subscription | 159 |
| Pharmacy | 153 |
| Grocery | 150 |
| Coffee Shop | 148 |
| Entertainment | 147 |

### Finding

Subscription has the highest overall transaction count among the
top five merchant categories, with 159 transactions.

This is different from suspicious-transaction concentration, where
Travel has the highest suspicious transaction count.

---

## 9. Transaction Frequency Analysis

### Query

```cypher
MATCH (t:Transaction)
RETURN
    t.txn_count_past_hour AS transactions_past_hour,
    t.fraud_label AS fraud_label,
    count(t) AS transaction_count
ORDER BY transactions_past_hour DESC;
```

### Verified Results

| Transactions in Past Hour | Fraud Label | Count |
|---:|---|---:|
| 12 | suspicious | 4 |
| 8 | suspicious | 7 |
| 5 | suspicious | 5 |
| 3 | suspicious | 24 |
| 2 | suspicious | 40 |
| 1 | suspicious | 59 |
| 1 | normal | 493 |
| 0 | normal | 1,406 |

### Finding

The verified results show that suspicious transactions occur across
different transaction-frequency levels. Recent transaction activity
provides a useful behavioral indicator that can be considered together
with risk score and fraud label.

The results also show that a transaction-frequency value by itself
should not be treated as sufficient evidence of fraud.

---

## 10. Account-Level Suspicious Analysis

The account-wise suspicious transaction query was executed on the
shared FingraphDB setup.

### Query

```cypher
MATCH (a:Account)-[:MADE]->(t:Transaction)
WHERE t.fraud_label = 'suspicious'
RETURN
    a.account_id AS account_id,
    count(t) AS suspicious_transactions,
    max(t.risk_index) AS highest_risk
ORDER BY suspicious_transactions DESC, highest_risk DESC
LIMIT 20;
```

### Result

The detailed account-wise output was not included in the verification
report provided for this documentation. Therefore, no account-level
values are reported here without the original verified output.

---

## 11. Key Findings

Based on the verified Neo4j analysis:

- Total transactions: **2,150**
- Suspicious transactions: **150**
- Suspicious transaction rate: **6.98%**
- High-risk transactions: **84**
- Highest observed risk score: **0.990**
- Suspicious foreign transactions: **27**
- Top suspicious merchant category: **Travel**
- Suspicious Travel transactions: **21**
- Top overall merchant category by transaction volume:
  **Subscription**
- Subscription transactions: **159**
- Transaction-frequency patterns provide an additional behavioral
  indicator for fraud analysis.

---

## 12. Analytics Observations

### Risk Score

The verified results show that suspicious transactions are associated
with high risk scores. The highest observed risk score is 0.990.

### Foreign Transactions

There are 27 suspicious transactions with the foreign transaction
flag enabled. Foreign transaction status can therefore be considered
as one of the indicators when evaluating suspicious activity.

### Merchant Patterns

Travel has the highest number of suspicious transactions among the
verified merchant results.

However, the merchant category with the highest overall transaction
volume is Subscription. Therefore, high transaction volume and high
fraud concentration should be treated as different analytical
measures.

### Transaction Frequency

Suspicious transactions appear at several transaction-frequency
levels. Transaction frequency should therefore be combined with other
signals such as risk score, foreign transaction status, and fraud
label rather than being used as a standalone fraud indicator.

---

## 13. Fraud Analytics Scope

The current transaction dataset supports analysis using fields such as:

- Transaction ID
- Transaction datetime
- Customer account
- Card number
- Transaction amount
- Currency
- Merchant type
- City
- Country code
- Payment channel
- Distance from home
- Foreign transaction flag
- Transaction count in the past hour
- Fraud label
- Risk index

The current graph structure supports transaction, account, card,
location, and merchant relationships.

The original project roadmap also mentions IP/device-based and
circular-transfer fraud patterns. Those patterns require corresponding
IP, device, and transfer relationship data. They should not be claimed
as verified using the current transaction dataset unless the required
data and relationships are added to the graph.

---

## 14. Conclusion

The Neo4j graph structure was successfully verified and all provided
fraud-analysis queries executed successfully on the shared FingraphDB
setup.

The analysis identified:

- Suspicious transactions
- High-risk transactions
- Foreign transaction activity
- Suspicious merchant patterns
- Overall merchant transaction distribution
- Transaction-frequency behavior

The verified results provide an analytical foundation for the next
stages of the FinGraph project, including backend API integration and
frontend dashboard visualization.

The fraud analytics results can be used by the backend team to expose
fraud-related information through APIs and by the frontend team to
display suspicious transactions, risk indicators, merchant patterns,
and other fraud-related KPIs.


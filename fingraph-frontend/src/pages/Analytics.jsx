import { useEffect, useState } from "react";

const API_BASE_URL =
  "https://corn-guidance-penguin-probe.trycloudflare.com";

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // FETCH ANALYTICS
  // =========================

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/dashboard-analytics`
      );

      if (!response.ok) {
        throw new Error(
          `Analytics API returned ${response.status}`
        );
      }

      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      console.error("Analytics API error:", err);
      throw err;
    }
  };

  // =========================
  // FETCH TRANSACTIONS
  // =========================

  const fetchTransactions = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/transactions?page=1&limit=10`
      );

      if (!response.ok) {
        throw new Error(
          `Transactions API returned ${response.status}`
        );
      }

      const data = await response.json();

      setTransactions(
        Array.isArray(data.transactions)
          ? data.transactions
          : []
      );
    } catch (err) {
      console.error("Transactions API error:", err);
      throw err;
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");

      try {
        await Promise.all([
          fetchAnalytics(),
          fetchTransactions(),
        ]);
      } catch (err) {
        setError(
          "Unable to load analytics data. Please check the backend connection."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // =========================
  // LOADING STATE
  // =========================

  if (loading) {
    return (
      <div className="page-container">
        <div className="investigation-panel">
          <div className="no-alerts">
            <h3>Loading fraud analytics...</h3>
            <p>
              Retrieving analytics and transaction data from
              the FinGraph backend.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // ERROR STATE
  // =========================

  if (error) {
    return (
      <div className="page-container">
        <div className="investigation-panel">
          <div className="panel-header">
            <div>
              <h3>Analytics Data Unavailable</h3>
              <small>{error}</small>
            </div>

            <button
              className="secondary-btn"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // SAFE DEFAULTS
  // =========================

  const riskDistribution =
    analytics?.risk_distribution || {};

  const fraudByChannel =
    analytics?.fraud_by_channel || [];

  const suspiciousMerchants =
    analytics?.suspicious_merchants || [];

  const fraudTrend =
    analytics?.fraud_trend || [];

  const totalTransactions =
    riskDistribution.low +
    riskDistribution.medium +
    riskDistribution.high;

  const highRisk =
    riskDistribution.high || 0;

  const mediumRisk =
    riskDistribution.medium || 0;

  const lowRisk =
    riskDistribution.low || 0;

  const suspiciousTransactions =
    fraudByChannel.reduce(
      (total, item) =>
        total + (item.suspicious_transactions || 0),
      0
    );

  const fraudRate =
    totalTransactions > 0
      ? (
          (suspiciousTransactions /
            totalTransactions) *
          100
        ).toFixed(2)
      : "0.00";

  // =========================
  // TRANSACTION FILTER
  // =========================

  const getRiskLevel = (risk) => {
    if (risk >= 0.8) return "High";
    if (risk >= 0.5) return "Medium";
    return "Low";
  };

  const filteredTransactions =
    transactions.filter((item) => {
      const transactionId =
        String(item.txn_id || "").toLowerCase();

      const accountId =
        String(item.account_id || "").toLowerCase();

      const searchValue =
        search.toLowerCase();

      const matchesSearch =
        transactionId.includes(searchValue) ||
        accountId.includes(searchValue);

      const transactionRisk =
        getRiskLevel(Number(item.risk_index || 0));

      const matchesRisk =
        riskFilter === "All" ||
        transactionRisk === riskFilter;

      return matchesSearch && matchesRisk;
    });

  return (
    <div className="page-container">

      {/* =========================
          PAGE HEADER
      ========================== */}

      <div className="page-header">
        <div>
          <h2>Fraud Analytics</h2>

          <p>
            Analyze transaction patterns, fraud trends,
            and risk metrics.
          </p>
        </div>

        <input
          type="text"
          placeholder="Search transaction or account..."
          className="search-input"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />
      </div>

      {/* =========================
          SUMMARY CARDS
      ========================== */}

      <div className="investigation-stats">

        <div className="info-card">
          <span>💳 Total Transactions</span>

          <h3>
            {totalTransactions.toLocaleString()}
          </h3>

          <small>
            Transactions analyzed
          </small>
        </div>

        <div className="info-card">
          <span>🚨 Suspicious Transactions</span>

          <h3>
            {suspiciousTransactions}
          </h3>

          <small>
            Detected by analytics
          </small>
        </div>

        <div className="info-card">
          <span>⚠️ High Risk</span>

          <h3>{highRisk}</h3>

          <small>
            Risk index ≥ 0.8
          </small>
        </div>

        <div className="info-card">
          <span>📊 Fraud Rate</span>

          <h3>{fraudRate}%</h3>

          <small>
            Suspicious transaction rate
          </small>
        </div>

      </div>

      {/* =========================
          RISK + CHANNEL
      ========================== */}

      <div className="analytics-grid">

        {/* RISK DISTRIBUTION */}

        <div className="investigation-panel analytics-card">

          <div className="panel-header">
            <div>
              <h3>Risk Distribution</h3>

              <small>
                Transaction risk overview
              </small>
            </div>
          </div>

          <div className="risk-chart">

            <div className="risk-bar-row">

              <div className="risk-bar-label">
                <span>High Risk</span>
                <strong>{highRisk}</strong>
              </div>

              <div className="risk-bar">
                <div
                  className="risk-bar-fill high"
                  style={{
                    width: `${
                      totalTransactions
                        ? (highRisk /
                            totalTransactions) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>

            </div>

            <div className="risk-bar-row">

              <div className="risk-bar-label">
                <span>Medium Risk</span>
                <strong>{mediumRisk}</strong>
              </div>

              <div className="risk-bar">
                <div
                  className="risk-bar-fill medium"
                  style={{
                    width: `${
                      totalTransactions
                        ? (mediumRisk /
                            totalTransactions) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>

            </div>

            <div className="risk-bar-row">

              <div className="risk-bar-label">
                <span>Low Risk</span>
                <strong>{lowRisk}</strong>
              </div>

              <div className="risk-bar">
                <div
                  className="risk-bar-fill low"
                  style={{
                    width: `${
                      totalTransactions
                        ? (lowRisk /
                            totalTransactions) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>

            </div>

          </div>
        </div>

        {/* FRAUD BY CHANNEL */}

        <div className="investigation-panel analytics-card">

          <div className="panel-header">
            <div>
              <h3>Fraud by Channel</h3>

              <small>
                Suspicious activity across channels
              </small>
            </div>
          </div>

          <div className="analytics-overview">

            {fraudByChannel.map((item) => (
              <div
                className="overview-item"
                key={item.channel}
              >
                <span>
                  {item.channel}
                </span>

                <strong>
                  {item.suspicious_transactions}
                </strong>

                <small>
                  of {item.total_transactions} transactions
                </small>
              </div>
            ))}

          </div>

        </div>

      </div>

      {/* =========================
          SUSPICIOUS MERCHANTS
      ========================== */}

      <div className="investigation-panel analytics-table-panel">

        <div className="panel-header">

          <div>
            <h3>
              Suspicious Merchant Analysis
            </h3>

            <small>
              Merchant categories with suspicious
              transaction activity
            </small>
          </div>

        </div>

        <div className="table-container">

          <table>

            <thead>
              <tr>
                <th>Merchant Type</th>
                <th>Suspicious Transactions</th>
              </tr>
            </thead>

            <tbody>

              {suspiciousMerchants.map((item) => (
                <tr key={item.merchant_type}>

                  <td>
                    <strong>
                      {item.merchant_type}
                    </strong>
                  </td>

                  <td>
                    {item.suspicious_transactions}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* =========================
          TRANSACTION TREND
      ========================== */}

      <div className="investigation-panel analytics-table-panel">

        <div className="panel-header">

          <div>
            <h3>
              Fraud Trend
            </h3>

            <small>
              Suspicious transactions over time
            </small>
          </div>

        </div>

        <div className="table-container">

          <table>

            <thead>
              <tr>
                <th>Date</th>
                <th>Suspicious Transactions</th>
              </tr>
            </thead>

            <tbody>

              {fraudTrend.map((item) => (
                <tr key={item.date}>

                  <td>
                    {item.date}
                  </td>

                  <td>
                    <strong>
                      {item.suspicious_transactions}
                    </strong>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* =========================
          TRANSACTION TABLE
      ========================== */}

      <div className="investigation-panel analytics-table-panel">

        <div className="panel-header">

          <div>
            <h3>
              Transaction Analytics
            </h3>

            <small>
              Latest transactions returned by the
              FinGraph backend
            </small>
          </div>

          <select
            className="analytics-filter"
            value={riskFilter}
            onChange={(e) =>
              setRiskFilter(e.target.value)
            }
          >
            <option value="All">
              All Risk
            </option>

            <option value="High">
              High Risk
            </option>

            <option value="Medium">
              Medium Risk
            </option>

            <option value="Low">
              Low Risk
            </option>

          </select>

        </div>

        <div className="table-container">

          <table>

            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Account</th>
                <th>Amount</th>
                <th>Channel</th>
                <th>Risk Index</th>
                <th>Risk Level</th>
                <th>Fraud Label</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>

              {filteredTransactions.length > 0 ? (

                filteredTransactions.map((item) => {

                  const riskLevel =
                    getRiskLevel(
                      Number(item.risk_index || 0)
                    );

                  return (
                    <tr key={item.txn_id}>

                      <td>
                        <strong>
                          {item.txn_id}
                        </strong>
                      </td>

                      <td>
                        {item.account_id}
                      </td>

                      <td>
                        {item.currency}{" "}
                        {Number(
                          item.amount || 0
                        ).toLocaleString(
                          "en-US",
                          {
                            minimumFractionDigits: 2,
                          }
                        )}
                      </td>

                      <td>
                        {item.channel}
                      </td>

                      <td>
                        {Number(
                          item.risk_index || 0
                        ).toFixed(3)}
                      </td>

                      <td>
                        <span
                          className={`risk-badge ${riskLevel.toLowerCase()}`}
                        >
                          {riskLevel}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`analytics-status ${
                            item.fraud_label ===
                            "suspicious"
                              ? "fraud"
                              : "safe"
                          }`}
                        >
                          {item.fraud_label}
                        </span>
                      </td>

                      <td>
                        {item.txn_datetime}
                      </td>

                    </tr>
                  );
                })

              ) : (

                <tr>

                  <td
                    colSpan="8"
                    className="no-results"
                  >
                    No transactions found.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Analytics;
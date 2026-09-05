import { useState } from "react";

function Analytics() {
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");

  const transactions = [
    {
      id: "TXN-78421",
      customer: "Customer A",
      amount: "₹2.4L",
      risk: "High",
      status: "Fraud",
    },
    {
      id: "TXN-78435",
      customer: "Customer B",
      amount: "₹85K",
      risk: "Medium",
      status: "Review",
    },
    {
      id: "TXN-78456",
      customer: "Customer C",
      amount: "₹42K",
      risk: "Low",
      status: "Safe",
    },
    {
      id: "TXN-78472",
      customer: "Customer D",
      amount: "₹1.8L",
      risk: "High",
      status: "Fraud",
    },
    {
      id: "TXN-78489",
      customer: "Customer E",
      amount: "₹65K",
      risk: "Medium",
      status: "Review",
    },
    {
      id: "TXN-78501",
      customer: "Customer F",
      amount: "₹28K",
      risk: "Low",
      status: "Safe",
    },
  ];

  const filteredTransactions = transactions.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.customer.toLowerCase().includes(search.toLowerCase());

    const matchesRisk =
      riskFilter === "All" || item.risk === riskFilter;

    return matchesSearch && matchesRisk;
  });

  const highRisk = transactions.filter(
    (item) => item.risk === "High"
  ).length;

  const mediumRisk = transactions.filter(
    (item) => item.risk === "Medium"
  ).length;

  const lowRisk = transactions.filter(
    (item) => item.risk === "Low"
  ).length;

  const fraudTransactions = transactions.filter(
    (item) => item.status === "Fraud"
  ).length;

  return (
    <div className="page-container">

      {/* PAGE HEADER */}
      <div className="page-header">
        <div>
          <h2>Fraud Analytics</h2>
          <p>
            Analyze transaction patterns, fraud trends, and risk metrics.
          </p>
        </div>

        <input
          type="text"
          placeholder="Search transaction..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* SUMMARY CARDS */}
      <div className="investigation-stats">

        <div className="info-card">
          <span>💳 Total Transactions</span>
          <h3>{transactions.length}</h3>
          <small>Analyzed transactions</small>
        </div>

        <div className="info-card">
          <span>🚨 Fraud Transactions</span>
          <h3>{fraudTransactions}</h3>
          <small>Detected fraud cases</small>
        </div>

        <div className="info-card">
          <span>⚠️ High Risk</span>
          <h3>{highRisk}</h3>
          <small>Priority transactions</small>
        </div>

        <div className="info-card">
          <span>📊 Fraud Rate</span>
          <h3>
            {Math.round(
              (fraudTransactions / transactions.length) * 100
            )}%
          </h3>
          <small>Current fraud rate</small>
        </div>

      </div>

      {/* ANALYTICS SECTION */}
      <div className="analytics-grid">

        {/* RISK DISTRIBUTION */}
        <div className="investigation-panel analytics-card">

          <div className="panel-header">
            <div>
              <h3>Risk Distribution</h3>
              <small>Transaction risk overview</small>
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
                    width: `${(highRisk / transactions.length) * 100}%`,
                  }}
                ></div>
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
                    width: `${(mediumRisk / transactions.length) * 100}%`,
                  }}
                ></div>
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
                    width: `${(lowRisk / transactions.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

          </div>
        </div>

        {/* FRAUD OVERVIEW */}
        <div className="investigation-panel analytics-card">

          <div className="panel-header">
            <div>
              <h3>Fraud Overview</h3>
              <small>Current detection summary</small>
            </div>
          </div>

          <div className="analytics-overview">

            <div className="overview-item">
              <span>Detected Fraud</span>
              <strong>{fraudTransactions}</strong>
            </div>

            <div className="overview-item">
              <span>High Risk</span>
              <strong>{highRisk}</strong>
            </div>

            <div className="overview-item">
              <span>Requires Review</span>
              <strong>
                {
                  transactions.filter(
                    (item) => item.status === "Review"
                  ).length
                }
              </strong>
            </div>

            <div className="overview-item">
              <span>Safe Transactions</span>
              <strong>
                {
                  transactions.filter(
                    (item) => item.status === "Safe"
                  ).length
                }
              </strong>
            </div>

          </div>
        </div>

      </div>

      {/* TRANSACTION TABLE */}
      <div className="investigation-panel analytics-table-panel">

        <div className="panel-header">

          <div>
            <h3>Transaction Analytics</h3>
            <small>
              Detailed transaction risk analysis
            </small>
          </div>

          <select
            className="analytics-filter"
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
          >
            <option value="All">All Risk</option>
            <option value="High">High Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="Low">Low Risk</option>
          </select>

        </div>

        <div className="table-container">

          <table>

            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Risk</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((item) => (
                  <tr key={item.id}>

                    <td>{item.id}</td>

                    <td>{item.customer}</td>

                    <td>{item.amount}</td>

                    <td>
                      <span
                        className={`risk-badge ${item.risk.toLowerCase()}`}
                      >
                        {item.risk}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`analytics-status ${item.status.toLowerCase()}`}
                      >
                        {item.status}
                      </span>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-results">
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
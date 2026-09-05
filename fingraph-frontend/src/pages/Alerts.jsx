import { useEffect, useState } from "react";

const API_BASE_URL =
  "https://accurate-sensitivity-catherine-themselves.trycloudflare.com";

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // FETCH ALERT NOTIFICATIONS
  // =========================

  const fetchAlerts = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/investigation-alerts`
      );

      if (!response.ok) {
        throw new Error(
          `Backend returned status ${response.status}`
        );
      }

      const data = await response.json();

      /*
       * The backend may return the alerts directly
       * or inside an "alerts" property.
       */
      const apiAlerts = Array.isArray(data)
        ? data
        : Array.isArray(data.alerts)
        ? data.alerts
        : [];

      setAlerts(apiAlerts);
    } catch (err) {
      console.error("Alert notification API error:", err);

      setAlerts([]);

      setError(
        "Unable to load automated alerts. The backend or Neo4j connection may be unavailable."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    fetchAlerts();
  }, []);

  // =========================
  // NORMALIZE ALERT DATA
  // =========================

  const normalizeRisk = (alert) => {
    const severity =
      alert.alert_severity ||
      alert.severity ||
      alert.risk_severity ||
      alert.risk_tier ||
      "";

    return String(severity).toUpperCase();
  };

  const getAlertId = (alert, index) =>
    alert.alert_id ||
    alert.id ||
    `ALT-${String(index + 1).padStart(4, "0")}`;

  const getTransactionId = (alert) =>
    alert.txn_id ||
    alert.transaction_id ||
    alert.transaction ||
    "N/A";

  const getAccountId = (alert) =>
    alert.account_id ||
    alert.account ||
    "N/A";

  const getAmount = (alert) => {
    const amount =
      alert.amount ??
      alert.txn_amount ??
      alert.transaction_amount;

    if (amount === undefined || amount === null) {
      return "N/A";
    }

    return `₹${Number(amount).toLocaleString("en-IN")}`;
  };

  const getRiskScore = (alert) => {
    const risk =
      alert.risk_index ??
      alert.risk_score ??
      alert.risk;

    if (risk === undefined || risk === null) {
      return "N/A";
    }

    return typeof risk === "number"
      ? risk <= 1
        ? risk.toFixed(2)
        : risk
      : risk;
  };

  const getDescription = (alert) => {
    if (alert.description) {
      return alert.description;
    }

    if (alert.foreign_txn) {
      return "Suspicious foreign transaction detected.";
    }

    if (alert.transactions_past_hour) {
      return `Multiple transactions detected: ${alert.transactions_past_hour} in the past hour.`;
    }

    return "Suspicious transaction detected by FinGraph risk analytics.";
  };

  // =========================
  // FILTER + SEARCH
  // =========================

  const preparedAlerts = alerts.map((alert, index) => ({
    ...alert,
    displayId: getAlertId(alert, index),
    transaction: getTransactionId(alert),
    account: getAccountId(alert),
    amount: getAmount(alert),
    risk: normalizeRisk(alert),
    riskScore: getRiskScore(alert),
    description: getDescription(alert),
  }));

  const filteredAlerts = preparedAlerts.filter((alert) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      alert.displayId.toLowerCase().includes(searchText) ||
      alert.transaction.toLowerCase().includes(searchText) ||
      alert.account.toLowerCase().includes(searchText) ||
      alert.risk.toLowerCase().includes(searchText);

    const matchesFilter =
      filter === "All" ||
      alert.risk === filter;

    return matchesSearch && matchesFilter;
  });

  // =========================
  // STATISTICS
  // =========================

  const criticalCount = preparedAlerts.filter(
    (alert) => alert.risk === "CRITICAL"
  ).length;

  const highRiskCount = preparedAlerts.filter(
    (alert) => alert.risk === "HIGH"
  ).length;

  const mediumRiskCount = preparedAlerts.filter(
    (alert) => alert.risk === "MEDIUM"
  ).length;

  const resolvedCount = preparedAlerts.filter(
    (alert) =>
      String(alert.status || "").toLowerCase() ===
      "resolved"
  ).length;

  // =========================
  // RISK CLASS
  // =========================

  const getRiskClass = (risk) => {
    return String(risk).toLowerCase();
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="page-container">

      {/* =========================
          PAGE HEADER
      ========================== */}

      <div className="page-header">

        <div>
          <h2>Automated Fraud Alerts</h2>

          <p>
            Monitor risk-based alerts generated by FinGraph analytics.
          </p>
        </div>

        <div className="alert-search">
          <input
            type="text"
            placeholder="Search alerts..."
            className="search-input"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

      </div>

      {/* =========================
          ALERT STATISTICS
      ========================== */}

      <div className="investigation-stats">

        <div className="info-card">
          <span>🚨 Critical Alerts</span>
          <h3>{criticalCount}</h3>
          <small>Immediate attention</small>
        </div>

        <div className="info-card">
          <span>⚠️ High Risk</span>
          <h3>{highRiskCount}</h3>
          <small>Priority alerts</small>
        </div>

        <div className="info-card">
          <span>🟡 Medium Risk</span>
          <h3>{mediumRiskCount}</h3>
          <small>Requires review</small>
        </div>

        <div className="info-card">
          <span>✅ Resolved</span>
          <h3>{resolvedCount}</h3>
          <small>Resolved alerts</small>
        </div>

      </div>

      {/* =========================
          ERROR STATE
      ========================== */}

      {error && (
        <div className="investigation-panel">

          <div className="panel-header">

            <div>
              <h3>Alert Data Unavailable</h3>

              <small>
                {error}
              </small>
            </div>

            <button
              className="secondary-btn"
              onClick={fetchAlerts}
            >
              Retry
            </button>

          </div>

        </div>
      )}

      {/* =========================
          ALERT PANEL
      ========================== */}

      <div className="investigation-panel alerts-panel">

        <div className="panel-header">

          <div>
            <h3>Automated Alert Notifications</h3>

            <small>
              Alerts retrieved from the FinGraph backend
            </small>
          </div>

          <select
            className="alert-filter"
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
          >
            <option value="All">
              All Alerts
            </option>

            <option value="CRITICAL">
              Critical
            </option>

            <option value="HIGH">
              High Risk
            </option>

            <option value="MEDIUM">
              Medium Risk
            </option>

            <option value="LOW">
              Low Risk
            </option>
          </select>

        </div>

        {/* =========================
            LOADING STATE
        ========================== */}

        {loading ? (

          <div className="no-alerts">

            <div>
              <h3>
                Loading automated alerts...
              </h3>

              <p>
                Retrieving alert notifications from the backend.
              </p>
            </div>

          </div>

        ) : (

          <div className="table-container">

            <table>

              <thead>

                <tr>
                  <th>Alert ID</th>
                  <th>Transaction</th>
                  <th>Account</th>
                  <th>Amount</th>
                  <th>Risk Score</th>
                  <th>Severity</th>
                  <th>Description</th>
                </tr>

              </thead>

              <tbody>

                {filteredAlerts.length > 0 ? (

                  filteredAlerts.map((alert) => (

                    <tr key={alert.displayId}>

                      <td>
                        <strong>
                          {alert.displayId}
                        </strong>
                      </td>

                      <td>
                        {alert.transaction}
                      </td>

                      <td>
                        {alert.account}
                      </td>

                      <td>
                        {alert.amount}
                      </td>

                      <td>
                        {alert.riskScore}
                      </td>

                      <td>

                        <span
                          className={`risk-badge ${getRiskClass(
                            alert.risk
                          )}`}
                        >
                          {alert.risk || "UNKNOWN"}
                        </span>

                      </td>

                      <td>
                        <span className="alert-description">
                          {alert.description}
                        </span>
                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="7"
                      className="no-alerts"
                    >

                      <div>

                        <span>🔔</span>

                        <h3>
                          No automated alerts found
                        </h3>

                        <p>
                          No alerts match the current search or filter.
                        </p>

                      </div>

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default Alerts;
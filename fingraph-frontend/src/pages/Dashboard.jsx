import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
const [alertData, setAlertData] = useState(null);
const [loading, setLoading] = useState(true);
const [alertLoading, setAlertLoading] = useState(true);
const [error, setError] = useState("");
const [alertError, setAlertError] = useState("");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "https://corn-guidance-penguin-probe.trycloudflare.com/dashboard-overview"
      );

      if (!response.ok) {
        throw new Error("Failed to load dashboard data");
      }

      const data = await response.json();

      setDashboardData(data);
    } catch (err) {
      console.error("Dashboard API error:", err);
      setError("Unable to load live dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAlertData = async () => {
  try {
    setAlertLoading(true);
    setAlertError("");

    const response = await fetch(
      "https://accurate-sensitivity-catherine-themselves.trycloudflare.com/alert-notifications"
    );

    if (!response.ok) {
      throw new Error("Failed to load alert notifications");
    }

    const data = await response.json();

    setAlertData(data);
  } catch (err) {
    console.error("Alert API error:", err);
    setAlertError("Unable to load automated alerts.");
  } finally {
    setAlertLoading(false);
  }
};



 useEffect(() => {
  fetchDashboardData();
  fetchAlertData();
}, []);

  const stats = dashboardData?.stats;

  return (
    <div className="dashboard-page">

      {/* =========================================
          HEADER
      ========================================= */}

      <header className="topbar">
        <div>
          <h1>Fraud Analytics Dashboard</h1>
          <p>Real-time financial fraud monitoring</p>
        </div>

        <button className="user-button">
          ðŸ‘¤ Analyst
        </button>
      </header>

      {/* =========================================
          LOADING STATE
      ========================================= */}

      {loading && (
        <div className="dashboard-card">
          <p>Loading dashboard analytics...</p>
        </div>
      )}

      {/* =========================================
          ERROR STATE
      ========================================= */}

      {error && (
        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h2>Dashboard Data Unavailable</h2>
              <p>{error}</p>
            </div>

            <button
              className="dashboard-view-all"
              onClick={fetchDashboardData}
            >
              Retry
            </button>
          </div>

          <small>
            The dashboard interface is working, but the backend is currently
            unable to retrieve data from the Neo4j database.
          </small>
        </div>
      )}

      {/* =========================================
          STATISTICS
      ========================================= */}

      <section className="stats-grid">

        <div className="stat-card">
          <span>ðŸš¨ Total Accounts</span>
          <h2>
            {stats?.total_accounts ?? "--"}
          </h2>
          <small>FinGraph accounts</small>
        </div>

        <div className="stat-card">
          <span>ðŸ’³ Transactions</span>
          <h2>
            {stats?.total_transactions ?? "--"}
          </h2>
          <small>Total transactions</small>
        </div>

        <div className="stat-card">
          <span>âš ï¸ Fraud Transactions</span>
          <h2>
            {stats?.fraud_transactions ?? "--"}
          </h2>
          <small>Transactions marked non-normal</small>
        </div>

        <div className="stat-card">
          <span>ðŸ”´ High-Risk Transactions</span>
          <h2>
            {stats?.high_risk_transactions ?? "--"}
          </h2>
          <small>Risk index â‰¥ 0.8</small>
        </div>

      </section>

      

      {/* =========================================
          DASHBOARD OVERVIEW
      ========================================= */}

      <section className="dashboard-grid">

        {/* =====================================
            RECENT HIGH-RISK ALERTS
        ====================================== */}

        <div className="dashboard-card">

          <div className="card-header">

            <div>
              <h2>Recent High-Risk Alerts</h2>

              <p>
                Highest-risk transactions from the backend
              </p>
            </div>

           <span className={`live-status ${error ? "status-unavailable" : ""}`}>
  {loading
    ? "â— Waiting"
    : error
    ? "â— Unavailable"
    : "â— Live"}
</span>

          </div>

          <div className="risk-list">

            {dashboardData?.recent_alerts?.length > 0 ? (

              dashboardData.recent_alerts.map((alert) => (

                <div
                  className="risk-item"
                  key={alert.txn_id}
                >

                  <span>
                    {alert.txn_id}
                  </span>

                  <strong>
                    {Number(alert.risk_index).toFixed(2)}
                  </strong>

                </div>

              ))

            ) : (

              <p>
                {loading
                  ? "Loading alerts..."
                  : "No analytics data available."}
              </p>

            )}

          </div>

        </div>

        {/* =====================================
            TOP RISK ACCOUNTS
        ====================================== */}

        <div className="dashboard-card">

          <div className="card-header">

            <div>
              <h2>Top Risk Accounts</h2>

              <p>
                Highest-risk accounts identified by analytics
              </p>
            </div>

          </div>

          <div className="risk-list">

            {dashboardData?.top_risk_accounts?.length > 0 ? (

              dashboardData.top_risk_accounts.map((account) => (

                <div
                  className="risk-item"
                  key={account.account_id}
                >

                  <span>
                    {account.account_id}
                  </span>

                  <strong>
                    {Number(account.risk_score).toFixed(2)}
                  </strong>

                </div>

              ))

            ) : (

              <p>
                {loading
                  ? "Loading accounts..."
                  : "No risk account data available."}
              </p>

            )}

          </div>

        </div>

      </section>

      {/* =========================================
          RECENT ALERT DETAILS
      ========================================= */}

      <section className="dashboard-card dashboard-table-card">

        <div className="card-header">

          <div>
            <h2>Recent High-Risk Transactions</h2>

            <p>
              Latest transactions returned by the dashboard API
            </p>
          </div>

          <Link
            to="/alerts"
            className="dashboard-view-all"
          >
            View All â†’
          </Link>

        </div>

        <div className="dashboard-table-container">

          <table className="dashboard-table">

            <thead>

              <tr>
                <th>Transaction</th>
                <th>Account</th>
                <th>Amount</th>
                <th>Risk</th>
                <th>Merchant</th>
                <th>Location</th>
              </tr>

            </thead>

            <tbody>

              {dashboardData?.recent_alerts?.length > 0 ? (

                dashboardData.recent_alerts.map((alert) => (

                  <tr key={alert.txn_id}>

                    <td>
                      <strong>
                        {alert.txn_id}
                      </strong>
                    </td>

                    <td>
                      {alert.account_id ?? "--"}
                    </td>

                    <td>
                      {alert.amount ?? "--"}
                    </td>

                    <td>

                      <span className="risk-badge high">
                        {Number(alert.risk_index).toFixed(2)}
                      </span>

                    </td>

                    <td>
                      {alert.merchant_type ?? "--"}
                    </td>

                    <td>
                      {alert.city ?? "--"}
                    </td>

                  </tr>

                ))

              ) : (

                <tr>
                  <td colSpan="6">
                    {loading
                      ? "Loading transaction data..."
                      : "No analytics data available."}
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

      </section>

      {/* =========================================
          DATA SOURCE STATUS
      ========================================= */}

      <section className="dashboard-card">

        <div className="card-header">

          <div>
            <h2>Data Source</h2>

            <p>
              Dashboard analytics are retrieved from the FinGraph backend.
            </p>
          </div>

          <span className="live-status">
  {loading
    ? "â— Waiting"
    : error
    ? "â— Unavailable"
    : "â— Connected"}
</span>

        </div>

        <small>
          API endpoint: /dashboard-overview
        </small>

      </section>

    </div>
  );
}

export default Dashboard;


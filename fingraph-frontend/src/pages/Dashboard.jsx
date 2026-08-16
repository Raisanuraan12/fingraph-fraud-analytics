function Dashboard() {
  const fraudData = [
    { time: "10 AM", value: 45 },
    { time: "11 AM", value: 65 },
    { time: "12 PM", value: 40 },
    { time: "1 PM", value: 80 },
    { time: "2 PM", value: 55 },
    { time: "3 PM", value: 90 },
    { time: "4 PM", value: 70 },
  ];

  return (
    <div className="dashboard-page">

      {/* Header */}
      <header className="topbar">
        <div>
          <h1>Fraud Analytics Dashboard</h1>
          <p>Real-time financial fraud monitoring</p>
        </div>

        <button className="user-button">
          👤 Analyst
        </button>
      </header>

      {/* Statistics */}
      <section className="stats-grid">

        <div className="stat-card">
          <span>🚨 Active Alerts</span>
          <h2>24</h2>
          <small>+12% today</small>
        </div>

        <div className="stat-card">
          <span>💳 Transactions</span>
          <h2>12,840</h2>
          <small>+8.4% today</small>
        </div>

        <div className="stat-card">
          <span>⚠️ Fraud Detected</span>
          <h2>₹8.4L</h2>
          <small>+5.2% today</small>
        </div>

        <div className="stat-card">
          <span>🕸️ Suspicious Networks</span>
          <h2>37</h2>
          <small>3 new networks</small>
        </div>

      </section>

      {/* Dashboard Sections */}
      <section className="dashboard-grid">

        {/* Fraud Activity */}
        <div className="dashboard-card">

          <div className="card-header">
            <div>
              <h2>Fraud Activity</h2>
              <p>Real-time fraud detection trends</p>
            </div>

            <span className="live-status">
              ● Live
            </span>
          </div>

          <div className="activity-chart">

            <div className="chart-bars">
              {fraudData.map((item, index) => (
                <div className="bar-wrapper" key={index}>
                  <div
                    className="bar"
                    style={{ height: `${item.value}%` }}
                    title={`${item.time}: ${item.value}%`}
                  ></div>
                </div>
              ))}
            </div>

            <div className="chart-labels">
              {fraudData.map((item, index) => (
                <span key={index}>{item.time}</span>
              ))}
            </div>

          </div>
        </div>

        {/* Risk Overview */}
        <div className="dashboard-card">

          <div className="card-header">
            <div>
              <h2>Risk Overview</h2>
              <p>Current transaction risk levels</p>
            </div>
          </div>

          <div className="risk-list">

            <div className="risk-item">
              <span>🔴 High Risk</span>
              <strong>18%</strong>
            </div>

            <div className="risk-item">
              <span>🟡 Medium Risk</span>
              <strong>32%</strong>
            </div>

            <div className="risk-item">
              <span>🟢 Low Risk</span>
              <strong>50%</strong>
            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Dashboard;
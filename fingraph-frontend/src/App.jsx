function App() {
  return (
    <div className="dashboard">

      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">FinGraph</h2>

        <nav>
          <a className="active">📊 Dashboard</a>
          <a>🔍 Investigations</a>
          <a>🕸️ Fraud Network</a>
          <a>🚨 Alerts</a>
          <a>📈 Analytics</a>
          <a>⚙️ Settings</a>
        </nav>

        <div className="sidebar-footer">
          <span>Frontend & UI</span>
          <small>FinGraph Analytics</small>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">

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

          <div className="panel large-panel">
            <h2>Fraud Activity</h2>
            <p>Transaction fraud activity over the last 24 hours.</p>

            <div className="chart-placeholder">
              📈 Fraud Activity Chart
            </div>
          </div>

          <div className="panel">
            <h2>Risk Distribution</h2>
            <div className="risk-item">
              <span>🔴 High Risk</span>
              <strong>18%</strong>
            </div>

            <div className="risk-item">
              <span>🟠 Medium Risk</span>
              <strong>32%</strong>
            </div>

            <div className="risk-item">
              <span>🟢 Low Risk</span>
              <strong>50%</strong>
            </div>
          </div>

        </section>

      </main>
    </div>
  );
}

export default App;
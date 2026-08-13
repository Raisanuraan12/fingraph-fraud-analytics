function Investigations() {
  const cases = [
    {
      id: "INV-1001",
      transaction: "TXN-78421",
      customer: "Customer A",
      amount: "₹2.4L",
      risk: "High",
      status: "Open",
    },
    {
      id: "INV-1002",
      transaction: "TXN-78435",
      customer: "Customer B",
      amount: "₹85K",
      risk: "Medium",
      status: "Investigating",
    },
    {
      id: "INV-1003",
      transaction: "TXN-78456",
      customer: "Customer C",
      amount: "₹42K",
      risk: "Low",
      status: "Review",
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Investigations</h2>
          <p>
            Investigate suspicious financial transactions and fraud cases.
          </p>
        </div>

        <button className="primary-btn">+ New Investigation</button>
      </div>

      <div className="investigation-stats">
        <div className="info-card">
          <span>🔍 Open Cases</span>
          <h3>18</h3>
          <small>Requires investigation</small>
        </div>

        <div className="info-card">
          <span>⚠️ High Risk</span>
          <h3>7</h3>
          <small>Priority cases</small>
        </div>

        <div className="info-card">
          <span>✅ Resolved</span>
          <h3>42</h3>
          <small>This month</small>
        </div>
      </div>

      <div className="investigation-panel">
        <div className="panel-header">
          <h3>Active Investigations</h3>
          <input
            type="text"
            placeholder="Search investigation..."
            className="search-input"
          />
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Transaction</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Risk</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {cases.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.transaction}</td>
                  <td>{item.customer}</td>
                  <td>{item.amount}</td>
                  <td>
                    <span className={`risk-badge ${item.risk.toLowerCase()}`}>
                      {item.risk}
                    </span>
                  </td>
                  <td>
                    <span className="status-badge">{item.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Investigations;
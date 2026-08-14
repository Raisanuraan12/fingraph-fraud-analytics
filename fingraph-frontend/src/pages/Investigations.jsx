import React from "react"; 
function Investigations() {
  const cases = ([
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
  ]);
  const[search,setSearch]=React.useState("");
  const[showForm,setShowForm]=React.useState(false);
  const [newCase, setNewCase] = React.useState({
  transaction: "",
  customer: "",
  amount: "",
  risk: "Medium",
  status: "Open",
});
const handleAddInvestigation = (e) => {
  e.preventDefault();

  const newInvestigation = {
    id: `INV-${1001 + cases.length}`,
    transaction: newCase.transaction,
    customer: newCase.customer,
    amount: newCase.amount,
    risk: newCase.risk,
    status: newCase.status,
  };

  setCases([...cases, newInvestigation]);

  setNewCase({
    transaction: "",
    customer: "",
    amount: "",
    risk: "Medium",
    status: "Open",
  });

  setShowForm(false);
};
  const filteredCases = cases.filter((item) =>
    item.id.toLowerCase().includes(search.toLowerCase()) ||
    item.transaction.toLowerCase().includes(search.toLowerCase()) ||
    item.customer.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="page-container">
      {showForm && (
  <div className="modal-overlay">
    <div className="modal">

      <h2>New Investigation</h2>

      <form onSubmit={handleAddInvestigation}>

        <input
          type="text"
          placeholder="Transaction ID"
          value={newCase.transaction}
          onChange={(e) =>
            setNewCase({
              ...newCase,
              transaction: e.target.value,
            })
          }
          required
        />

        <input
          type="text"
          placeholder="Customer Name"
          value={newCase.customer}
          onChange={(e) =>
            setNewCase({
              ...newCase,
              customer: e.target.value,
            })
          }
          required
        />

        <input
          type="text"
          placeholder="Amount"
          value={newCase.amount}
          onChange={(e) =>
            setNewCase({
              ...newCase,
              amount: e.target.value,
            })
          }
          required
        />

        <select
          value={newCase.risk}
          onChange={(e) =>
            setNewCase({
              ...newCase,
              risk: e.target.value,
            })
          }
        >
          <option value="High">High Risk</option>
          <option value="Medium">Medium Risk</option>
          <option value="Low">Low Risk</option>
        </select>

        <select
          value={newCase.status}
          onChange={(e) =>
            setNewCase({
              ...newCase,
              status: e.target.value,
            })
          }
        >
          <option value="Open">Open</option>
          <option value="Investigating">Investigating</option>
          <option value="Review">Review</option>
        </select>

        <div className="modal-buttons">

          <button
            type="button"
            onClick={() => setShowForm(false)}
          >
            Cancel
          </button>

          <button type="submit" className="primary-btn">
            Create Investigation
          </button>

        </div>

      </form>

    </div>
  </div>
)}
      <div className="page-header">
        <div>
          <h2>Investigations</h2>
          <p>
            Investigate suspicious financial transactions and fraud cases.
          </p>
        </div>

        <button
  className="primary-btn"
  onClick={() => setShowForm(true)}
>
  + New Investigation
</button>
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
                 value={search}
                   onChange={(e) => setSearch(e.target.value)}
                />
        </div>
        <tbody>
  {filteredCases.map((item) => (
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
        <span className="status-badge">
          {item.status}
        </span>
      </td>
    </tr>
  ))}
</tbody>

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
              {filteredCases.map((item) => (
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
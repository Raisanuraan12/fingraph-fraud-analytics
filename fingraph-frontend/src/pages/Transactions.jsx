import { useState } from "react";

function Transactions() {
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const transactions = [
    {
      id: "TXN-78421",
      customer: "Customer A",
      amount: "₹2.4L",
      date: "17 Aug 2026",
      risk: "High",
      status: "Suspicious",
    },
    {
      id: "TXN-78435",
      customer: "Customer B",
      amount: "₹85K",
      date: "17 Aug 2026",
      risk: "Medium",
      status: "Review",
    },
    {
      id: "TXN-78456",
      customer: "Customer C",
      amount: "₹42K",
      date: "16 Aug 2026",
      risk: "Low",
      status: "Completed",
    },
    {
      id: "TXN-78472",
      customer: "Customer D",
      amount: "₹1.8L",
      date: "16 Aug 2026",
      risk: "High",
      status: "Suspicious",
    },
    {
      id: "TXN-78489",
      customer: "Customer E",
      amount: "₹65K",
      date: "15 Aug 2026",
      risk: "Medium",
      status: "Review",
    },
    {
      id: "TXN-78501",
      customer: "Customer F",
      amount: "₹28K",
      date: "15 Aug 2026",
      risk: "Low",
      status: "Completed",
    },
    {
      id: "TXN-78518",
      customer: "Customer G",
      amount: "₹3.1L",
      date: "14 Aug 2026",
      risk: "High",
      status: "Blocked",
    },
    {
      id: "TXN-78524",
      customer: "Customer H",
      amount: "₹18K",
      date: "14 Aug 2026",
      risk: "Low",
      status: "Completed",
    },
  ];

  const filteredTransactions = transactions.filter((item) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      item.id.toLowerCase().includes(searchText) ||
      item.customer.toLowerCase().includes(searchText) ||
      item.amount.toLowerCase().includes(searchText);

    const matchesRisk =
      riskFilter === "All" ||
      item.risk === riskFilter;

    const matchesStatus =
      statusFilter === "All" ||
      item.status === statusFilter;

    return (
      matchesSearch &&
      matchesRisk &&
      matchesStatus
    );
  });

  const highRiskCount = transactions.filter(
    (item) => item.risk === "High"
  ).length;

  const suspiciousCount = transactions.filter(
    (item) => item.status === "Suspicious"
  ).length;

  const blockedCount = transactions.filter(
    (item) => item.status === "Blocked"
  ).length;

  return (
    <div className="page-container">

      {/* =========================
          PAGE HEADER
      ========================== */}

      <div className="page-header">

        <div>
          <h2>Transactions</h2>

          <p>
            Monitor financial transactions,
            risk levels, and suspicious activity.
          </p>
        </div>

        <input
          type="text"
          placeholder="Search transaction..."
          className="search-input"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

      {/* =========================
          STATISTICS
      ========================== */}

      <div className="investigation-stats">

        <div className="info-card">
          <span>💳 Total Transactions</span>
          <h3>{transactions.length}</h3>
          <small>Transactions monitored</small>
        </div>

        <div className="info-card">
          <span>⚠️ Suspicious</span>
          <h3>{suspiciousCount}</h3>
          <small>Require investigation</small>
        </div>

        <div className="info-card">
          <span>🔴 High Risk</span>
          <h3>{highRiskCount}</h3>
          <small>Priority transactions</small>
        </div>

        <div className="info-card">
          <span>🚫 Blocked</span>
          <h3>{blockedCount}</h3>
          <small>Blocked transactions</small>
        </div>

      </div>

      {/* =========================
          TRANSACTION PANEL
      ========================== */}

      <div className="investigation-panel transactions-panel">

        <div className="panel-header">

          <div>
            <h3>Transaction Records</h3>

            <small>
              Review and monitor transaction activity
            </small>
          </div>

          <div className="transaction-filters">

            <select
              value={riskFilter}
              onChange={(e) =>
                setRiskFilter(e.target.value)
              }
              className="transaction-filter"
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

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="transaction-filter"
            >
              <option value="All">
                All Status
              </option>

              <option value="Suspicious">
                Suspicious
              </option>

              <option value="Review">
                Review
              </option>

              <option value="Completed">
                Completed
              </option>

              <option value="Blocked">
                Blocked
              </option>
            </select>

          </div>

        </div>

        {/* =========================
            TABLE
        ========================== */}

        <div className="table-container">

          <table>

            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Risk</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              {filteredTransactions.length > 0 ? (

                filteredTransactions.map(
                  (item) => (
                    <tr key={item.id}>

                      <td>
                        <strong>
                          {item.id}
                        </strong>
                      </td>

                      <td>
                        {item.customer}
                      </td>

                      <td>
                        {item.amount}
                      </td>

                      <td>
                        {item.date}
                      </td>

                      <td>

                        <span
                          className={`risk-badge ${item.risk.toLowerCase()}`}
                        >
                          {item.risk}
                        </span>

                      </td>

                      <td>

                        <span
                          className={`transaction-status ${item.status.toLowerCase()}`}
                        >
                          {item.status}
                        </span>

                      </td>

                    </tr>
                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan="6"
                    className="no-transactions"
                  >
                    🔍 No transactions found.
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

export default Transactions;
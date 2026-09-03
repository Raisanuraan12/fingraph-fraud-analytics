import { useEffect, useState } from "react";

const API_BASE_URL =
  "https://corn-guidance-penguin-probe.trycloudflare.com";

function getRiskLevel(riskIndex) {
  const value = Number(riskIndex);

  if (value >= 0.8) return "High";
  if (value >= 0.4) return "Medium";
  return "Low";
}

function getStatus(fraudLabel, riskIndex) {
  if (fraudLabel === "suspicious") {
    return "Suspicious";
  }

  if (Number(riskIndex) >= 0.8) {
    return "High Risk";
  }

  return "Normal";
}

function formatAmount(amount, currency) {
  const value = Number(amount);

  if (Number.isNaN(value)) {
    return "-";
  }

  return `${currency || "USD"} ${value.toFixed(2)}`;
}

function formatDate(dateString) {
  if (!dateString) {
    return "-";
  }

  const date = new Date(dateString.replace(" ", "T"));

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Transactions() {
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedTransaction, setSelectedTransaction] =
    useState(null);

  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================
  // FETCH REAL BACKEND TRANSACTIONS
  // =========================================

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/transactions?page=1&limit=100`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch transactions (${response.status})`
          );
        }

        const data = await response.json();

        const mappedTransactions = (
          data.transactions || []
        ).map((item) => ({
          id: item.txn_id,
          accountId: item.account_id,
          amount: formatAmount(
            item.amount,
            item.currency
          ),
          rawAmount: Number(item.amount),
          currency: item.currency,
          channel: item.channel,
          date: formatDate(item.txn_datetime),
          rawDate: item.txn_datetime,
          risk: getRiskLevel(item.risk_index),
          riskIndex: Number(item.risk_index),
          fraudLabel: item.fraud_label,
          status: getStatus(
            item.fraud_label,
            item.risk_index
          ),
        }));

        setTransactions(mappedTransactions);
      } catch (err) {
        console.error("Transaction API error:", err);
        setError(
          err.message ||
            "Unable to load transaction data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // =========================================
  // FILTER TRANSACTIONS
  // =========================================

  const filteredTransactions =
    transactions.filter((item) => {
      const searchText =
        search.toLowerCase().trim();

      const matchesSearch =
        item.id
          .toLowerCase()
          .includes(searchText) ||
        item.accountId
          .toLowerCase()
          .includes(searchText) ||
        item.amount
          .toLowerCase()
          .includes(searchText) ||
        item.channel
          .toLowerCase()
          .includes(searchText);

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

  // =========================================
  // STATISTICS
  // =========================================

  const totalTransactions =
    transactions.length;

  const suspiciousCount =
    transactions.filter(
      (item) =>
        item.fraudLabel === "suspicious"
    ).length;

  const highRiskCount =
    transactions.filter(
      (item) => item.risk === "High"
    ).length;

  // Real backend /transactions currently
  // does not provide blocked status.
  const blockedCount =
    transactions.filter(
      (item) => item.status === "Blocked"
    ).length;

  // =========================================
  // VIEW DETAILS
  // =========================================

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
  };

  // =========================================
  // CLOSE DETAILS
  // =========================================

  const closeDetails = () => {
    setSelectedTransaction(null);
  };

  // =========================================
  // RETURN UI
  // =========================================

  return (
    <div className="page-container">

      {/* PAGE HEADER */}

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

      {/* STATISTICS */}

      <div className="investigation-stats">

        <div className="info-card">
          <span>
            💳 Total Transactions
          </span>

          <h3>
            {loading
              ? "..."
              : totalTransactions}
          </h3>

          <small>
            Transactions loaded
          </small>
        </div>

        <div className="info-card">
          <span>
            ⚠️ Suspicious
          </span>

          <h3>
            {loading
              ? "..."
              : suspiciousCount}
          </h3>

          <small>
            Require investigation
          </small>
        </div>

        <div className="info-card">
          <span>
            🔴 High Risk
          </span>

          <h3>
            {loading
              ? "..."
              : highRiskCount}
          </h3>

          <small>
            Priority transactions
          </small>
        </div>

        <div className="info-card">
          <span>
            🚫 Blocked
          </span>

          <h3>
            {loading
              ? "..."
              : blockedCount}
          </h3>

          <small>
            Blocked transactions
          </small>
        </div>

      </div>

      {/* TRANSACTION PANEL */}

      <div className="investigation-panel transactions-panel">

        <div className="panel-header">

          <div>
            <h3>
              Transaction Records
            </h3>

            <small>
              Real transaction data from FinGraph backend
            </small>
          </div>

          {/* FILTERS */}

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

              <option value="High Risk">
                High Risk
              </option>

              <option value="Normal">
                Normal
              </option>

              <option value="Blocked">
                Blocked
              </option>
            </select>

          </div>

        </div>

        {/* ERROR */}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* LOADING */}

        {loading ? (
          <div className="no-transactions">
            Loading transactions...
          </div>
        ) : (

          <div className="table-container">

            <table>

              <thead>

                <tr>
                  <th>Transaction ID</th>
                  <th>Account</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Channel</th>
                  <th>Risk</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>

              </thead>

              <tbody>

                {filteredTransactions.length > 0 ? (

                  filteredTransactions.map(
                    (item) => (

                      <tr key={item.id}>

                        {/* TRANSACTION ID */}

                        <td>
                          <strong>
                            {item.id}
                          </strong>
                        </td>

                        {/* ACCOUNT */}

                        <td>
                          {item.accountId}
                        </td>

                        {/* AMOUNT */}

                        <td>
                          {item.amount}
                        </td>

                        {/* DATE */}

                        <td>
                          {item.date}
                        </td>

                        {/* CHANNEL */}

                        <td>
                          {item.channel}
                        </td>

                        {/* RISK */}

                        <td>

                          <span
                            className={`risk-badge ${item.risk.toLowerCase()}`}
                          >
                            {item.risk}
                          </span>

                        </td>

                        {/* STATUS */}

                        <td>

                          <span
                            className={`transaction-status ${item.status
                              .toLowerCase()
                              .replace(" ", "-")}`}
                          >
                            {item.status}
                          </span>

                        </td>

                        {/* ACTION */}

                        <td>

                          <div className="transaction-actions">

                            <button
                              type="button"
                              className="transaction-view-btn"
                              onClick={() =>
                                handleViewDetails(item)
                              }
                            >
                              View
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )

                ) : (

                  <tr>

                    <td
                      colSpan="8"
                      className="no-transactions"
                    >
                      🔍 No transactions found.
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* TRANSACTION DETAILS MODAL */}

      {selectedTransaction && (

        <div
          className="transaction-modal-overlay"
          onClick={closeDetails}
        >

          <div
            className="transaction-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="transaction-modal-header">

              <div>

                <h3>
                  Transaction Details
                </h3>

                <small>
                  Complete transaction information
                </small>

              </div>

              <button
                type="button"
                className="transaction-modal-close"
                onClick={closeDetails}
              >
                ×
              </button>

            </div>

            {/* TRANSACTION ICON */}

            <div className="transaction-detail-icon">
              💳
            </div>

            <h2 className="transaction-detail-id">
              {selectedTransaction.id}
            </h2>

            {/* DETAILS */}

            <div className="transaction-detail-list">

              <div className="transaction-detail-row">

                <span>
                  Account
                </span>

                <strong>
                  {selectedTransaction.accountId}
                </strong>

              </div>

              <div className="transaction-detail-row">

                <span>
                  Amount
                </span>

                <strong>
                  {selectedTransaction.amount}
                </strong>

              </div>

              <div className="transaction-detail-row">

                <span>
                  Date
                </span>

                <strong>
                  {selectedTransaction.date}
                </strong>

              </div>

              <div className="transaction-detail-row">

                <span>
                  Channel
                </span>

                <strong>
                  {selectedTransaction.channel}
                </strong>

              </div>

              <div className="transaction-detail-row">

                <span>
                  Risk Index
                </span>

                <strong>
                  {selectedTransaction.riskIndex.toFixed(3)}
                </strong>

              </div>

              <div className="transaction-detail-row">

                <span>
                  Risk Level
                </span>

                <span
                  className={`risk-badge ${selectedTransaction.risk.toLowerCase()}`}
                >
                  {selectedTransaction.risk}
                </span>

              </div>

              <div className="transaction-detail-row">

                <span>
                  Fraud Label
                </span>

                <strong>
                  {selectedTransaction.fraudLabel}
                </strong>

              </div>

              <div className="transaction-detail-row">

                <span>
                  Status
                </span>

                <span
                  className={`transaction-status ${selectedTransaction.status
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {selectedTransaction.status}
                </span>

              </div>

            </div>

            {/* MODAL ACTIONS */}

            <div className="transaction-modal-actions">

              <button
                type="button"
                className="secondary-btn"
                onClick={closeDetails}
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Transactions;
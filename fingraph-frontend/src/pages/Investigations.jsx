import { useState, useEffect } from "react";

function Investigations() {
  // =========================
  // SHOW / HIDE FORM
  // =========================
  const [showForm, setShowForm] = useState(false);

  // =========================
  // NEW INVESTIGATION FORM
  // =========================
  const [newCase, setNewCase] = useState({
    transaction: "",
    customer: "",
    amount: "",
    risk: "Medium",
    status: "Open",
  });

  // =========================
  // DEFAULT INVESTIGATIONS
  // =========================
  const defaultCases = [
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

  // =========================
  // LOAD CASES FROM LOCALSTORAGE
  // =========================
  const [cases, setCases] = useState(() => {
    try {
      const savedCases = localStorage.getItem("investigations");

      if (savedCases) {
        return JSON.parse(savedCases);
      }

      return defaultCases;
    } catch (error) {
      console.error("Error loading investigations:", error);
      return defaultCases;
    }
  });

  // =========================
  // SAVE CASES TO LOCALSTORAGE
  // =========================
  useEffect(() => {
    try {
      localStorage.setItem(
        "investigations",
        JSON.stringify(cases)
      );
    } catch (error) {
      console.error("Error saving investigations:", error);
    }
  }, [cases]);

  // =========================
  // SEARCH
  // =========================
  const [search, setSearch] = useState("");

  // =========================
  // CREATE INVESTIGATION
  // =========================
  const handleAddInvestigation = (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !newCase.transaction.trim() ||
      !newCase.customer.trim() ||
      !newCase.amount.trim()
    ) {
      alert("Please fill all required fields");
      return;
    }

    // Create new investigation
    const newInvestigation = {
      id: `INV-${1001 + cases.length}`,
      transaction: newCase.transaction.trim(),
      customer: newCase.customer.trim(),
      amount: newCase.amount.trim(),
      risk: newCase.risk,
      status: newCase.status,
    };

    // Add investigation
    setCases((previousCases) => [
      ...previousCases,
      newInvestigation,
    ]);

    // Reset form
    setNewCase({
      transaction: "",
      customer: "",
      amount: "",
      risk: "Medium",
      status: "Open",
    });

    // Close modal
    setShowForm(false);
  };

  // =========================
  // FILTER / SEARCH CASES
  // =========================
  const filteredCases = cases.filter((item) => {
    const searchText = search.toLowerCase();

    return (
      item.id.toLowerCase().includes(searchText) ||
      item.transaction.toLowerCase().includes(searchText) ||
      item.customer.toLowerCase().includes(searchText)
    );
  });

  // =========================
  // RETURN UI
  // =========================
  return (
    <div className="page-container">

      {/* =====================================
          NEW INVESTIGATION MODAL
      ====================================== */}
      {showForm && (
        <div className="modal-overlay">

          <div className="modal">

            <h2>New Investigation</h2>

            <form onSubmit={handleAddInvestigation}>

              {/* Transaction ID */}
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

              {/* Customer Name */}
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

              {/* Amount */}
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

              {/* Risk */}
              <select
                value={newCase.risk}
                onChange={(e) =>
                  setNewCase({
                    ...newCase,
                    risk: e.target.value,
                  })
                }
              >
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

              {/* Status */}
              <select
                value={newCase.status}
                onChange={(e) =>
                  setNewCase({
                    ...newCase,
                    status: e.target.value,
                  })
                }
              >
                <option value="Open">
                  Open
                </option>

                <option value="Investigating">
                  Investigating
                </option>

                <option value="Review">
                  Review
                </option>
              </select>

              {/* Modal Buttons */}
              <div className="modal-buttons">

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                >
                  Create Investigation
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* =====================================
          PAGE HEADER
      ====================================== */}
      <div className="page-header">

        <div>
          <h2>Investigations</h2>

          <p>
            Investigate suspicious financial
            transactions and fraud cases.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() => setShowForm(true)}
        >
          + New Investigation
        </button>

      </div>

      {/* =====================================
          INVESTIGATION STATISTICS
      ====================================== */}
      <div className="investigation-stats">

        <div className="info-card">
          <span>🔍 Open Cases</span>

          <h3>
            {
              cases.filter(
                (item) => item.status === "Open"
              ).length
            }
          </h3>

          <small>
            Requires investigation
          </small>
        </div>

        <div className="info-card">
          <span>⚠️ High Risk</span>

          <h3>
            {
              cases.filter(
                (item) => item.risk === "High"
              ).length
            }
          </h3>

          <small>
            Priority cases
          </small>
        </div>

        <div className="info-card">
          <span>📋 Total Cases</span>

          <h3>
            {cases.length}
          </h3>

          <small>
            Active investigations
          </small>
        </div>

      </div>

      {/* =====================================
          INVESTIGATION PANEL
      ====================================== */}
      <div className="investigation-panel">

        {/* Panel Header */}
        <div className="panel-header">

          <h3>
            Active Investigations
          </h3>

          <input
            type="text"
            placeholder="Search investigation..."
            className="search-input"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        {/* =====================================
            TABLE
        ====================================== */}
        <div className="table-container">

          <table>

            <thead>
              <tr>

                <th>
                  Case ID
                </th>

                <th>
                  Transaction
                </th>

                <th>
                  Customer
                </th>

                <th>
                  Amount
                </th>

                <th>
                  Risk
                </th>

                <th>
                  Status
                </th>

              </tr>
            </thead>

            <tbody>

              {filteredCases.length > 0 ? (

                filteredCases.map((item) => (

                  <tr key={item.id}>

                    <td>
                      {item.id}
                    </td>

                    <td>
                      {item.transaction}
                    </td>

                    <td>
                      {item.customer}
                    </td>

                    <td>
                      {item.amount}
                    </td>

                    <td>

                      <span
                        className={`risk-badge ${item.risk.toLowerCase()}`}
                      >
                        {item.risk}
                      </span>

                    </td>

                    <td>

                      <span className="status-badge">
                        {item.status}
                      </span>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "20px",
                    }}
                  >
                    No investigations found.
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

export default Investigations;
import { useState } from "react";

function FraudNetwork() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [search, setSearch] = useState("");

  // =========================
  // FRAUD NETWORK NODES
  // =========================
  const nodes = [
    {
      id: "CUST-001",
      label: "Customer A",
      type: "Customer",
      risk: "High",
      x: 180,
      y: 170,
    },
    {
      id: "CUST-002",
      label: "Customer B",
      type: "Customer",
      risk: "Medium",
      x: 480,
      y: 120,
    },
    {
      id: "CUST-003",
      label: "Customer C",
      type: "Customer",
      risk: "Low",
      x: 720,
      y: 210,
    },
    {
      id: "CUST-004",
      label: "Customer D",
      type: "Customer",
      risk: "High",
      x: 600,
      y: 430,
    },
    {
      id: "TXN-78421",
      label: "₹2.4L",
      type: "Transaction",
      risk: "High",
      x: 330,
      y: 300,
    },
    {
      id: "TXN-78435",
      label: "₹85K",
      type: "Transaction",
      risk: "Medium",
      x: 560,
      y: 270,
    },
    {
      id: "TXN-78456",
      label: "₹42K",
      type: "Transaction",
      risk: "Low",
      x: 420,
      y: 470,
    },
  ];

  // =========================
  // CONNECTIONS
  // =========================
  const connections = [
    {
      from: "CUST-001",
      to: "TXN-78421",
      label: "Initiated",
    },
    {
      from: "CUST-002",
      to: "TXN-78421",
      label: "Linked",
    },
    {
      from: "CUST-002",
      to: "TXN-78435",
      label: "Initiated",
    },
    {
      from: "CUST-003",
      to: "TXN-78456",
      label: "Initiated",
    },
    {
      from: "CUST-004",
      to: "TXN-78435",
      label: "Linked",
    },
    {
      from: "CUST-001",
      to: "CUST-002",
      label: "Shared Device",
    },
    {
      from: "CUST-002",
      to: "CUST-004",
      label: "Shared Account",
    },
  ];

  // =========================
  // FIND NODE
  // =========================
  const getNode = (id) => {
    return nodes.find((node) => node.id === id);
  };

  // =========================
  // SEARCH
  // =========================
  const filteredNodes = nodes.filter((node) => {
    const searchText = search.toLowerCase();

    return (
      node.id.toLowerCase().includes(searchText) ||
      node.label.toLowerCase().includes(searchText) ||
      node.type.toLowerCase().includes(searchText) ||
      node.risk.toLowerCase().includes(searchText)
    );
  });

  // =========================
  // NODE RADIUS
  // =========================
  const getRadius = (node) => {
    return node.type === "Transaction" ? 30 : 38;
  };

  // =========================
  // NODE CLASS
  // =========================
  const getRiskClass = (risk) => {
    if (risk === "High") {
      return "network-high";
    }

    if (risk === "Medium") {
      return "network-medium";
    }

    return "network-low";
  };

  // =========================
  // NETWORK STATISTICS
  // =========================
  const customerCount = nodes.filter(
    (node) => node.type === "Customer"
  ).length;

  const transactionCount = nodes.filter(
    (node) => node.type === "Transaction"
  ).length;

  const highRiskCount = nodes.filter(
    (node) => node.risk === "High"
  ).length;

  // =========================
  // RETURN UI
  // =========================
  return (
    <div className="page-container">

      {/* =========================
          PAGE HEADER
      ========================== */}
      <div className="page-header">

        <div>
          <h2>Fraud Network</h2>

          <p>
            Visualize connections between suspicious
            accounts and transactions.
          </p>
        </div>

        <div className="network-search">
          <input
            type="text"
            placeholder="Search customer or transaction..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

      </div>

      {/* =========================
          NETWORK STATISTICS
      ========================== */}
      <div className="investigation-stats">

        <div className="info-card">
          <span>👤 Accounts</span>
          <h3>{customerCount}</h3>
          <small>Connected accounts</small>
        </div>

        <div className="info-card">
          <span>💳 Transactions</span>
          <h3>{transactionCount}</h3>
          <small>Linked transactions</small>
        </div>

        <div className="info-card">
          <span>⚠️ High Risk</span>
          <h3>{highRiskCount}</h3>
          <small>Priority nodes</small>
        </div>

      </div>

      {/* =========================
          MAIN NETWORK AREA
      ========================== */}
      <div className="network-layout">

        {/* =========================
            NETWORK GRAPH
        ========================== */}
        <div className="investigation-panel network-panel">

          <div className="panel-header">
            <div>
              <h3>Fraud Connection Network</h3>

              <small>
                Click any node to view details
              </small>
            </div>
          </div>

          <div className="network-graph">

            <svg
              viewBox="0 0 900 600"
              className="fraud-network-svg"
            >

              {/* =========================
                  CONNECTION LINES
              ========================== */}
              {connections.map((connection, index) => {

                const fromNode = getNode(connection.from);
                const toNode = getNode(connection.to);

                if (!fromNode || !toNode) {
                  return null;
                }

                const isSearchMatch =
                  search &&
                  (
                    fromNode.id
                      .toLowerCase()
                      .includes(search.toLowerCase()) ||
                    fromNode.label
                      .toLowerCase()
                      .includes(search.toLowerCase()) ||
                    toNode.id
                      .toLowerCase()
                      .includes(search.toLowerCase()) ||
                    toNode.label
                      .toLowerCase()
                      .includes(search.toLowerCase())
                  );

                return (
                  <g
                    key={`${connection.from}-${connection.to}-${index}`}
                    className={
                      isSearchMatch
                        ? "network-connection active"
                        : "network-connection"
                    }
                  >

                    <line
                      x1={fromNode.x}
                      y1={fromNode.y}
                      x2={toNode.x}
                      y2={toNode.y}
                    />

                  </g>
                );
              })}

              {/* =========================
                  NODES
              ========================== */}
              {nodes.map((node) => {

                const isVisible =
                  search === "" ||
                  filteredNodes.some(
                    (item) => item.id === node.id
                  );

                const isSelected =
                  selectedNode?.id === node.id;

                if (!isVisible) {
                  return null;
                }

                return (
                  <g
                    key={node.id}
                    className={`network-node ${getRiskClass(
                      node.risk
                    )} ${
                      isSelected
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedNode(node)
                    }
                    style={{
                      cursor: "pointer",
                    }}
                  >

                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={getRadius(node)}
                    />

                    <text
                      x={node.x}
                      y={node.y + 5}
                      textAnchor="middle"
                      className="network-node-text"
                    >
                      {node.type === "Customer"
                        ? "👤"
                        : "₹"}
                    </text>

                    <text
                      x={node.x}
                      y={node.y + 58}
                      textAnchor="middle"
                      className="network-node-label"
                    >
                      {node.label}
                    </text>

                  </g>
                );
              })}

            </svg>

          </div>

          {/* =========================
              LEGEND
          ========================== */}
          <div className="network-legend">

            <span>
              <i className="legend-dot high"></i>
              High Risk
            </span>

            <span>
              <i className="legend-dot medium"></i>
              Medium Risk
            </span>

            <span>
              <i className="legend-dot low"></i>
              Low Risk
            </span>

            <span>
              👤 Customer
            </span>

            <span>
              ₹ Transaction
            </span>

          </div>

        </div>

        {/* =========================
            NODE DETAILS
        ========================== */}
        <div className="investigation-panel network-details">

          <div className="panel-header">
            <h3>Node Details</h3>
          </div>

          {selectedNode ? (

            <div className="node-details-content">

              <div className="selected-node-icon">
                {selectedNode.type === "Customer"
                  ? "👤"
                  : "₹"}
              </div>

              <h3>
                {selectedNode.label}
              </h3>

              <p className="node-id">
                {selectedNode.id}
              </p>

              <div className="detail-row">
                <span>Type</span>
                <strong>
                  {selectedNode.type}
                </strong>
              </div>

              <div className="detail-row">
                <span>Risk</span>

                <strong
                  className={`risk-text ${selectedNode.risk.toLowerCase()}`}
                >
                  {selectedNode.risk}
                </strong>
              </div>

              <div className="detail-row">
                <span>Connections</span>

                <strong>
                  {
                    connections.filter(
                      (connection) =>
                        connection.from ===
                          selectedNode.id ||
                        connection.to ===
                          selectedNode.id
                    ).length
                  }
                </strong>
              </div>

              <button
                className="secondary-btn"
                onClick={() =>
                  setSelectedNode(null)
                }
              >
                Clear Selection
              </button>

            </div>

          ) : (

            <div className="empty-node">

              <div className="empty-node-icon">
                🕸️
              </div>

              <h3>
                Select a node
              </h3>

              <p>
                Click any customer or transaction
                in the network to view its details.
              </p>

            </div>

          )}

        </div>

      </div>

      {/* =========================
          SUSPICIOUS CONNECTIONS
      ========================== */}
      <div className="investigation-panel suspicious-connections">

        <div className="panel-header">

          <div>
            <h3>
              Suspicious Connections
            </h3>

            <small>
              Potential relationships requiring review
            </small>
          </div>

        </div>

        <div className="connection-list">

          {connections.map((connection, index) => {

            const fromNode =
              getNode(connection.from);

            const toNode =
              getNode(connection.to);

            if (!fromNode || !toNode) {
              return null;
            }

            const connectionRisk =
              fromNode.risk === "High" ||
              toNode.risk === "High"
                ? "High"
                : fromNode.risk === "Medium" ||
                  toNode.risk === "Medium"
                ? "Medium"
                : "Low";

            return (
              <div
                className="connection-item"
                key={index}
              >

                <div className="connection-node">

                  <span>
                    {fromNode.type === "Customer"
                      ? "👤"
                      : "₹"}
                  </span>

                  <strong>
                    {fromNode.label}
                  </strong>

                </div>

                <div className="connection-arrow">
                  →
                </div>

                <div className="connection-node">

                  <span>
                    {toNode.type === "Customer"
                      ? "👤"
                      : "₹"}
                  </span>

                  <strong>
                    {toNode.label}
                  </strong>

                </div>

                <div className="connection-type">
                  {connection.label}
                </div>

                <span
                  className={`risk-badge ${connectionRisk.toLowerCase()}`}
                >
                  {connectionRisk}
                </span>

              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
}

export default FraudNetwork;
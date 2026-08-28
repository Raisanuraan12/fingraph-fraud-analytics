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
  role="img"
  aria-label="Fraud connection network"
>
  <defs>
    <linearGradient
      id="networkBackground"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop offset="0%" stopColor="#0b1220" />
      <stop offset="100%" stopColor="#111827" />
    </linearGradient>

    <filter
      id="nodeGlow"
      x="-50%"
      y="-50%"
      width="200%"
      height="200%"
    >
      <feGaussianBlur
        stdDeviation="5"
        result="blur"
      />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <pattern
      id="networkGrid"
      width="40"
      height="40"
      patternUnits="userSpaceOnUse"
    >
      <path
        d="M 40 0 L 0 0 0 40"
        fill="none"
        stroke="#334155"
        strokeWidth="1"
        opacity="0.25"
      />
    </pattern>
  </defs>

  {/* Network background */}
  <rect
    x="0"
    y="0"
    width="900"
    height="600"
    rx="18"
    fill="url(#networkBackground)"
  />

  {/* Network grid */}
  <rect
    x="0"
    y="0"
    width="900"
    height="600"
    rx="18"
    fill="url(#networkGrid)"
  />

  {/* Connection lines */}
  {connections.map((connection, index) => {
    const fromNode = getNode(connection.from);
    const toNode = getNode(connection.to);

    if (!fromNode || !toNode) {
      return null;
    }

    const searchText = search.toLowerCase();

    const isSearchMatch =
      searchText &&
      (
        fromNode.id.toLowerCase().includes(searchText) ||
        fromNode.label.toLowerCase().includes(searchText) ||
        toNode.id.toLowerCase().includes(searchText) ||
        toNode.label.toLowerCase().includes(searchText)
      );

    const isSelectedConnection =
      selectedNode &&
      (
        connection.from === selectedNode.id ||
        connection.to === selectedNode.id
      );

    return (
      <g
        key={`${connection.from}-${connection.to}-${index}`}
      >
        <line
          x1={fromNode.x}
          y1={fromNode.y}
          x2={toNode.x}
          y2={toNode.y}
          stroke={
            isSelectedConnection
              ? "#38bdf8"
              : isSearchMatch
              ? "#facc15"
              : "#475569"
          }
          strokeWidth={
            isSelectedConnection || isSearchMatch
              ? 5
              : 2.5
          }
          strokeLinecap="round"
          opacity={
            search && !isSearchMatch
              ? 0.25
              : 0.85
          }
        />

        {/* Connection direction point */}
        <circle
          cx={(fromNode.x + toNode.x) / 2}
          cy={(fromNode.y + toNode.y) / 2}
          r="4"
          fill={
            isSelectedConnection
              ? "#38bdf8"
              : "#64748b"
          }
          opacity="0.9"
        />
      </g>
    );
  })}

  {/* Nodes */}
  {nodes.map((node) => {
    const isVisible =
      search === "" ||
      filteredNodes.some(
        (item) => item.id === node.id
      );

    const isSelected =
      selectedNode?.id === node.id;

    const isSearchMatch =
      search &&
      (
        node.id
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        node.label
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        node.type
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        node.risk
          .toLowerCase()
          .includes(search.toLowerCase())
      );

    if (!isVisible) {
      return null;
    }

    let nodeColor = "#22c55e";

    if (node.risk === "High") {
      nodeColor = "#ef4444";
    } else if (node.risk === "Medium") {
      nodeColor = "#f59e0b";
    }

    if (node.type === "Transaction") {
      nodeColor =
        node.risk === "High"
          ? "#f97316"
          : node.risk === "Medium"
          ? "#eab308"
          : "#06b6d4";
    }

    return (
      <g
        key={node.id}
        onClick={() => setSelectedNode(node)}
        style={{
          cursor: "pointer",
          opacity:
            search && !isSearchMatch
              ? 0.35
              : 1,
        }}
      >
        {/* Selected node outer ring */}
        {isSelected && (
          <circle
            cx={node.x}
            cy={node.y}
            r={node.type === "Transaction" ? 45 : 55}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="4"
            opacity="0.9"
            filter="url(#nodeGlow)"
          />
        )}

        {/* Search highlight */}
        {isSearchMatch && (
          <circle
            cx={node.x}
            cy={node.y}
            r={node.type === "Transaction" ? 42 : 50}
            fill="none"
            stroke="#facc15"
            strokeWidth="3"
            strokeDasharray="7 5"
          />
        )}

        {/* Main node */}
        <circle
          cx={node.x}
          cy={node.y}
          r={getRadius(node)}
          fill="#0f172a"
          stroke={nodeColor}
          strokeWidth="5"
          filter={
            isSelected
              ? "url(#nodeGlow)"
              : undefined
          }
        />

        {/* Inner node */}
        <circle
          cx={node.x}
          cy={node.y}
          r={getRadius(node) - 9}
          fill={nodeColor}
          opacity="0.18"
        />

        {/* Node icon */}
        <text
          x={node.x}
          y={node.y + 8}
          textAnchor="middle"
          fontSize="22"
          fontWeight="700"
          fill="#ffffff"
        >
          {node.type === "Customer" ? "A" : "₹"}
        </text>

        {/* Node label */}
        <text
          x={node.x}
          y={node.y + 65}
          textAnchor="middle"
          fill="#f8fafc"
          fontSize="16"
          fontWeight="600"
        >
          {node.label}
        </text>

        {/* Node type */}
        <text
          x={node.x}
          y={node.y + 84}
          textAnchor="middle"
          fill="#94a3b8"
          fontSize="12"
        >
          {node.type}
        </text>

        {/* Risk label */}
        <text
          x={node.x}
          y={node.y - 48}
          textAnchor="middle"
          fill={nodeColor}
          fontSize="11"
          fontWeight="700"
        >
          {node.risk.toUpperCase()} RISK
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
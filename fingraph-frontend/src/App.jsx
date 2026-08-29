import { Link, useLocation } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Investigations from "./pages/Investigations";
import FraudNetwork from "./pages/FraudNetwork";
import Alerts from "./pages/Alerts";
import Analytics from "./pages/Analytics";
import Transactions from "./pages/Transactions";
import InvestigationDetails from "./pages/InvestigationDetails";
import Settings from "./pages/Setting";


import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const fraudData = [
  { time: "09:00", fraud: 12 },
  { time: "10:00", fraud: 18 },
  { time: "11:00", fraud: 15 },
  { time: "12:00", fraud: 28 },
  { time: "13:00", fraud: 22 },
  { time: "14:00", fraud: 35 },
  { time: "15:00", fraud: 30 },
  { time: "16:00", fraud: 42 }
];

function App() {
  const location = useLocation();

  return (
    <div className="dashboard">

      {/* =========================
          SIDEBAR
      ========================== */}

      <aside className="sidebar">

        <h2 className="logo">
          FinGraph
        </h2>

        <nav>

          <Link to="/">
            📊 Dashboard
          </Link>

          <Link to="/investigations">
            🔍 Investigations
          </Link>

          <Link to="/fraud-network">
            ⚛ Fraud Network
          </Link>

          <Link to="/alerts">
            🚨 Alerts
          </Link>

          <Link to="/analytics">
            ▣ Analytics
          </Link>

          {/* DAY 7 - TRANSACTIONS */}
          <Link to="/transactions">
            💳 Transactions
          </Link>
          <Link to="/account-investigation">
          👤 Account Investigation
          </Link>
          <Link to="/investigation-details">
          🔍 Investigation Details
          </Link>
          <Link to="/settings">
            ⚙ Settings
          </Link>

        </nav>

        <div className="sidebar-footer">
          <span>Frontend & UI</span>
          <small>FinGraph Analytics</small>
        </div>

      </aside>

      {/* =========================
          MAIN CONTENT
      ========================== */}

      <main className="main-content">

       {location.pathname === "/" ? (

  <Dashboard />

        ) : location.pathname === "/investigations" ? (

          <Investigations />

        ) : location.pathname === "/fraud-network" ? (

          <FraudNetwork />

        ) : location.pathname === "/alerts" ? (

          <Alerts />

        ) : location.pathname === "/analytics" ? (

          <Analytics />

        ) : location.pathname === "/transactions" ? (

          <Transactions />

        ) : location.pathname === "/settings" ? (

          <Settings />

        ) : location.pathname === "/investigation-details" ? (

          <InvestigationDetails />

        ) : (

          <Dashboard />

        )}

      </main>

    </div>
  );
}

export default App;
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import LoginCard from "./pages/LoginCard";
import RegisterCard from "./pages/RegisterCard";
import Profile from "./pages/Profile";

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginCard />} />
          <Route path="/register" element={<RegisterCard />} />
          <Route
            path="/dashboard/investor"
            element={<Dashboard userType="investor" />}
          />
          <Route
            path="/dashboard/entrepreneur"
            element={<Dashboard userType="entrepreneur" />}
          />
          <Route
            path="/profile/investor/:id"
            element={<Profile userType="investor" />}
          />
          <Route
            path="/profile/entrepreneur/:id"
            element={<Profile userType="entrepreneur" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import Navbar from "../components/Navbar";
import "./StudentDashboard.css";
import StatCard from "../components/StatCard";
import ActionCard from "../components/ActionCard";
import RecentComplaints from "../components/RecentComplaints";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <div className="container">
        <div className="welcome">
          <h2>Welcome Back Ashok! 👋</h2>
          <p>Here's your complaint and feedback overview</p>
        </div>

        <div className="stats">
          <StatCard title="Total Complaints" value="120" />
          <StatCard title="Pending" value="39" />
          <StatCard title="Resolved" value="49" />
        </div>

        <div className="actions">
          <ActionCard
            title="Submit Complaint"
            desc="Report an issue or problems"
            icon="📝"
            onClick={() => navigate("/submit-complaint")}
          />

          <ActionCard
            title="Give Feedback"
            desc="Share your thoughts"
            icon="💬"
            onClick={() => navigate("/feedback")}
          />

          <ActionCard
            title="Track Complaints"
            desc="Check complaint status"
            icon="🔍"
            onClick={() => navigate("/track")}
          />

          <ActionCard
            title="View History"
            desc="See past complaints"
            icon="📋"
            onClick={() => navigate("/history")}
          />
        </div>

        <RecentComplaints />
      </div>

      <Footer />
    </>
  );
}
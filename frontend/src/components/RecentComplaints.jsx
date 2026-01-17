export default function RecentComplaints() {
  return (
    <div className="recent">
      <h3>Recent Complaints</h3>

      <div className="complaint">
        <strong>Lab computer is not working</strong>
        <p>ID: CMP12345 · Submitted 2 days ago</p>
      </div>

      <div className="complaint">
        <strong>Wifi connection issues</strong>
        <p>ID: CMP12344 · Submitted 5 days ago</p>
      </div>

      <div className="complaint">
        <strong>Lab AC not working</strong>
        <p>ID: CMP12343 · Submitted 1 week ago</p>
      </div>
    </div>
  );
}

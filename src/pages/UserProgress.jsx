import { useState } from "react";
import { db } from "../firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function UserProgress() {
  const [email, setEmail] = useState("");
  const [userData, setUserData] = useState(null);
  const [history, setHistory] = useState([]);
  const [latestDate, setLatestDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const fetchUser = async () => {
    const raw = email.trim();
    if (!raw) return;
    setLoading(true);
    setMsg("");
    setUserData(null);
    setHistory([]);

    // try both entered and lowercase (in case keys were lowercased on upload)
    const candidates = [raw, raw.toLowerCase()];

    try {
      // 1) Get all available report dates
      const datesSnap = await getDocs(collection(db, "progress_reports"));
      const dates = datesSnap.docs
        .map((d) => d.id)
        .sort((a, b) => a.localeCompare(b));

      if (dates.length === 0) {
        setMsg("No reports available yet.");
        setLoading(false);
        return;
      }

      // 2) Build history across all dates and remember the latest date that has a record
      const hist = [];
      let latest = null;
      let latestDateWithRecord = "";

      for (const d of dates) {
        // try both candidate keys for this date
        let snap = null;
        for (const key of candidates) {
          const ref = doc(db, "progress_reports", d, "users", key);
          const s = await getDoc(ref);
          if (s.exists()) {
            snap = s;
            break;
          }
        }

        if (snap && snap.exists()) {
          const data = snap.data();
          hist.push({ date: d, ...data });
          latest = { date: d, ...data };
          latestDateWithRecord = d; // because dates are sorted ascending
        }
      }

      // 3) Update state
      if (!latest) {
        setMsg("No records found for this email in any available report.");
        setLoading(false);
        return;
      }

      setLatestDate(latestDateWithRecord);
      setUserData(latest);
      setHistory(hist); // already in ascending order
      setLoading(false);
    } catch (err) {
      console.error("Error fetching user progress:", err);
      setMsg("Something went wrong while fetching your progress.");
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📊 Check Your Progress</h2>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: 6, width: 260, marginRight: 10 }}
      />
      <button onClick={fetchUser} disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </button>

      {msg && <p style={{ marginTop: 14 }}>{msg}</p>}

      {userData && (
        <div style={{ marginTop: 20 }}>
          <h3>{userData.user_name}</h3>
          {latestDate && (
            <p style={{ opacity: 0.8 }}>Latest report date: {latestDate}</p>
          )}
          <p>Badges: {userData.badges}</p>
          <p>Arcade Games: {userData.arcade}</p>
          <p>Trivia Games: {userData.trivia}</p>
          <p>
            <b>Total Score: {userData.total_score}</b>
          </p>

          {history.length > 1 && (
            <div style={{ marginTop: 28, height: 320 }}>
              <h4>Progress Over Time</h4>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="total_score"
                    name="Total Score"
                  />
                  <Line type="monotone" dataKey="badges" name="Badges" />
                  <Line type="monotone" dataKey="arcade" name="Arcade" />
                  <Line type="monotone" dataKey="trivia" name="Trivia" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default UserProgress;

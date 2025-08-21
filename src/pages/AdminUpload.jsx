import { useState } from "react";
import Papa from "papaparse";
import { db, login, logout } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

function AdminUpload() {
  const [user, setUser] = useState(null);

  const handleLogin = async () => {
    try {
      const res = await login();
      setUser(res.user);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        const today = new Date().toISOString().split("T")[0];

        try {
          // 🔹 Add placeholder at the date level
          await setDoc(
            doc(db, "progress_reports", today),
            { exists: true },
            { merge: true }
          );

          for (let row of results.data) {
            if (!row["User Email"]) continue;

            const email = row["User Email"].trim().toLowerCase(); // normalize keys

            const score =
              Math.floor(row["# of Skill Badges Completed"] / 2) +
              parseInt(row["# of Arcade Games Completed"] || 0) +
              parseInt(row["# of Trivia Games Completed"] || 0);

            await setDoc(doc(db, "progress_reports", today, "users", email), {
              user_name: row["User Name"],
              badges: parseInt(row["# of Skill Badges Completed"] || 0),
              arcade: parseInt(row["# of Arcade Games Completed"] || 0),
              trivia: parseInt(row["# of Trivia Games Completed"] || 0),
              total_score: score,
              timestamp: new Date().toISOString(),
            });
          }
          alert("✅ CSV uploaded successfully!");
        } catch (err) {
          console.error("Error uploading CSV:", err);
          alert("❌ Failed to upload CSV. Check console for details.");
        }
      },
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Upload</h2>

      {!user ? (
        <button onClick={handleLogin}>Login with Google</button>
      ) : (
        <div>
          <p>Logged in as {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
          <br />
          <br />
          <input type="file" accept=".csv" onChange={handleFile} />
        </div>
      )}
    </div>
  );
}

export default AdminUpload;

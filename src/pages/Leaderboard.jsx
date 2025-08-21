import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

function Leaderboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const today = new Date().toISOString().split("T")[0];
      try {
        const snapshot = await getDocs(
          collection(db, "progress_reports", today, "users")
        );
        const data = snapshot.docs.map((doc) => doc.data());
        const sorted = data.sort((a, b) => b.total_score - a.total_score);
        setUsers(sorted.slice(0, 10));
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <div className="glass-card w-full max-w-5xl">
        <h2 className="text-3xl font-extrabold text-white text-center mb-6 tracking-wide">
          🏆 Top 10 Leaderboard
        </h2>

        <div className="w-full overflow-x-auto">
          <table className="glass-table w-full text-white text-center rounded-2xl">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Badges</th>
                <th>Arcade</th>
                <th>Trivia</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{u.user_name}</td>
                  <td>{u.badges}</td>
                  <td>{u.arcade}</td>
                  <td>{u.trivia}</td>
                  <td className="font-bold">{u.total_score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;

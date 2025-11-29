import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const Account = ({ onLogout }) => {
  const [nickname, setNickname] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Use LASTEST user Data
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const u = JSON.parse(userStr);
      setNickname(u.nickname || "");
    }
  }, []);

  const handleSaveNickname = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nickname }),
      });
      const data = await res.json();
      if (res.ok) {

        // Local storeage UPDATE
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("Nickname updated!");

        // Reload -> App.jsx use new Data
        window.location.reload();
      } else {
        alert("Failed to update.");
      }
    } catch (e) {
      alert("Error connecting server");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure? This cannot be undone!")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/user`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Account deleted successfully.");
        onLogout();
      } else {
        alert("Failed to delete account.");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Error connecting to server.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex justify-center items-center px-4">
      <div className="bg-white/10 backdrop-blur-md p-10 rounded-3xl border border-white/20 shadow-2xl max-w-md w-full text-center animate-fade-in-up">
        <h2 className="text-3xl font-bold text-white mb-6">Account Settings</h2>

        {/* Edit Nickname */}
        <div className="mb-8 text-left">
          <label className="text-gray-300 text-sm ml-1">
            Display Name (Nickname)
          </label>
          <div className="flex gap-2 mt-1">
            <input
              type="text"
              className="grow bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#f3961c]"
              placeholder="Set your nickname..."
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            <button
              onClick={handleSaveNickname}
              disabled={isSaving}
              className="bg-[#f3961c] hover:bg-[#d88210] text-white px-4 rounded-xl transition-colors cursor-pointer"
            >
              {isSaving ? "..." : "Save"}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onLogout}
            className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl border border-white/5 transition-all"
          >
            Logout
          </button>
          <button
            onClick={handleDeleteAccount}
            className="w-full text-red-400 hover:text-red-300 py-2 text-sm transition-all"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;

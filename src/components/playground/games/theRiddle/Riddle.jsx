import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./styleRiddle.css";

const API_URL = import.meta.env.VITE_API_URL;

const GAME_CONFIG = {
  NAME: "THE RIDDLE",
  ROLES: {
    KEEPER: "Keeper",
    SEEKER: "Seeker",
    PRETENDER: "Pretender",
  },
};

const Riddle = ({ user }) => {
  // State Managemen
  const [view, setView] = useState("menu"); // menu, join, lobby, game
  const [menuState, setMenuState] = useState("default"); // default, join-input

  // Data State
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [players, setPlayers] = useState([]); // player list
  const [isHost, setIsHost] = useState(false);
  const [gameData, setGameData] = useState(null); // game state

  // Polling Ref (Timer)
  const pollingRef = useRef(null);

  // Auto-fill Name if Logged in
  useEffect(() => {
    if (user) {
      setPlayerName(user.nickname || user.username);
    }
  }, [user]);

  // Polling System (key of Realtime) ---
  // when in Lobby or Game -> ask Server every 3s
  useEffect(() => {
    if (view === "lobby" || view === "game") {
      startPolling();
    } else {
      stopPolling();
    }
    return () => stopPolling();
  }, [view, roomCode]);

  const startPolling = () => {
    stopPolling(); // Clear Oldone
    pollingRef.current = setInterval(fetchGameState, 3000); // ask Server every 3s
  };

  const stopPolling = () => {
    if (pollingRef.current) clearInterval(pollingRef.current);
  };

  // API Functions

  // Check Lobby Log (In, Out)
  const fetchGameState = async () => {
    if (!roomCode) return;
    try {
      const res = await fetch(`${API_URL}/game/state?code=${roomCode}`);
      const data = await res.json();

      if (res.ok) {
        setPlayers(data.players);

        // Lobby state shange playing -> start
        if (data.lobby.status === "playing") {
          setGameData(data.game);
          setView("game");
        }
      } else {
        // If Lobby gone everyone kick out
        alert("Connection lost or Room closed");
        leaveLobby();
      }
    } catch (err) {
      console.error("Polling error", err);
    }
  };

  // Create Lobby
  const handleCreateLobby = async () => {
    if (!playerName) return alert("Please enter your name!");

    try {
      const token = localStorage.getItem("token");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/game/create`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ playerName }),
      });
      const data = await res.json();

      if (res.ok) {
        setRoomCode(data.roomCode);
        setIsHost(true);
        setView("lobby");

        // First fetch
        fetchGameState();
      } else {
        alert(data.error || "Failed to create lobby");
      }
    } catch (err) {
      alert("Server Error");
    }
  };

  // Join Lobby
  const handleJoinLobby = async () => {
    if (!playerName) return alert("Please enter your name!");
    if (!joinCode) return alert("Please enter lobby code!");

    const code = joinCode.toUpperCase();

    try {
      const token = localStorage.getItem("token");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/game/join`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ roomCode: code, playerName }),
      });
      const data = await res.json();

      if (res.ok) {
        setRoomCode(code);
        setIsHost(false);
        setView("lobby");
        fetchGameState();
      } else {
        alert(data.error || "Failed to join (Room might be full or playing)");
      }
    } catch (err) {
      alert("Server Error");
    }
  };

  // Leave Lobby
  const leaveLobby = () => {
    stopPolling();
    setView("menu");
    setMenuState("default");
    setRoomCode("");
    setPlayers([]);
    // TODO: send API to tell Server (Later)
  };

  // Render UI

  return (
    <div className="min-h-[calc(100vh-80px)] flex justify-center items-center p-4">
      <div className="bg-black/40 backdrop-blur-md p-6 md:p-10 rounded-3xl border border-white/20 shadow-2xl w-full max-w-6xl animate-fade-in-up text-white relative flex flex-col min-h-[600px]">
        {/* Return btn */}
        <Link
          to="/games"
          className="absolute top-6 left-6 text-gray-300 hover:text-white transition-colors z-10"
        >
          <i className="bx bx-arrow-back text-2xl"></i>
        </Link>

        {/* VIEW: MENU */}
        {view === "menu" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 h-full grow">
            {/* Left: Rules */}
            <div className="flex flex-col h-full">
              <div className="bg-white/10 rounded-2xl p-6 h-full border border-white/10 overflow-y-auto custom-scrollbar shadow-inner backdrop-blur-sm">
                <h3 className="text-2xl font-bold mb-6 text-[#f3961c] flex items-center gap-2 border-b border-white/10 pb-4 sticky top-0 bg-transparent">
                  <i className="bx bxs-book-content"></i> Game Rules
                </h3>

                <ul className="space-y-6 text-gray-200 font-light text-sm md:text-base pr-2">
                  <li className="flex items-start gap-3">
                    <i className="bx bxs-shuffle text-[#f3961c] mt-1 shrink-0 text-xl"></i>
                    <span>
                      <strong className="text-white block mb-1 text-lg">
                        Random Roles
                      </strong>
                      Everyone receives a random role:{" "}
                      <strong className="text-amber-300">
                        {GAME_CONFIG.ROLES.KEEPER}
                      </strong>
                      ,{" "}
                      <strong className="text-red-400">
                        {GAME_CONFIG.ROLES.PRETENDER}
                      </strong>
                      , or{" "}
                      <strong className="text-green-300">
                        {GAME_CONFIG.ROLES.SEEKER}
                      </strong>
                      .
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="bx bxs-user-search text-[#f3961c] mt-1 shrink-0 text-xl"></i>
                    <span>
                      <strong className="text-white block mb-1 text-lg">
                        Who is who?
                      </strong>
                      Everyone knows the{" "}
                      <strong className="text-amber-300">
                        {GAME_CONFIG.ROLES.KEEPER}
                      </strong>
                      , but the{" "}
                      <strong className="text-red-400">
                        {GAME_CONFIG.ROLES.PRETENDER}
                      </strong>{" "}
                      is secret.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="bx bxs-message-bubble-question-mark text-[#f3961c] mt-1 shrink-0 text-xl"></i>
                    <span>
                      <strong className="text-white block mb-1 text-lg">
                        Find the Riddle
                      </strong>
                      The{" "}
                      <strong className="text-amber-300">
                        {GAME_CONFIG.ROLES.KEEPER}
                      </strong>{" "}
                      know the secret.{" "}
                      <strong className="text-green-300">Everyone else</strong>{" "}
                      ask questions to find the secret word.
                      <p className="text-xs text-gray-400 mt-2 italic">
                        *The{" "}
                        <strong className="text-amber-300">
                          {GAME_CONFIG.ROLES.KEEPER}
                        </strong>{" "}
                        can only answer "Yes, No or I Don't Know"
                      </p>
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="bx bxs-mask text-[#f3961c] mt-1 shrink-0 text-xl"></i>
                    <span>
                      <strong className="text-white block mb-1 text-lg">
                        The {GAME_CONFIG.ROLES.PRETENDER}
                      </strong>
                      Knows the secret! They must guide others without being
                      caught.
                    </span>
                  </li>
                  <li className="flex items-start gap-3 border-t border-white/20 pt-4">
                    <i className="bx bxs-trophy text-[#f3961c] mt-1 shrink-0 text-xl"></i>
                    <div>
                      <strong className="text-white block mb-1 text-lg">
                        Win Condition
                      </strong>
                      After finding the word, discuss with everyone and vote for
                      the {GAME_CONFIG.ROLES.PRETENDER}!
                      <ul className="list-disc list-inside mt-2 text-gray-300 space-y-1 ml-1">
                        <li>
                          Catch {GAME_CONFIG.ROLES.PRETENDER}:{" "}
                          <strong className="text-green-300">
                            {GAME_CONFIG.ROLES.SEEKER}s
                          </strong>{" "}
                          and{" "}
                          <strong className="text-amber-300">
                            {GAME_CONFIG.ROLES.KEEPER}
                          </strong>{" "}
                          Win
                        </li>
                        <li>
                          Fail to catch:{" "}
                          <strong className="text-red-400">
                            {GAME_CONFIG.ROLES.PRETENDER}
                          </strong>{" "}
                          Wins
                        </li>
                      </ul>
                      <p className="text-xs text-gray-400 mt-2 italic">
                        *If time runs out, everyone loses.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex flex-col justify-center items-center text-center space-y-8 py-4">
              <h1 className="text-6xl md:text-7xl font-extrabold text-[#f3961c] drop-shadow-xl tracking-wider uppercase">
                {GAME_CONFIG.NAME}
              </h1>

              {/* Name Input */}
              <div className="w-full max-w-md space-y-2">
                <label className="block text-left text-sm font-light ml-2 text-gray-300">
                  YOUR NICKNAME
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter name..."
                    // Unable to Change nickname if Loggedin
                    disabled={!!user}
                    className={`w-full bg-black/30 border-2 border-white/20 rounded-2xl px-6 py-4 text-white text-lg placeholder-gray-500 focus:outline-none focus:border-[#f3961c] transition-all shadow-lg ${
                      user ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                  />
                  <i className="bx bxs-user absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 text-xl"></i>
                </div>
              </div>

              <div className="w-full max-w-md border-t border-white/10"></div>

              <div className="w-full max-w-md grid grid-cols-1 gap-4 min-h-[140px]">
                {menuState === "default" && (
                  <div className="grid gap-4 animate-fade-in">
                    <button
                      onClick={handleCreateLobby}
                      className="group relative w-full bg-linear-to-r from-[#f3961c] to-[#d88210] hover:brightness-110 py-4 rounded-2xl font-bold text-xl shadow-lg transition-all transform hover:-translate-y-1 active:scale-95 overflow-hidden cursor-pointer"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        <i className="bx bxs-plus-square text-2xl"></i> CREATE
                        LOBBY
                      </span>
                    </button>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setMenuState("join")}
                        className="flex-1 bg-white/5 hover:bg-white/10 border-2 border-white/10 hover:border-green-400/50 hover:text-green-300 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 text-gray-400 cursor-pointer"
                      >
                        JOIN WITH CODE <i className="bx bxs-key text-2xl"></i>
                      </button>
                    </div>
                  </div>
                )}

                {menuState === "join" && (
                  <div className="grid gap-4 animate-fade-in">
                    <input
                      type="text"
                      placeholder="ENTER 6-DIGIT CODE"
                      className="w-full bg-white/10 border-2 border-[#f3961c]/50 rounded-2xl px-4 py-4 text-center tracking-widest uppercase font-mono text-2xl focus:outline-none focus:border-[#f3961c] transition-all"
                      maxLength={6}
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value)}
                      autoFocus
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => setMenuState("default")}
                        className="w-1/3 bg-white/5 hover:bg-white/10 border-2 border-white/10 rounded-2xl font-bold text-lg"
                      >
                        BACK
                      </button>
                      <button
                        onClick={handleJoinLobby}
                        className="w-2/3 bg-linear-to-r from-[#f3961c] to-[#d88210] rounded-2xl font-bold text-lg shadow-lg"
                      >
                        JOIN LOBBY
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW: LOBBY */}
        {view === "lobby" && (
          <div className="flex flex-col items-center justify-center text-center space-y-8 grow animate-fade-in">
            <div className="space-y-3">
              <h2 className="text-4xl font-bold text-white tracking-wide">
                WAITING LOBBY
              </h2>
              <div className="bg-black/40 px-8 py-4 rounded-2xl border-2 border-[#f3961c] inline-block shadow-[0_0_15px_rgba(243,150,28,0.3)]">
                <span className="text-gray-400 text-sm block mb-1 tracking-widest">
                  LOBBY CODE
                </span>
                <span className="text-5xl font-mono text-[#f3961c] font-black tracking-[0.2em]">
                  {roomCode}
                </span>
              </div>
            </div>

            {/* Players List */}
            <div className="w-full max-w-4xl bg-white/5 rounded-3xl p-8 min-h-[300px] border border-white/10">
              <div className="flex justify-between items-end border-b border-white/10 pb-4 mb-6">
                <h3 className="text-2xl text-gray-200 font-semibold flex items-center gap-2">
                  <i className="bx bxs-group"></i> Players
                </h3>
                <span className="text-sm bg-[#f3961c] text-white px-3 py-1 rounded-full font-bold shadow-md">
                  {players.length} / 8
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {players.map((p, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 bg-linear-to-br from-white/10 to-white/5 p-4 rounded-2xl border border-white/10 animate-fade-in"
                  >
                    <div className="bg-[#f3961c] w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
                      {p.display_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col items-start min-w-0">
                      <span className="font-bold text-white truncate w-full text-left">
                        {p.display_name}
                      </span>
                      {p.is_host === 1 && (
                        <span className="text-[10px] bg-[#f3961c]/80 px-1.5 rounded text-white font-bold tracking-wider">
                          HOST
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 w-full max-w-3xl mt-auto">
              <button
                onClick={leaveLobby}
                className="flex-1 bg-white/5 border border-white/20 hover:bg-red-500/20 hover:border-red-500/50 text-white py-4 rounded-2xl transition-all font-semibold"
              >
                LEAVE LOBBY
              </button>

              {/* Start game btn (visible only Host) */}
              {isHost && (
                <button
                  className="flex-2 bg-linear-to-r from-[#f3961c] to-[#d88210] hover:scale-[1.02] text-white font-bold py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 text-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={players.length < 1} // Test case 1 (should be 4)
                  onClick={() => alert("Start Game logic coming soon!")}
                >
                  <i className="bx bxs-game"></i> START GAME
                </button>
              )}

              {!isHost && (
                <div className="flex-2 bg-white/5 text-gray-400 py-4 rounded-2xl flex items-center justify-center gap-2 animate-pulse cursor-wait border border-white/10">
                  Waiting for host to start...
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW: GAME (Placeholder) */}
        {view === "game" && (
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-4xl">Game Started!</h1>
            {/* Later */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Riddle;

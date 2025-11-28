import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./styleInsider.css";

const Insider = () => {
  const [view, setView] = useState("menu"); // menu | lobby
  const [menuState, setMenuState] = useState("default"); // default | join
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [joinCode, setJoinCode] = useState("");

  // Create Lobby
  const handleCreateLobby = () => {
    if (!playerName) return alert("Please enter your name!");
    const mockCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(mockCode);
    setView("lobby");
  };

  // Join Lobby
  const handleJoinLobby = () => {
    if (!playerName) return alert("Please enter your name!");
    if (!joinCode) return alert("Please enter lobby code!");
    setRoomCode(joinCode.toUpperCase());
    setView("lobby");
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex justify-center items-center p-4">
      <div className="bg-black/40 backdrop-blur-md p-6 md:p-10 rounded-3xl border border-white/20 shadow-2xl w-full max-w-6xl animate-fade-in-up text-white relative flex flex-col min-h-[600px]">
        {/* Return btn (Top Left - Keep as fallback) */}
        <Link
          to="/games"
          className="absolute top-6 left-6 text-gray-300 hover:text-white transition-colors z-10"
        >
          <i className="bx bx-arrow-back text-2xl"></i>
        </Link>

        {/* --- MENU VIEW --- */}
        {view === "menu" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 h-full grow">
            {/* --- LEFT COLUMN: Rules --- */}
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
                      <strong className="text-amber-300">Master</strong>,{" "}
                      <strong className="text-red-400">Insider</strong>, or{" "}
                      <strong className="text-green-300">Commons</strong>.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="bx bxs-user-search text-[#f3961c] mt-1 shrink-0 text-xl"></i>
                    <span>
                      <strong className="text-white block mb-1 text-lg">
                        Who is who?
                      </strong>
                      Everyone knows the{" "}
                      <strong className="text-amber-300">Master</strong>, but
                      the <strong className="text-red-400">Insider</strong> is
                      secret.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="bx  bxs-message-bubble-question-mark text-[#f3961c] mt-1 shrink-0 text-xl"></i>
                    <span>
                      <strong className="text-white block mb-1 text-lg">
                        Find the Riddle
                      </strong>
                      The <strong className="text-amber-300">Master</strong>{" "}
                      answers "Yes/No".{" "}
                      <strong className="text-green-300">Everyone else</strong>{" "}
                      ask questions to find the secret word.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="bx bxs-mask text-[#f3961c] mt-1 shrink-0 text-xl"></i>
                    <span>
                      <strong className="text-white block mb-1 text-lg">
                        The Insider
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
                      After finding the word, vote for the Insider!
                      <ul className="list-disc list-inside mt-2 text-gray-300 space-y-1 ml-1">
                        <li>
                          Catch Insider:{" "}
                          <strong className="text-green-300">Commons</strong>{" "}
                          Win
                        </li>
                        <li>
                          Fail to catch:{" "}
                          <strong className="text-red-400">Insider</strong> Wins
                        </li>
                      </ul>
                      <p className="text-xs2 text-gray-400 mt-2 italic">
                        *If time runs out, everyone loses.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* --- RIGHT COLUMN: UI --- */}
            <div className="flex flex-col justify-center items-center text-center space-y-8 py-4">
              <div className="space-y-2">
                <h1 className="text-6xl md:text-7xl font-extrabold text-[#f3961c] drop-shadow-xl tracking-wider">
                  INSIDER
                </h1>
                <p className="text-gray-300 text-lg font-light">
                  Find the truth. Expose the liar.
                </p>
              </div>

              {/* Nickname Input */}
              <div className="w-full max-w-md space-y-2">
                <label className="block text-left text-sm font-light ml-2 text-gray-300">
                  YOUR NICKNAME
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter name..."
                    className="w-full bg-black/30 border-2 border-white/20 rounded-2xl px-6 py-4 text-white text-lg placeholder-gray-500 focus:outline-none focus:border-[#f3961c] focus:bg-black/50 transition-all shadow-lg"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                  />
                  <i className="bx bxs-user absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 text-xl"></i>
                </div>
              </div>

              <div className="w-full max-w-md border-t border-white/10"></div>

              {/* --- ACTION BUTTONS AREA --- */}
              <div className="w-full max-w-md grid grid-cols-1 gap-4 min-h-[140px]">
                {/* STATE: DEFAULT MENU */}
                {menuState === "default" && (
                  <div className="grid gap-4 animate-fade-in">
                    {/* Create Lobby */}
                    <button
                      onClick={handleCreateLobby}
                      className="group relative w-full bg-linear-to-r from-[#f3961c] to-[#d88210] hover:brightness-110 py-4 rounded-2xl font-bold text-xl shadow-lg transition-all transform hover:-translate-y-1 active:scale-95 overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        <i className="bx bxs-plus-square text-2xl"></i> CREATE
                        LOBBY
                      </span>
                      <div className="absolute inset-0 bg-[#f3961c] translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </button>

                    <div className="flex gap-3">
                      {/* Leave / Back Button */}
                      <Link
                        to="/games"
                        className="flex-1 bg-white/5 hover:bg-white/10 border-2 border-white/10 hover:border-red-400/50 hover:text-red-300 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 text-gray-400"
                      >
                        LEAVE
                      </Link>

                      {/* Join with Code Button */}
                      <button
                        onClick={() => setMenuState("join")}
                        className="flex-1 bg-white/5 hover:bg-white/10 border-2 border-white/10 hover:border-green-400/50 hover:text-green-300 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 text-gray-400"
                      >
                        JOIN WITH CODE <i className="bx bxs-key text-2xl"></i>
                      </button>
                    </div>
                  </div>
                )}

                

                {/* STATE: JOIN WITH CODE */}
                {menuState === "join" && (
                  <div className="grid gap-4 animate-fade-in">
                    {/* Code Input */}
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="ENTER LOBBY CODE"
                        className="w-full bg-white/10 border-2 border-[#f3961c]/50 rounded-2xl px-4 py-4 text-center tracking-widest uppercase font-mono text-xl placeholder-gray-500 focus:outline-none focus:border-[#f3961c] transition-all shadow-inner"
                        maxLength={6}
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)}
                        autoFocus
                      />
                    </div>

                    <div className="flex gap-3">
                      {/* Back to Menu Button */}
                      <button
                        onClick={() => setMenuState("default")}
                        className="w-1/3 bg-white/5 hover:bg-white/10 border-2 border-white/10 hover:border-white/30 rounded-2xl font-bold text-lg transition-all cursor-pointer flex items-center justify-center gap-2 text-gray-400 hover:text-white"
                      >
                        <i className="bx bx-undo text-xl"></i> BACK
                      </button>

                      {/* Confirm Join Button */}
                      <button
                        onClick={handleJoinLobby}
                        className="w-2/3 bg-linear-to-r from-[#f3961c] to-[#d88210] hover:brightness-110 border-2 border-transparent rounded-2xl font-bold text-lg transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg hover:-translate-y-1 active:scale-95"
                      >
                        JOIN LOBBY{" "}
                        <i className="bx bxs-right-arrow-circle text-xl"></i>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- LOBBY VIEW --- */}
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
                <span className="text-4xl font-mono text-[#f3961c] font-black tracking-[0.2em]">
                  {roomCode}
                </span>
              </div>
            </div>

            {/* Player List */}
            <div className="w-full max-w-3xl bg-white/5 rounded-3xl p-8 min-h-[250px] border border-white/10">
              <div className="flex justify-between items-end border-b border-white/10 pb-4 mb-6">
                <h3 className="text-2xl text-gray-200 font-semibold flex items-center gap-2">
                  <i className="bx bxs-group"></i> Players
                </h3>
                <span className="text-sm bg-[#f3961c] text-white px-3 py-1 rounded-full font-bold shadow-md">
                  1 / 8
                </span>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-3 bg-linear-to-br from-[#f3961c] to-[#b36b0e] px-6 py-3 rounded-2xl shadow-lg animate-fade-in border border-white/20">
                  <div>
                    <i className="bx bxs-user text-2xl text-white mt-1"></i>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-bold text-lg leading-tight">
                      {playerName}
                    </span>
                    <span className="text-[10px] bg-black/30 px-1.5 rounded text-white/80">
                      HOST (YOU)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex gap-4 w-full max-w-3xl mt-auto">
              <button
                onClick={() => setView("menu")}
                className="flex-1 bg-white-500/10 border-white/50 hover:bg-red-500/20 border hover:border-red-500/30 text-white hover:text-red-500/30 py-4 rounded-2xl transition-all cursor-pointer font-semibold hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]"
              >
                LEAVE LOBBY
              </button>
              <button className="flex-2 bg-linear-to-r from-[#f3961c] to-[#d88210] hover:scale-[1.02] text-white font-bold py-4 rounded-2xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-3 text-xl">
                <i className="bx bxs-game"></i> START GAME
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Insider;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./styleInsider.css";

const Insider = () => {
  const [view, setView] = useState("menu"); // menu | lobby
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [joinCode, setJoinCode] = useState("");

  // Create Game Lobby
  const handleCreateRoom = () => {
    if (!playerName) return alert("Please enter your name!");
    const mockCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(mockCode);
    setView("lobby");
  };

  // Join Game Lobby
  const handleJoinRoom = () => {
    if (!playerName) return alert("Please enter your name!");
    if (!joinCode) return alert("Please enter room code!");
    setRoomCode(joinCode.toUpperCase());
    setView("lobby");
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex justify-center items-center p-4">
      {/* Container */}
      <div className="bg-black/40 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-white/20 shadow-2xl w-full max-w-2xl animate-fade-in-up text-white relative">
        {/* Return btn */}
        <Link
          to="/games"
          className="absolute top-6 left-6 text-gray-300 hover:text-white transition-colors"
        >
          <i className="bx bx-arrow-back text-2xl"></i>
        </Link>

        {/* Menu View */}
        {view == "menu" && (
          <div className="flex flex-col items-center text-center space-y-6">
            <h1 className="text-5xl font-bold text-[#f3961c] drop-shadow-md tracking-wider">
              INSIDER
            </h1>

            {/* Rules */}
            <div className="bg-white/10 rounded-xl p-6 text-left w-full border border-white/10">
              <h3 className="text-xl font-semibold mb-3 text-[#ffd580] flex items-center gap-2">
                <i className="bx bxs-book-content"></i> Game Rules
              </h3>

              <ul className="text-sm md:text-base text-gray-200 space-y-2 list-disc list-inside font-light">
                {/* Rule 1 */}
                <li className="flex items-start gap-3">
                  <i className="bx bxs-user-badge text-[#f3961c] mt-1 shrink-0"></i>
                  <span>
                    ทุกคนจะได้รับบทบาท{" "}
                    <strong className="text-blue-400">GM</strong>,{" "}
                    <strong className="text-green-300">
                      ชาวบ้าน (Commons)
                    </strong>{" "}
                    หรือ <strong className="text-red-400">Insider</strong>
                  </span>
                </li>

                {/* Rule 2 */}
                <li className="flex items-start gap-3">
                  <i className="bx bxs-message-dots text-[#f3961c] mt-1 shrink-0"></i>
                  <span>
                    ผู้เล่นทุกคน (ยกเว้น{" "}
                    <strong className="text-blue-400">GM</strong>)
                    ต้องช่วยกันถามคำถาม{" "}
                    <strong className="text-green-300">ใช่</strong> หรือ{" "}
                    <strong className="text-red-400">ไม่ใช่</strong>{" "}
                    เพื่อหา{" "}
                    <strong className=" text-fuchsia-400">คำปริศนา (Riddle)</strong>
                  </span>
                </li>

                {/* Rule 3 */}
                <li className="flex items-start gap-3">
                  <i className="bx bxs-mask text-[#f3961c] mt-1 shrink-0"></i>
                  <span>
                    <strong className="text-red-400">Insider</strong> จะรู้คำตอบ
                    และต้องเนียนชักนำทุกคนให้ทายถูก โดยไม่ให้โดนจับได้
                  </span>
                </li>

                {/* Rule 4 (Win Condition) */}
                <li className="flex items-start gap-3">
                  <i className="bx bxs-trophy text-[#f3961c] mt-1 shrink-0"></i>
                  <span>
                    <strong className="text-white">เงื่อนไขชนะ:</strong> เมื่อเกมจบโหวตว่าใครคือ  <strong className="text-red-400">Insider!!</strong>
                    <ul className="list-disc list-inside pl-1 mt-1 text-gray-400 text-sm">
                      <li>ถ้าทายถูก: ชาวบ้านชนะ - Insider แพ้</li>
                      <li>ถ้าทายผิด: ชาวบ้านแพ้ - Insider ชนะ</li>
                    </ul>
                  </span>
                </li>
              </ul>
            </div>

            {/* Player Name */}
            <div className="w-full">
              <label className="block text-left text-sm font-light mb-1 ml-1 text-gray-300">
                Your Name
              </label>
              <input
                type="text"
                placeholder="Enter your nickname..."
                className="w-full bg-black/20 border border-white/30 rounded-full px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#f3961c] transition-all"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
              />
            </div>

            <div className="w-full border-t border-white/10 my-2"></div>

            {/* Create Join btn */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {/* Create */}
              <button
                onClick={handleCreateRoom}
                className="bg-linear-to-r from-[#f3961c] to-[#d88210] hover:scale-105 transition-transform py-3 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <i className="bx bxs-plus-square"></i> Create Room
              </button>

              {/* Join */}
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Room Code"
                    className="grow bg-white/10 border border-white/30 rounded-xl px-4 py-2 text-center tracking-widest uppercase placeholder-gray-400 focus:outline-none"
                    maxLength={6}
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                  />
                  <button
                    onClick={handleJoinRoom}
                    className="bg-white/20 hover:bg-white/30 px-4 rounded-xl transition-colors font-semibold cursor-pointer"
                  >
                    JOIN
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lobby View */}
        {view === "lobby" && (
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white" Lobby></h2>
              <div className="bg-black/30 px-6 py-2 rounded-lg border border-[#f3961c]/50 inline-block">
                <span className="text-gray-400 text-sm mr-2">ROOM CODE:</span>
                <span className="text-2xl font-mono text-[#f3961c] tracking-widest font-bold">
                  {roomCode}
                </span>
              </div>
            </div>

            {/* Playerlist */}
            <div className="w-full bg-white/5 rounded-2xl p-6 min-h-[200px]">
              <h3 className="text-left text-gray-300 mb-4 border-b border-white/10 pb-2">
                Players{" "}
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full ml-2">
                  1/8
                </span>
              </h3>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-[#f3961c]/80 px-4 py-2 rounded-full shadow-md animate-fade-in">
                  <i className="bx bxs-user-circle text-xl"></i>
                  <span className="font-medium">{playerName}</span>
                  <span className="text-xs bg-black/20 px-1.5 rounded ml-1">
                    YOU
                  </span>
                </div>

                {/* Placeholder for other players */}
                {/* <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-gray-300">
                  <i className='bx bx-user-circle text-xl'></i>
                  <span>Waiting...</span>
                </div> */}
              </div>
            </div>

            {/* Start / Leave btn */}
            <div className="flex gap-4 w-full">
              <button
                onClick={() => setView("menu")}
                className="flex-1 bg-red-500/20 hover:bg-red-500/40 text-red-200 py-3 rounded-full transition-colors cursor-pointer"
              >
                Leave Rooom
              </button>
              <button className="flex-2 bg-[#f3961c] hover:bg-[#d88210] hover:scale-105 text-white font-bold py-3 rounded-full shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2">
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

import React from "react";
import { Link } from "react-router-dom";

import "./styleGamesMain.css";

import cozyCat from "../../assets/the-riddle-cov.png";
import cozyTown from "../../assets/cozy-town.jpg";

const GamesMain = () => {
  const games = [
    {
      id: 1,
      title: "The Riddle",
      desc: "Someone is controlling the conversation. Can you find them?",
      image: cozyCat,
      link: "/games/riddle",
      active: true,
    },
    {
      id: 2,
      title: "Coming Soon",
      desc: "...",
      image: cozyTown,
      link: "#",
      active: false,
    },
    {
      id: 3,
      title: "Coming Soon",
      desc: "...",
      image: null,
      link: "#",
      active: false,
    },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-white mb-8 drop-shadow-md bg-black/20 px-6 py-2 rounded-full backdrop-blur-sm">
        Game Station
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {games.map((game) => (
          <div
            key={game.id}
            className={`
            relative overflow-hidden rounded-3xl 
            bg-white/10 backdrop-blur-md border border-white/20 shadow-xl
            transition-all duration-300 group
            ${
              game.active
                ? "hover:scale-105 hover:bg-white/20"
                : "opacity-85 grayscale-25"
            }
            }
          `}
          >
            {/* Link for Active game */}
            {game.active ? (
              <Link to={game.link} className="block h-full">
                <GameCardContent game={game} />
              </Link>
            ) : (
              <div className="h-full">
                <GameCardContent game={game} />
                {/* Overlay for coming soon */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white/80 font-bold text-xl tracking-widest uppercase border-2 border-white/50 px-4 py-1 rounded-lg transform -rotate-12">
                    Soon
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const GameCardContent = ({ game }) => (
  <div className="flex flex-col h-full">
    <div className="h-48 overflow-hidden relative">
      {game.image ? (
        <img
          src={game.image}
          alt={game.title}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            game.active ? "group-hover:scale-110" : ""
          }`}
        />
      ) : (
        <div className="w-full h-full bg-gray-700/50 flex items-center justify-center">
          <i className="bx bxs-invader text-6xl text-white/20"></i>
        </div>
      )}
      <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
    </div>

    <div className="p-6 grow flex flex-col text-white">
      <h2 className="text-2xl font-bold mb-2 group-hover:text-amber-100 transition-colors">
        {game.title}
      </h2>
      <p className="text-sm text-gray-200 font-light">{game.desc}</p>
    </div>
  </div>
);

export default GamesMain;

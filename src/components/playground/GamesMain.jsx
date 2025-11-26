import React from 'react';
import { Link } from 'react-router-dom';

import './styleGamesMain.css';

const GamesMain = () => {
  return (
    <div className="min-h-screen p-10 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-(--primary-color) mb-10">
        Playground
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/games/insider" className="game-card block p-6 bg-(--sunlit-clay-100) rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300">
          <h2 className="text-2xl font-bold text-(--primary-color) mb-2">Insider (TH)</h2>
          <p className="text-(--dark-color)">Insider (Th)</p>
          <div className="mt-4 px-4 py-2 bg-(--secondary-color) text-white rounded-full text-center inline-block">
            Play Now
          </div>
        </Link>

        {/* for more Games */}

      </div>
    </div>
  )
}

export default GamesMain
import React from 'react'
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center items-center text-center px-4">
      <div className="bg-black/30 backdrop-blur-sm p-10 rounded-3xl border border-white/20 shadow-lg max-w-2xl animate-fade-in-up">
        
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-md">
          Cozy Club
        </h1>
        
        <p className="text-lg md:text-2xl text-gray-100 mb-8 font-light leading-relaxed">
          Relax, Listen to Lofi, and Play Games with Friends.<br/>
        </p>

        {/* ปุ่มกดไปหน้าเกม */}
        <Link to="/games">
          <button className="bg-[#f3961c] hover:bg-[#d88210] text-white font-semibold py-3 px-8 rounded-full text-xl transition-all duration-300 transform hover:scale-105 shadow-md">
            Start Playing <i className='bx bxs-game ml-2'></i>
          </button>
        </Link>

      </div>
    </div>
  )
}

export default Hero
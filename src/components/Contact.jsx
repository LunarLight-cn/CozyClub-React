import React from "react";

const Contact = () => {

  return (
    <div className="flex justify-center my-20 mx-32 min-h-150 bg-[#e1c8b7]/85 rounded-4xl">
      <div className="w-full flex flex-col p-8">
        <div className="text-4xl font-bold text-gray-800 p-3">Contact Me</div>
        <div className="grow flex flex-col items-center justify-center gap-6 text-gray-700 text-xl">
          <div className="flex flex-col items-center gap-2">
            <span className="font-semibold">Email</span>
            <a href="mailto:lunarlight.cn@gmail.com" className="hover:text-gray-900 hover:underline transition-colors">
              lunarlight.cn@gmail.com
            </a>
          </div>

          <div className="flex flex-col items-center gap-2">
            <span className="font-semibold">GitHub Profile</span>
            <a href="https://github.com/LunarLight-cn" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 hover:underline transition-colors">
              github.com/LunarLight-cn
            </a>
          </div>

          <div className="flex flex-col items-center gap-2">
            <span className="font-semibold">Project Repository</span>
            <a href="https://github.com/LunarLight-cn/CozyClub-React" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 hover:underline transition-colors">
              github.com/LunarLight-cn/CozyClub-React
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

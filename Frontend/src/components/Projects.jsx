import React from "react";
import { Clock, Rocket } from "lucide-react"; 

function Projects() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center bg-gradient-to-br from-gray-50 to-gray-100 px-6">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-lg w-full border border-gray-200">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-indigo-100 rounded-full">
            <Rocket className="w-10 h-10 text-indigo-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          🚧 Projects Module Coming Soon
        </h1>
        <p className="text-gray-600 mb-6">
          We’re building something amazing here on <span className="font-semibold text-indigo-600">UpChain</span>.  
          Stay tuned while we prepare the <span className="font-semibold">Projects</span> feature for you.  
        </p>
        <div className="flex items-center justify-center text-gray-500 text-sm gap-2">
          <Clock className="w-4 h-4" />
          <span>Launching in future updates</span>
        </div>
      </div>
    </div>
  );
}

export default Projects;

import React, { useState, useEffect } from "react";
import { Clock, Rocket, PlusCircle } from "lucide-react";
import CreateProject from "./CreateProject";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    // later replace with API call
    setProjects([]);
  }, []);

  if (showCreateForm) {
    return <CreateProject onClose={() => setShowCreateForm(false)} />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center bg-gradient-to-br from-gray-50 to-gray-100 px-6">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-lg w-full border border-gray-200">
        {projects.length === 0 ? (
          <>
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-indigo-100 rounded-full">
                <Rocket className="w-10 h-10 text-indigo-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              🚧 No Projects Yet
            </h1>
            <p className="text-gray-600 mb-6">
              Be the first one to <span className="font-semibold text-indigo-600">contribute</span> to the society.  
              Share your project and inspire others!
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition"
            >
              <PlusCircle className="w-5 h-5" />
              Create Your Project
            </button>
          </>
        ) : (
          <>
            {/* Placeholder: later map projects into cards */}
            <div className="mb-6 text-gray-700">
              Projects will be displayed here as cards.
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition"
            >
              <PlusCircle className="w-5 h-5" />
              Create Your Project
            </button>
          </>
        )}
        <div className="flex items-center justify-center text-gray-500 text-sm gap-2 mt-6">
          <Clock className="w-4 h-4" />
          <span>Keep contributing to build the community</span>
        </div>
      </div>
    </div>
  );
}

export default Projects;

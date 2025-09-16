import React, { useState, useEffect } from "react";
import { Clock, Rocket, PlusCircle } from "lucide-react";
import CreateProject from "./CreateProject";
import useGetAllProject from "../Hooks/getProject.jsx";
import { useSelector } from "react-redux";

function Projects() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  useGetAllProject();
  const { projects } = useSelector((store) => store.project);

 

  if (showCreateForm) {
    return <CreateProject onClose={() => setShowCreateForm(false)} />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center bg-gradient-to-br from-gray-50 to-gray-100 px-6">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-3xl w-full border border-gray-200">
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
              Be the first one to{" "}
              <span className="font-semibold text-indigo-600">contribute</span>{" "}
              to the society. Share your project and inspire others!
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
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              🚀 Community Projects
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {projects.map((project, index) => (
                <div
                  key={index}
                  className="p-5 border border-gray-200 rounded-xl shadow hover:shadow-md transition bg-gray-50 text-left"
                >
                  <h2 className="text-lg font-semibold text-indigo-700 mb-2">
                    {project.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-3">
                    {project.description || "No description available."}
                  </p>
                  <p className="text-xs text-gray-500">
                    👤 By {project.owner || "Anonymous"}
                  </p>
                </div>
              ))}
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

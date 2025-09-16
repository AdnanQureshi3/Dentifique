import React, { useState } from "react";
import { X } from "lucide-react";

// Huge list of tools (just a sample, you can extend it)
const allTools = [
  "React",
  "Next.js",
  "Node.js",
  "NestJS",
  "Express",
  "MongoDB",
  "PostgreSQL",
  "TailwindCSS",
  "TypeScript",
  "Redux",
  "GraphQL",
  "Docker",
  "Kubernetes",
  "AWS",
  "Firebase",
  "Vite",
  "Bun",
  "Angular",
  "Vue.js",
];

function ToolsSelector({ selectedTools, setSelectedTools }) {
  const [query, setQuery] = useState("");


  // Filter tools based on query & exclude already selected ones
  const filteredTools = allTools.filter(
    (tool) =>
      tool.toLowerCase().includes(query.toLowerCase()) &&
      !selectedTools.includes(tool)
  );

  const addTool = (tool) => {
    setSelectedTools([...selectedTools, tool]);
    setQuery(""); // clear search box
  };

  const removeTool = (tool) => {
    setSelectedTools(selectedTools.filter((t) => t !== tool));
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Input */}
      <input
        type="text"
        placeholder="Search and add tools..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
      />

      {/* Suggestions dropdown */}
      {query && filteredTools.length > 0 && (
        <ul className="border border-gray-300 rounded-lg mt-2 max-h-40 overflow-y-auto bg-white shadow">
          {filteredTools.map((tool) => (
            <li
              key={tool}
              onClick={() => addTool(tool)}
              className="px-3 py-2 cursor-pointer hover:bg-indigo-100 text-left"
            >
              {tool}
            </li>
          ))}
        </ul>
      )}

      {/* Selected tools */}
      <div className="flex flex-wrap gap-2 mt-4">
        {selectedTools.map((tool) => (
          <span
            key={tool}
            className="flex items-center gap-1 bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium"
          >
            {tool}
            <button
              onClick={() => removeTool(tool)}
              className="hover:text-red-600"
            >
              <X size={14} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

export default ToolsSelector;

import React, { useEffect, useState } from "react";
import { X, UploadCloud } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

function CreateProject({ onClose }) {
  const [formData, setFormData] = useState({
 
    title: "",
    description: "",
    repoLink: "",
    domain: "",
    demoLink: "",
    liveLink: "",
    thumbnail: null,
  });
  const [preview, setPreview] = useState(null);
  const [titleError, setTitleError] = useState({error:false , msg:"No title exist already"});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleUniqueTitleCheck = async () => {
    try {
        // console.log("response.da");
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/projects/check-unique-title`,
            { title: formData.title },
            { withCredentials: true }
        );
        console.log(response.data);
      if (response.data.success) {
        setTitleError({error:false , msg:""});
      }
      else{
        setTitleError({error:true , msg:"Try different title"});
      }
    } catch (error) {
      setTitleError({error:true , msg:"Try different title"});
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, thumbnail: file });
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) data.append(key, formData[key]);
      });

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/projects/addproject`,
        data,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.success) {
        toast.success("Project created successfully!");
        onClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "Something went wrong");
    }
  }
  useEffect(()=>{
    if(formData.title.length >0){
      handleUniqueTitleCheck();
    }
    // console.log(titleError , formData.title)

  }, [formData.title])

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] bg-gray-50 px-10">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-5xl border border-gray-200 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-7 h-7" />
        </button>

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          🚀 Share Your Project
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          {/* Left side */}
          <div className="space-y-4">
            
            <input
              type="text"
              name="title"
              placeholder="Project Title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            {formData.title.length > 0 && (
  <div className="flex items-center space-x-2 text-sm">
    <span className={`w-3 h-3 rounded-full ${
      titleError.error ? 'bg-red-500' : 'bg-green-500'
    }`}></span>
    <p className={titleError.error ? 'text-red-600' : 'text-green-600'}>
      {titleError.msg || (titleError.error ? "Title already exists" : "Title is available")}
    </p>
  </div>
)}

            <textarea
              name="description"
              placeholder="Project Description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="5"
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Right side */}
          <div className="space-y-4">
            <input
              type="url"
              name="repoLink"
              placeholder="Repository Link (GitHub)"
              value={formData.repoLink}
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <input
              type="text"
              name="domain"
              placeholder="Domain (e.g., Web Dev, AI, Blockchain)"
              value={formData.domain}
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <input
              type="url"
              name="demoLink"
              placeholder="Demo Link (optional)"
              value={formData.demoLink}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <input
              type="url"
              name="liveLink"
              placeholder="Live Link (optional)"
              value={formData.liveLink}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />

            {/* Thumbnail Upload with Preview */}
            <div className="flex flex-col items-center justify-center gap-3 border border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition">
              {preview ? (
                <img
                  src={preview}
                  alt="Thumbnail Preview"
                  className="h-32 w-full object-cover rounded-md border"
                />
              ) : (
                <UploadCloud className="w-10 h-10 text-indigo-600" />
              )}
              <label className="text-gray-700 cursor-pointer">
                <span className="text-sm">
                  {formData.thumbnail
                    ? formData.thumbnail.name
                    : "Upload Thumbnail (optional)"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Submit button full width */}
          <div className="col-span-2">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition text-lg font-semibold"
            >
              Submit Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProject;

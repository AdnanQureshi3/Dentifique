import { setProjects } from "../redux/projectSlice.js";
import axios from "axios";
import { useEffect , useState } from "react";
import { useDispatch } from "react-redux";

// Hook
const useGetAllProject = ({ page, limit, title }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAllProject = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/project/all`,
          { params: { page, limit, title }, withCredentials: true }
        );
        if (res.data.success) dispatch(setProjects(res.data.projects));
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProject();
  }, [dispatch, page, limit, title]); // runs again if page/filter changes

  return { loading };
};

export default useGetAllProject;

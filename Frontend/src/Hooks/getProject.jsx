import { setProjects } from "../redux/projectSlice.js";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllProject =()=>{
    const dispatch = useDispatch();
    useEffect(()=>{
        const fetchAllProject = async()=>{
            try{
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/project/all` ,{withCredentials:true} );
                console.log("fetching all the projects");
                console.log(res.data);
                if(res.data.success){
                    dispatch(setProjects(res.data.projects));
                }
            }
            
            catch(err){
                console.log(err);
            }
        }
   
        fetchAllProject();
      

    },[])
};
export default useGetAllProject;

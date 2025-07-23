import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom';

function Protected_routes({children}) {
    const {user} = useSelector(store => store.auth);
    const navigate = useNavigate();

        if(!user){
           return <Navigate to="/login" replace />;
        }
  
 return (
  <>{children}</>
);

}

export default Protected_routes
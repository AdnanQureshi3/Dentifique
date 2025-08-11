import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import LeftSidebar from './LeftSidebar';

function Mainlayout() {
  const [collapsed, setCollapsed] = useState(false);
  

  return (
    <div className="flex">
      <LeftSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div
        className={`flex-1 transition-all duration-300`}
        style={{
          marginLeft: collapsed ? '100px' : '250px' // adjust with your collapsed width
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default Mainlayout;

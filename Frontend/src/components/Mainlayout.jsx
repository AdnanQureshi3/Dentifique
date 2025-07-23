import React from 'react'
import {Outlet} from 'react-router-dom'
import LeftSidebar from './LeftSidebar'

function Mainlayout() {
  return (
    <div className='flex ml-[250px]'>
    <LeftSidebar/>
    <Outlet/>
    </div>

  )
}

export default Mainlayout
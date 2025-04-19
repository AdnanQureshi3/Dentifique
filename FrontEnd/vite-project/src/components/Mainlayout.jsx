import React from 'react'
import {Outlet} from 'react-router-dom'
import LeftSidebar from './LeftSidebar'

function Mainlayout() {
  return (
    <div className='flex '>
    <LeftSidebar/>
    <Outlet/>
    </div>

  )
}

export default Mainlayout
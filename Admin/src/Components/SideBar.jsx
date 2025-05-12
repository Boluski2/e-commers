import React from 'react'
import {NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const SideBar = () => {
  return (
    <div className='w-[18%] min-h-screen border-r-2'>
      <div className='flex flex-col gap-4 pt-6 p1-[20%] text-[15px]'>

            <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1' to='/add'>
                <img src={assets.add_icon} 
                className='w-5 h-5'
                alt="" />
                <p className='hidden md:block'>Add Item</p>
            </NavLink>


            <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1' to='/list'>
                <img src={assets.order_icon} 
                className='w-5 h-5'
                alt="" />
                <p className='hidden md:block'>List items</p>
            </NavLink>

            
            <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1' to='/orders'>
                <img src={assets.order_icon} 
                className='w-5 h-5'
                alt="" />
                <p className='hidden md:block'>Orders</p>
            </NavLink>
      </div>
    </div>
  )
}

export default SideBar

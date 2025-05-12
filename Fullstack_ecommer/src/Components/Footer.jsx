import React from 'react'
import {assets} from '../assets/assets'
import {Link} from 'react-router-dom'


const Footer = () => {
  return (
    <div className=''>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
       
        <div>
       <Link to='/'>
       <img src={assets.logo} className='mb-5 w-32' alt="logo" />
       <p className='w-full md:w-2/3 text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores, optio.</p>
       </Link> 
        </div>



    <div>
        <p className='text-xl font-medium mb-5'>COMPANY</p>
        <ul className='flex flex-col gap-1 text-gray-500'>
            <li className='cursor-pointer'>Home</li>
            <li className='cursor-pointer'>About us</li>
            <li className='cursor-pointer'>Delivery</li>
            <li className='cursor-pointer'>Privacy Policy</li>
        </ul>
    </div>


        <div>
                <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-1 text-gray-500'>
                    <li className='cursor-pointer'>+2348140830241</li>
                    <li className='cursor-pointer'>info@gmail.com</li>
                </ul>
        </div>

      </div>

      <div>
        <hr />
        <p className='py-5 text-sm text-center'>
        © {new Date().getFullYear()} FOREVER. All right reserved
        </p>
      </div>
    </div>
  )
}

export default Footer

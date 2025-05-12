import React from 'react'
import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Cart from './pages/Cart'
import Contact from './pages/Contact'
import Collection from './pages/Collection'
import Orders from './pages/Orders'
import Product from './pages/Product'
import PlaceOrder from './pages/PlaceOrder'
import Login from './pages/Login'
import NavBar from './Components/NavBar'
import Footer from './Components/Footer'
import SearchBar from './Components/SearchBar'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from './pages/Verify'

const App = () => {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <ToastContainer/>
      <NavBar />
      <SearchBar/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/place-order' element={<PlaceOrder />} />
        <Route path='/collection' element={<Collection />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/login' element={<Login />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/verify' element={<Verify />} />
      </Routes>
      <Footer/>

    </div>
  )
}

export default App

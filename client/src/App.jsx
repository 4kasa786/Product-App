import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import ScrollToTop from './Components/ScrollToTop'
import Header from './Components/Header'
import SignUp from './Pages/SignUp'
import SignIn from './Pages/SignIn'
import FooterComponent from './Components/FooterComponent'
import Home from './Pages/Home'
import ProductForm from './Pages/CreateProduct'
import ProductUpdateForm from './Pages/UpdateProduct'
import PrivateRoute from './Components/PrivateRoute'
import ProductDetailPage from './Pages/ProductDetailPage'
import { ToastContainer } from 'react-toastify'; // ADD THIS
import 'react-toastify/dist/ReactToastify.css';
import SearchResults from './Pages/SearchResults'


function App() {


  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/sign-up' element={<SignUp />}></Route>
        <Route path='/sign-in' element={<SignIn />}></Route>
        <Route path='/search' element={<SearchResults />} />
        <Route path="/products/:productId" element={<ProductDetailPage />} />
        <Route element={<PrivateRoute />} >
          <Route path='/create-product' element={<ProductForm />}></Route>
          <Route path='/update-product/:productId' element={<ProductUpdateForm />}></Route>
        </Route>
      </Routes>
      <FooterComponent />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </BrowserRouter>
  )
}

export default App

import React from 'react'
import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home.jsx'
import CreateBrands from './pages/CreateBrands'
import DeleteBrand from './pages/DeleteBrand.jsx'
import ShowBrand from './pages/ShowBrand'
import EditBrand from './pages/EditBrand.jsx'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/brands/create' element={<CreateBrands/>} />
      <Route path='/brands/details/:id' element={<ShowBrand/>} />
      <Route path='/brands/edit/:id' element={<EditBrand/>} />
      <Route path='/brands/delete/:id' element={<DeleteBrand/>} />
    </Routes>
  )
}

export default App
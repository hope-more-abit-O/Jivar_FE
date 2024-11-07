import React from 'react'
import { Routes, Route } from 'react-router-dom'
import JivarHome from './components/home/jivar-home'
import SignIn from './components/authentication/sign-in'


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<JivarHome />} />
      <Route path="/authentication/sign-in" element={<SignIn />} />
    </Routes>
  )
}

export default AppRoutes
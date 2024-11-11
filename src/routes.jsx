import React from 'react'
import { Routes, Route } from 'react-router-dom'
import JivarHome from './components/home/jivar-home'
import SignIn from './components/authentication/sign-in'
import SignUp from './components/authentication/sign-up'
import YourWork from './components/your-work'
import JivarCreateProject from './components/create-project'
import KanbanProject from './components/kanban/projects'


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<JivarHome />} />
      <Route path="/authentication/sign-in" element={<SignIn />} />
      <Route path="/authentication/sign-up" element={<SignUp />} />
      <Route path="/jivar/your-work" element={<YourWork />} />
      <Route path="/jivar/create-project" element={<JivarCreateProject />} />
      <Route path="/jivar/projects/1/board" element={<KanbanProject />} />
    </Routes>
  )
}

export default AppRoutes
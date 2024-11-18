import React from 'react'
import { Routes, Route } from 'react-router-dom'
import JivarHome from './components/home/jivar-home'
import SignIn from './components/authentication/sign-in'
import SignUp from './components/authentication/sign-up'
import YourWork from './components/your-work'
import JivarCreateProject from './components/create-project'
import KanbanProject from './components/kanban/projects'
import ManageProfile from './components/manage-profile'
import ViewAllProjects from './components/view-all-projects'


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<JivarHome />} />
      <Route path="/authentication/sign-in" element={<SignIn />} />
      <Route path="/authentication/sign-up" element={<SignUp />} />
      <Route path="/jivar/your-work" element={<YourWork />} />
      <Route path="/jivar/create-project" element={<JivarCreateProject />} />
      <Route path="/jivar/project/:projectId/board" element={<KanbanProject />} />
      <Route path="/jivar/manage-profile" element={<ManageProfile />} />
      <Route path="/jivar/projects" element={<ViewAllProjects />} />
    </Routes>
  )
}

export default AppRoutes
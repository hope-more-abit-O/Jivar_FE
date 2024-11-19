import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import AppRoutes from './routes'
import setupAxiosInterceptors from './api/setupAxiosInterceptors';

function App() {

  const [notification, setNotification] = useState("");

  setupAxiosInterceptors(setNotification);

  return (
    <div>
      <AppRoutes />
      {notification && <Notification message={notification} />}
    </div>
  )
}

export default App
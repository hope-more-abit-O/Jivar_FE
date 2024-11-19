import React from 'react'
import { Link } from 'react-router-dom'
import AppRoutes from './routes'

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
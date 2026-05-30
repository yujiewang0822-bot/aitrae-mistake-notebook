import { RouterProvider } from 'react-router-dom'
import router from './routes/router'
import DeviceFrame from './components/layout/DeviceFrame'

function App() {
  return <DeviceFrame><RouterProvider router={router} /></DeviceFrame>
}

export default App

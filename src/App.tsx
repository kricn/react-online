import './App.css';
import RouterGuard from './components/RouterGuard';
import AllRoutes from './components/RouterGuard/routers';

function App() {
  return (
    <RouterGuard>
      <AllRoutes />
    </RouterGuard>
  )
}

export default App

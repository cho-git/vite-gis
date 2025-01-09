import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateRoute from './routes/PrivateRoute';
import { MainPage } from './pages/MainPage';
import { Login } from './pages/Login';
import './App.css'

function App() {

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<MainPage />} />
          </Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App
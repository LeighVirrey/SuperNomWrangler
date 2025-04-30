import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './component/home/home'
import Map from './component/map/map'
import Profile from './component/profile/profile'
import Login from './component/login/login'
import Nav from './component/nav/nav'




function App() {
  return (
    <Router>
      <div>
        <Nav/>

        {/* Define Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<Map />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

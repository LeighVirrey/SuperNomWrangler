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
        {/* <nav>
          <div className='nav'>
            <Link to="/">
            <img alt='logo' className='logo' src='../images/nomWrangler2.png'></img>
            </Link>
            <div className='buttons'>
              <Link to="/">
                <button className="navbutton">HOME</button>
              </Link>
              <Link to="/map">
                <button className="navbutton">MAP</button>
              </Link>
              <Link to="/profile">
                <button className="navbutton">PROFILE</button>
              </Link>
              <Link to="/login">
                <button className="navbutton">LOGIN</button>
              </Link>
            </div>
          </div>
        </nav> */}

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

import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './component/home/home'
// import Map from './component/map/map'
import Profile from './component/profile/profile'
import EditProfile from './component/editProfile/editProfile';
import Login from './component/login/login'
import Nav from './component/nav/nav'
import About from './component/about/about'
import Review from './component/userReview/UserReview'
import RestaurantList from './component/restaurantList/restaurantList';
import Details from './component/restaurantDetails/RestaurantDetails'
import Register from './component/register/register'



function App() {
  return (
    <Router>
      <div>
        <Nav/>

        {/* Define Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/map" element={<Map />} /> */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/restaurantList" element={< RestaurantList />} />
          <Route path="/review" element={<Review />} />
          <Route path="/register" element={<Register />} />
          <Route path="/editProfile" element={<EditProfile />} />
          <Route path="/user/:id" element={<Profile />} />
          { <Route path="/restaurantDetails/:id" element={<Details />} /> }
        </Routes>
      </div>
    </Router>
  );
}

export default App;

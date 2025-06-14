import React from 'react'
import { Link } from 'react-router-dom'

export const nav = () => {
  return (
    <nav>
      <div className='nav'>
        <Link to="/">
          <img alt='logo' className='logo' src='../images/nomWrangler2.png'></img>
        </Link>
        <div className='buttons'>
          <Link to="/">
            <button className="navbutton">HOME</button>
          </Link>
          {/* <Link to="/map">
            <button className="navbutton">MAP</button>
          </Link> */}
          <Link to="/profile">
            <button className="navbutton">PROFILE</button>
          </Link>
          <Link to="/login">
            <button className="navbutton">LOGIN</button>
          </Link>
          <Link to="/restaurantList">
            <button className="navbutton">RESTAURANT LIST</button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
export default nav;
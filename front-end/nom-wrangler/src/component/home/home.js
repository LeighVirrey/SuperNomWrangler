import React from 'react'
import './home.css'

const Home = () => {
  return (
    <div className='home'>
      <h1 className='mainheader'> FEATURED </h1>

      <div className='restO'>
        <div className='singleRest'>
          <img className='restImg' src='../images/11steakhouse.jpg' />
          <div className='restDetails'>
            <h1>Lucky J Steakhouse & Arena</h1>
            <h2 className='restAddress'>11664 Fir Rd, Carthage, MO 64836</h2>
            <p>Lucky J Steakhouse & Arena opened its doors in November 2001...</p>
          </div>
        </div>
      </div>

      <br></br>
      <div className='restB'>
        <div className='singleRest'>
          <div className='restDetails'>
            <h1 >Lucky J Steakhouse & Arena</h1>
            <h2 className='restAddress'>11664 Fir Rd, Carthage, MO 64836</h2>
            <p> Lucky J Steakhouse & Arena opened its doors in November 2001 in Carthage, Missouri, and has since become one of the most popular local restaurants as well as the premier equine arena in the four-state area. As our slogan says, whether you’re looking for great food or good times, Lucky J is the place to be! </p>
          </div>
          <img className='restImg' src='../images/11steakhouse.jpg'></img>
        </div>
      </div>
      <div>
        <button className='BlueButton'>FIND MORE RESTAURANTS</button>
      </div>
      <h1 className='mainheader'> TOP REVIEWERS </h1>

      
    </div>
  )
}

export default Home;
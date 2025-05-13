import React from 'react'
import './about.css'

const About = () => {
  return (
    <div>
      <div className='aboutContainer'>
        <img className='aboutSteak box-shadow' src='../images/steak.jpg' alt="about" />
        <h1 className='aboutHeader'>SUPER NOM WRANGLER</h1>
        <h2 className='aboutSub'> Super Nom Wrangler is a community-driven food finder app that helps users discover and share hidden gem eateries—like hole-in-the-wall diners, family-run joints, and off-the-grid food trucks—that often get overlooked on mainstream platforms like Google Maps. It's built for adventurous eaters looking to wrangle the best local flavors wherever they roam.</h2>

      </div>
      <div className='aboutTeam'>
        <div className='flex'>
          <img className='box-shadow pfpleft' src='../images/chelsea.jfif' alt="chelsea" />
          <div className='detailsleft'>
            <h1 className='name'>Chelsea Bui</h1>
            <h2> CHELSEA UPDATE THIS</h2>
          </div>
        </div>

        <div className='flex'>
          <div className='detailsright'>
            <h1 className='name'>Johanna Johnson</h1>
            <h2> Johanna UPDATE THIS</h2>
          </div>
          <img className='box-shadow pfpright' src='../images/johanna.jfif' alt="johanna" />
        </div>

        <div className='flex'>
          <img className='box-shadow pfpleft' src='../images/erin.jpg' alt="erin" />
          <div className='detailsleft'>
            <h1 className='name'>Erin Mitchell</h1>
            <h2> ERIN UPDATE THIS</h2>
          </div>
        </div>

        <div className='flex'>
          <div className='detailslauren'>
            <h1 className='name'>Lauren Unruh</h1>
            <h2> LAUREN UPDATE THIS</h2>
          </div>
          <img className='box-shadow pfpright' src='../images/lauren.jpg' alt="lauren" />
        </div>

        <div className='flex'>
          <img className='box-shadow pfpleft' src='../images/kristin.jpg' alt="kristin" />
          <div className='detailsleft'>
            <h1 className='name'>Kristin Kingston</h1>
            <h2> KRISTIN UPDATE THIS</h2>
          </div>
        </div>

        <div className='flex'>
          <div className='detailsstokes'>
            <h1 className='name'>Alexander Stokes</h1>
            <h2> ALEXANDER UPDATE THIS</h2>
          </div>
          <img className='box-shadow pfpright' src='../images/alexander.png' alt="alexander" />
        </div>

        <div className='flex'>
          <img className='box-shadow pfpleft' src='../images/cal.jpg' alt="cal" />
          <div className='detailsleft'>
            <h1 className='name'>Calvin Bryant</h1>
            <h2> CALVIN UPDATE THIS</h2>
          </div>
        </div>

        <div className='flex'>
          <div className='detailszk'>
            <h1 className='name'>ZK Virrey</h1>
            <h2> ZK UPDATE THIS</h2>
          </div>
          <img className='box-shadow pfpright' src='../images/zk.png' alt="alexander" />
        </div>

      </div>
      <div>
      </div>
    </div>
  )
}

export default About
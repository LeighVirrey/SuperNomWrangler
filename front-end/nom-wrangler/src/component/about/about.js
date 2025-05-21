import React from 'react'
import './about.css'

const About = () => {
  function testFetch(){
    console.log('posting data...');
    fetch('http://localhost:4000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'John Doe',
        email: 'testerserser@adasd',
        password: 'password'
      })
    })
    .then(response => console.log('Response:', response))
    .catch(error => {
      console.error('Error:', error);
    });
  }
  return (
    <div>
        <div className='aboutContainer'>
            <img className='aboutSteak box-shadow' src='../images/steak.jpg' alt="about" />
            <h1 className='aboutHeader'>SUPER NOM WRANGLER</h1>
          <h2 className='aboutSub'> Super Nom Wrangler is a community-driven food finder app that helps users discover and share hidden gem eateries—like hole-in-the-wall diners, family-run joints, and off-the-grid food trucks—that often get overlooked on mainstream platforms like Google Maps. It's built for adventurous eaters looking to wrangle the best local flavors wherever they roam.</h2>
          <button onClick={testFetch}>Test Fetch</button>
        </div>
    </div>
  )
}

export default About
import React, { useEffect } from 'react';
import './home.css';
import { Link } from 'react-router-dom';

const Home = () => {
  useEffect(() => {
    const button = document.getElementById('backToTop');

    const handleScroll = () => {
      if (window.scrollY > 300) {
        button.style.display = 'block';
      } else {
        button.style.display = 'none';
      }
    };

    const handleClick = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('scroll', handleScroll);
    if (button) {
      button.addEventListener('click', handleClick);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (button) {
        button.removeEventListener('click', handleClick);
      }
    };
  }, []);
  // the script for the back to top button ^

  return (
    <div className='home'>
      <h1 className='mainheader'> FEATURED </h1>
      <div className='restO box-shadow'>
        <div className='singleRest'>
          <img className='restImg' src='../images/11steakhouse.jpg' />
          <div className='restDetails'>
            <h1>Lucky J Steakhouse & Arena</h1>
            <h2 className='restAddress'>11664 Fir Rd, Carthage, MO 64836</h2>
            <p>Lucky J Steakhouse & Arena opened its doors in November 2001...</p>
          </div>
        </div>
      </div>

      <br />
      <div className='restB box-shadow'>
        <div className='singleRest'>
          <div className='restDetails'>
            <h1>Lucky J Steakhouse & Arena</h1>
            <h2 className='restAddress'>11664 Fir Rd, Carthage, MO 64836</h2>
            <p>
              Lucky J Steakhouse & Arena opened its doors in November 2001 in
              Carthage, Missouri, and has since become one of the most popular
              local restaurants as well as the premier equine arena in the
              four-state area. As our slogan says, whether you’re looking for
              great food or good times, Lucky J is the place to be!
            </p>
          </div>
          <img className='restImg' src='../images/11steakhouse.jpg' />
        </div>
      </div>

      <div>
        <br />
        <div className='restO box-shadow'>
          <div className='singleRest'>
            <img className='restImg' src='../images/11steakhouse.jpg' />
            <div className='restDetails'>
              <h1>Lucky J Steakhouse & Arena</h1>
              <h2 className='restAddress'>11664 Fir Rd, Carthage, MO 64836</h2>
              <p>Lucky J Steakhouse & Arena opened its doors in November 2001...</p>
            </div>
          </div>
        </div>

        <br />
        <div className='restB box-shadow'>
          <div className='singleRest'>
            <div className='restDetails'>
              <h1>Lucky J Steakhouse & Arena</h1>
              <h2 className='restAddress'>11664 Fir Rd, Carthage, MO 64836</h2>
              <p>
                Lucky J Steakhouse & Arena opened its doors in November 2001 in
                Carthage, Missouri, and has since become one of the most popular
                local restaurants as well as the premier equine arena in the
                four-state area. As our slogan says, whether you’re looking for
                great food or good times, Lucky J is the place to be!
              </p>
            </div>
            <img className='restImg' src='../images/11steakhouse.jpg' />
          </div>
        </div>

        <Link to="/restaurantList">
          <button className='BlueButton'>FIND MORE RESTAURANTS</button>
        </Link>
      </div>

      <h1 className='mainheader'> TOP REVIEWERS </h1>

      <div className='reviewers'>
        <div className='topReviewer box-shadow'>
          <img className='reviewerImg' src='../images/bin.jpg' />
          <div className='reviewerDetails'>
            <h2>#1</h2>
            <h1>John Doe</h1>
          </div>
        </div>

        <div className='bottomReviewers'>
          <div className='secReviewer box-shadow'>
            <img className='reviewerImg' src='../images/bin.jpg' />
            <div className='reviewerDetails'>
              <h2>#2</h2>
              <h1>John Doe</h1>
            </div>
          </div>
          <div className='thirdReviewer box-shadow'>
            <img className='reviewerImg' src='../images/bin.jpg' />
            <div className='reviewerDetails'>
              <h2>#3</h2>
              <h1>John Doe</h1>
            </div>
          </div>
        </div>
      </div>

      <div className='about'>
        <div>
          <img className='steak box-shadow' src='../images/steak.jpg' />
        </div>
        <div className='aboutText box-shadow'>
          <h1 className='aboutHeader'>ABOUT US</h1>
          <h2>
            Super Nom Wrangler is a community-driven food finder app that helps
            users discover and share hidden gem eateries—like hole-in-the-wall
            diners, family-run joints, and off-the-grid food trucks—that often
            get overlooked on mainstream platforms like Google Maps. It's built
            for adventurous eaters looking to wrangle the best local flavors
            wherever they roam.
          </h2>
          <Link to="/about">
            <button className='aboutButton'>SEE MORE</button>
          </Link>
        </div>
      </div>

      <br />
      <div className='about'>
        <div>
          <img className='map box-shadow' src='../images/map.jpg' />
        </div>
        <div className='mapText box-shadow'>
          <h1 className='aboutHeader'>MAP</h1>
          <h2>if you somehow made it this far down click here to see the map</h2>
          <Link to="/map">
            <button className='aboutButton'>SEE MAP</button>
          </Link>
        </div>
      </div>

      {/* sticky back to top button */}
      <button
        id="backToTop"
        className="backToTopButton"
      >
        &#x25B2;
      </button>
    </div>
  );
};

export default Home;

import React, { useEffect, useState } from "react";
import "./home.css";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [zipcode, setZipcode] = useState("");
  const [searchZip, setSearchZip] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      if (!searchZip) {
        setRestaurants([]);
        return;
      }
      try {
        const url = `http://localhost:4000/api/top-restaurants?zip=${encodeURIComponent(searchZip)}`;
        const response = await fetch(url);
        const data = await response.json();
  
        if (Array.isArray(data)) {
          setRestaurants(data.slice(0, 4));
        } else {
          setRestaurants([]);
          console.error("API did not return an array:", data);
        }
      } catch (error) {
        setRestaurants([]);
        console.error("Error fetching restaurants:", error);
      }
    };
  
    fetchRestaurants();
  }, [searchZip]);

  const handleZipcodeSearch = (e) => {
    e.preventDefault();
    setSearchZip(zipcode.trim());
  };

  const featuredRestaurants = () => {
    navigate("/restaurantList");
  };

  return (
    <div className="home">
      <h1 className="mainheader"> FEATURED </h1>

      {/* Zipcode Search */}
      <form onSubmit={handleZipcodeSearch} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Enter zipcode"
          value={zipcode}
          onChange={(e) => setZipcode(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {restaurants.map((rest, index) => {
        const isEven = index % 2 === 0;
        const containerClass = isEven ? "restO box-shadow" : "restB box-shadow";

        return (
          <div key={rest.restaurant_Id || index} className={containerClass}>
            <div className="singleRest">
              {isEven && (
                <img
                  className="restImg"
                  src={rest.imageUrl}
                  alt={rest.name || "Restaurant image"}
                />
              )}
              <div className="restDetails">
                <h1>{rest.name}</h1>
                <h2 className="restAddress">Address ID: {rest.address}</h2>
                <h4>Average Rating: {rest.avgRating}</h4>
                <h4>{rest.primaryType}</h4>
                <p>{rest.description}</p>
              </div>
              {!isEven && (
                <img
                  className="restImg"
                  src={rest.imageUrl}
                  alt={rest.name || "Restaurant image"}
                />
              )}
            </div>
          </div>
        );
      })}

      <button className="BlueButton" onClick={featuredRestaurants}>
        FIND MORE RESTAURANTS
      </button>

      <h1 className="mainheader"> TOP REVIEWERS </h1>

      <div className="reviewers">
        <div className="topReviewer box-shadow">
          <img
            className="reviewerImg"
            src="../images/bin.jpg"
            alt="Top reviewer"
          />
          <div className="reviewerDetails">
            <h2>#1</h2>
            <h1>John Doe</h1>
          </div>
        </div>
        <div className="bottomReviewers">
          <div className="secReviewer box-shadow">
            <img
              className="reviewerImg"
              src="../images/bin.jpg"
              alt="Second top reviewer"
            />
            <div className="reviewerDetails">
              <h2>#2</h2>
              <h1>John Doe</h1>
            </div>
          </div>
          <div className="thirdReviewer box-shadow">
            <img
              className="reviewerImg"
              src="../images/bin.jpg"
              alt="Third top reviewer"
            />
            <div className="reviewerDetails">
              <h2>#3</h2>
              <h1>John Doe</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="about">
        <div>
          <img className="steak box-shadow" src="../images/steak.jpg" alt="" />
        </div>
        <div className="aboutText box-shadow">
          <h1 className="aboutHeader">ABOUT US</h1>
          <h2>
            Super Nom Wrangler is a community-driven food finder app that helps
            users discover and share hidden gem eateries—like hole-in-the-wall
            diners, family-run joints, and off-the-grid food trucks—that often
            get overlooked on mainstream platforms like Google Maps. It's built
            for adventurous eaters looking to wrangle the best local flavors
            wherever they roam.
          </h2>
          <Link to="/about">
            <button className="aboutButton">SEE MORE</button>
          </Link>
        </div>
      </div>

      <br />

      {/* <div className="about">
        <div>
          <img className="map box-shadow" src="../images/map.jpg" alt="" />
        </div>
        <div className="mapText box-shadow">
          <h1 className="aboutHeader">MAP</h1>
          <h2>
            If you somehow made it this far down click here to see the map
          </h2>
          <Link to="/map">
            <button className="aboutButton">SEE MAP</button>
          </Link>
        </div>
      </div> */}
    </div>
  );
};

export default Home;

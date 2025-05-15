import React, { useEffect, useRef } from 'react';
import './backToTop.css';

const BackToTopButton = () => {
  const buttonRef = useRef(null);

  useEffect(() => {
    const button = buttonRef.current;

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
    button.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      button.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      className="backToTopButton"
      style={{ display: 'none' }}
    >
      &#x25B2;
    </button>
  );
};

export default BackToTopButton;

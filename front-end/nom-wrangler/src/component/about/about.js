import React from 'react'
import './about.css'
// import BackToTop from '../backToTop/backToTop'

const About = () => {
  return (
    <div className='aboutPage'>
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
            <h4> I'm Chelsea Bui, I'm a full stack web developer. I enjoy creating new things whether it be a new website, digital art, or crochet!</h4>
          </div>
        </div>

        <div className='flex'>
          <div className='detailsright'>
            <h1 className='name'>Johanna Johnson</h1>
            <h4> I'm an experienced Front-end developer. I enjoy working with new frameworks as well as basic code to build and design websites. I can be a software developer too, although I might not be the best at it. I love to learn new things and expand my knowledge to more than I already know.! I also own a cute cat named Khole.</h4>
          </div>
          <img className='box-shadow pfpright' src='../images/johanna.jfif' alt="johanna" />
        </div>

        <div className='flex'>
          <img className='box-shadow pfpleft' src='../images/erin.jpg' alt="erin" />
          <div className='detailsleft'>
            <h1 className='name'>Erin Mitchell</h1>
            <h4> I'm a passionate UI/UX Designer with a background in web development and graphic design. With a strong eye for detail and a user-centered approach, I specialize in wireframing, prototyping, and front-end development to bring designs to life. I'm always exploring new design trends and technologies to craft seamless, accessible, and aesthetically pleasing digital experiences.</h4>
            </div>
        </div>

        <div className='flex'>
          <div className='detailslauren'>
            <h1 className='name'>Lauren Unruh</h1>
            <h4> hello, i am lauren. i'm a web dev with a heavier focus on design. i enjoy breathing, warm meals, and appearing human.</h4>
          </div>
          <img className='box-shadow pfpright' src='../images/lauren.jpg' alt="lauren" />
        </div>

        <div className='flex'>
          <img className='box-shadow pfpleft' src='../images/kristin.jpg' alt="kristin" />
          <div className='detailsleft'>
            <h1 className='name'>Kristin Kingston</h1>
            <h4> Hi, I'm Kristin! A passionate UX/UI designer dedicated to creating intuitive, user-friendly experiences that blend functionality with aesthetics. With a keen eye for design and a problem-solving mindset, I craft digital experiences that are not only beautiful but also meaningful. Explore my portfolio to see how I bring ideas to life through thoughtful design and seamless user interactions!</h4>
          </div>
        </div>

        <div className='flex'>
          <div className='detailsstokes'>
            <h1 className='name'>Alexander Stokes</h1>
            <h4> Hey there! I’m Alexander—part coder, part gamer, and full-time motorcycle enthusiast. Whether I’m writing code, riding twisty backroads, or leveling up in the latest RPG, I bring the same passion and curiosity into everything I do. This project is my way of blending creativity, technology, and a bit of adrenaline—thanks for stopping by and being part of the ride!</h4>
          </div>
          <img className='box-shadow pfpright' src='../images/alexander.png' alt="alexander" />
        </div>

        <div className='flex'>
          <img className='box-shadow pfpleft' src='../images/cal.jpg' alt="cal" />
          <div className='detailsleft'>
            <h1 className='name'>Calvin Bryant</h1>
            <h2> I am a loving Father of 2 amazing kids and a wonderful wife. And the reason why I play video games is to escape reality, because with video games, you can be anything you want to be. But being a Father is the greatest gift in the world. I also love superheroes, comic books, and horror movies. </h2>
          </div>
        </div>

        <div className='flex'>
          <div className='detailszk'>
            <h1 className='name'>ZK Virrey</h1>
            <h4> I'm Leigh ZK Virrey, I'm a Web Dev, I like long walks on the beach, and I implore you to play Legend of Zelda: The Wind Waker rated E10+ on Gamecube or Wii U</h4>
          </div>
          <img className='box-shadow pfpright' src='../images/zk.png' alt="zk" />
        </div>

      </div>
      <div>
      </div>
      {/* <BackToTop /> */}
    </div>
  )
}

export default About
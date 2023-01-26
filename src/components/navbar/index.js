import React, { useState, useEffect } from "react";

function Navbar() {
  const [click, setClick] = useState(false);
  // const [button, setButton] = useState(true);

  // const handleClick = () => setClick(!click);
  // const closeMobileMenu = () => setClick(false);

  // const showButton = () => {
  //   if (window.innerWidth <= 960) {
  //     setButton(false);
  //   } else {
  //     setButton(true);
  //   }
  // };

  // useEffect(() => {
  //   showButton();
  // }, []);

  // window.addEventListener("resize", showButton);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <a to="/" className="navbar-logo">
          <img src="/assets/logo.jpeg" className="logo"/>
          </a>
          <div className="menu-icon"></div>
          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <a href="/upload" className="nav-links">
                Upload
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navbar;

{
  /* <nav className='navbar'>
<div className='navbar-container'>
  <a to='/' className='navbar-logo' onClick={closeMobileMenu}>
    TRVL
    <i class='fab fa-typo3'>fab</i>
  </a>
  <div className='menu-icon' onClick={handleClick}>
    <i className={click ? 'fas fa-times' : 'fas fa-bars'} >times</i>
  </div>
  <ul className={click ? 'nav-menu active' : 'nav-menu'}>
    <li className='nav-item'>
      <a to='/' className='nav-links' onClick={closeMobileMenu}>
        Home
      </a>
    </li>
    <li className='nav-item'>
      <a
        to='/services'
        className='nav-links'
        onClick={closeMobileMenu}
      >
        Services
      </a>
    </li>
    <li className='nav-item'>
      <a
        to='/products'
        className='nav-links'
        onClick={closeMobileMenu}
      >
        Products
      </a>
    </li>

    <li>
      <a
        to='/sign-up'
        className='nav-links-mobile'
        onClick={closeMobileMenu}
      >
        Sign Up
      </a>
    </li>
  </ul>
  {button && <button>SIGN UP</button>}
</div>
</nav> */
}

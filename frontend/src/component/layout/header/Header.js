import React, { Fragment } from 'react'
import { ReactNavbar } from "overlay-navbar"

import './Header.css'


// const Header = () => {
//     return <ReactNavbar

//         burgerColor="#eb4034"
//         burgerColorHover="#a62d24"
//         navColor1="white"


//         link1Text="Home"
//         link2Text="Products"
//         link3Text="Contact"
//         link4Text="About"
//         link1Url-=""
//         link2Url="/products"
//         link3Url="/Contact"
//         link4Url="/about"
//         link1Size="1.2vmax"
//         link1Color="rgba(35,35,35,0.8)"
//         nav1justifyContent="flex-end"
//         nav2justifyContent="flex-end"
//         nav3justifyContent="flex-start"
//         nav4justifyContent="flex-start"
//         link1ColorHover="#eb4034"
//         link1Margin="1vmax"
//         profileIconUrl="/login"
//         profileIconColor="rgba(35,35,35,0.8)"
//         searchIconColor="rgba(35,35,35,0.8)"
//         cartIconColor="rgba(35,35,35,0.8)"
//         profileIconColorHover="#eb4034"
//         searchIconColorHover="#eb4034"
//         cartIconColorHover="#eb4034"
//         cartIconMargin="1vmax"



//     />
// }
// export default Header -->

const Header = () => {

  return (
    <Fragment>

      <div className="topnav" id="myTopnav">

        <a href="/admin/dashboard">Admin</a>
        <a href="/">Home</a>
        <a href="/products" >Product</a>

        <div className="dropdown">
          <button className="dropbtn">User
            <i className="fa fa-caret-down"></i>
          </button>
          <div className="dropdown-content">
            <a href="/login">Login</a>
            <a href="/account">My Profile</a>
            <a href="/contact">Chat Us</a>
            <a href="/about">About Us</a>


          </div>
        </div>


      </div>

    </Fragment>

  )
}

export default Header
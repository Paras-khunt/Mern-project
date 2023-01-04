import React from "react"
import "./Footer.css"
import playStore from "../../../images/playstore.jpg"
import appStore from "../../../images/appstore .jpg"

const Footer = () => {
    return (
        <footer id='footer'>
            <div className="leftFooter">
                <h4>DOWNLOAD OUR APP</h4>
                <p>Download App for Android and IOS mobile phone </p>
                <img src={playStore} alt="playstore" />
                <img src={appStore} alt="appstore" />
            </div>

            <div className="midFooter">
                <h1>E-COMMERCE</h1>
                <p>Good Quality is our first priority</p>
                <p1>Copyright 2022 &copy; ParasKhunt</p1>

            </div>

            <div className="rightFooter">
                <h4>Follow Us</h4>
                <a href="http://instagram.com">Instagram</a>
                <a href="http://instagram.com">Youtube</a>
                <a href="http://instagram.com">Facebook</a>


            </div>




        </footer>
    )

}
export default Footer

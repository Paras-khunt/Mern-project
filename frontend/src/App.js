import { Fragment, useEffect } from 'react';
import './App.css';
import Header from './component/layout/header/Header.js'
import Footer from './component/layout/footer/footer.js'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { webFont } from "webfontloader"
import React, { Component, useState } from 'react'
import Home from "./component/Home/Home.js"
import ProductDetails from "./component/Product/ProductDetails.js"
import Products from "./component/Product/Products.js"
import Search from "./component/Product/Search.js"
import LoginSignUp from "./component/user/loginSignUp"
import store from "./store"
import { loadUser } from './actions/userAction';
import UserOptions from "./component/layout/header/UserOptions.js"
import { useSelector } from 'react-redux';
import Profile from "./component/user/profile.js"
import UpdatePassword from "./component/user/UpdatePassword.js"
import ProtectedRoute from './component/Route/ProtectedRoute'
import UpdateProfile from "./component/user/UpdateProfile.js"
import ForgotPassword from "./component/user/ForgotPassword.js"
import ResetPassword from "./component/user/ResetPassword.js"
import Cart from "./component/Cart/Cart.js"
import Shipping from "./component/Cart/Shipping.js"
import ConfirmOrder from "./component/Cart/confirmOrder"
import Payment from "./component/Cart/Payment.js"
import axios from 'axios';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from "./component/Cart/OrderSuccess.js"
import MyOrders from "./component/Order/MyOrder.js"
import OrderDetails from "./component/Order/OrderDetails.js"
import DashBoard from '@material-ui/icons/Dashboard';
import Dashboard from "./component/Admin/Dashboard.js"
import ProductList from './component/Admin/ProductList.js'
import NewProduct from "./component/Admin/NewProduct.js"
import UpdateProduct from "./component/Admin/UpdateProduct.js"
import OrderList from "./component/Admin/OrderList.js"
import ProcessOrder from "./component/Admin/ProcessOrder.js"
import UserList from "./component/Admin/UserList.js"
import UpdateUser from './component/Admin/UpdateUser.js'
import ProductReviews from "./component/Admin/ProductReviews.js"
import Contact from "./component/layout/header/Contact.js"
import NotFound from './component/layout/NotFound.js'
import { Switch } from '@material-ui/core';


function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);


  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/stripeapikey");

    setStripeApiKey(data.stripeApiKey);
  }

  useEffect(() => {
    const config = ({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });

    store.dispatch(loadUser());

    getStripeApiKey();
  }, []);

  window.addEventListener("contextmenu", (e) => e.preventDefault());
  return (
    <BrowserRouter>
      <Header />

      {isAuthenticated && <UserOptions user={user} />}



      <Routes>

        <Route extact path="/account" element={isAuthenticated ? <Profile /> : <LoginSignUp />} />
        <Route path="/me/update" element={isAuthenticated ? <UpdateProfile /> : <LoginSignUp />} />
        <Route extact path="/" element={<Home />} />
        <Route extact path="/product/:id" element={<ProductDetails />} />
        <Route extact path="/products" element={<Products />} />
        <Route extact path="/search" element={<Search />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route path="/login" element={<LoginSignUp />} />
        <Route path="/password/update" element={isAuthenticated ? <UpdatePassword /> : <LoginSignUp />} />
        <Route extact path="/password/forgot" element={<ForgotPassword />} />
        <Route extact path="/password/reset/:token" element={<ResetPassword />} />
        <Route extact path="/cart" element={<Cart />} />
        <Route path="/shipping" element={isAuthenticated ? <Shipping /> : <LoginSignUp />} />
        <Route path="/order/confirm" element={isAuthenticated ? <ConfirmOrder /> : <LoginSignUp />} />
        <Route path="/success" element={isAuthenticated ? <OrderSuccess /> : <LoginSignUp />} />
        <Route path="/orders" element={isAuthenticated ? <MyOrders /> : <LoginSignUp />} />
        <Route path="/order/:id" element={isAuthenticated ? <OrderDetails /> : <LoginSignUp />} />
        <Route path="/admin/dashboard" element={isAuthenticated && user.role === "admin" ? <Dashboard /> : <LoginSignUp />} />
        <Route path="/admin/products" element={isAuthenticated && user.role === "admin" ? <ProductList /> : <LoginSignUp />} />
        <Route path="/admin/product" element={isAuthenticated && user.role === "admin" ? <NewProduct /> : <LoginSignUp />} />
        <Route path="/admin/product/:id" element={isAuthenticated && user.role === "admin" ? <UpdateProduct /> : <LoginSignUp />} />
        <Route path="/admin/orders" element={isAuthenticated && user.role === "admin" ? <OrderList /> : <LoginSignUp />} />
        <Route path="/admin/order/:id" element={isAuthenticated && user.role === "admin" ? <ProcessOrder /> : <LoginSignUp />} />
        <Route path="/admin/users" element={isAuthenticated && user.role === "admin" ? <UserList /> : <LoginSignUp />} />
        <Route path="/admin/user/:id" element={isAuthenticated && user.role === "admin" ? <UpdateUser /> : <LoginSignUp />} />
        <Route path="/admin/reviews" element={isAuthenticated && user.role === "admin" ? <ProductReviews /> : <LoginSignUp />} />
        <Route extact path="/contact" element={<Contact />} />


        <Route extact path="/*" element={<NotFound />} />



        {/* {stripeApiKey && (
          <Elements stripe={loadStripe(stripeApiKey)}>
            <Route path="/process/payment" element={isAuthenticated ? <Payment /> : <LoginSignUp />} />
          </Elements>
        )} */}

        <Route path="/process/payment" element={<Elements stripe={loadStripe(stripeApiKey)}><Payment /> </Elements >} />




      </Routes>
      <Footer />
    </BrowserRouter>

  );
}

export default App;







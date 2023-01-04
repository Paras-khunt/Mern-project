import React, { Fragment, useEffect, useState } from "react";
//import { CgMouse } from "react-icons/all";
import "./Home.css"
import ProductCard from "./ProductCard.js"
import MetaData from "../layout/metadata";
import { clearErrors, getProduct } from "../../actions/productAction"
import { useSelector, useDispatch } from "react-redux"
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";





import { useNavigate } from 'react-router-dom'

const Home = () => {
    const alert = useAlert();
    const dispatch = useDispatch();
    const { loading, error, products } = useSelector((state) => state.products);

    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();

    const searchHandler = (e) => {
        e.preventDefault()

        if (keyword.trim()) {
            navigate(`/products/${keyword}`)
        } else {
            navigate('/products')
        }
    }

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        dispatch(getProduct());
    }, [dispatch, error, alert]);

    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <MetaData title="ECOMMERCE" />



                    <div className="banner">
                        <p>Welcome...!</p>
                        <h1>FIND AMAZING PRODUCTS BELOW</h1>

                        <form className="searchBox" onSubmit={searchHandler}>
                            <input
                                type="text"
                                placeholder="Search a Product .........."
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                            <input type="submit" value="Search" />
                        </form>

                        <a href="#container">
                            <button>
                                Scroll
                            </button>
                        </a>
                    </div>

                    <h2 className="homeHeading">Featured Products</h2>

                    <div className="container" id="container">
                        {products &&
                            products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                    </div>
                </Fragment>
            )}
        </Fragment>
    );
};

export default Home;









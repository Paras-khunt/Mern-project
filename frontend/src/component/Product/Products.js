import React, { Fragment, useEffect, useState } from "react";
import "./Products.css";
import { useSelector, useDispatch } from 'react-redux'
import { clearErrors, getProduct, getProductDetails } from '../../actions/productAction'
import Loader from "../layout/Loader/Loader"
import ProductCard from "../Home/ProductCard";
import { useParams } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider"
import { useAlert } from "react-alert";

const categories = [
    "Watches",
    "Kitchen Ware",
    "Clothes",
    "Jewellery",
    "Accessories",
    "Electronics",
    "Food",
    "Cosmetics",
    "Medical products"
]



const Products = () => {
    const alert = useAlert();
    const dispatch = useDispatch()

    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState([0, 25000]);
    const [category, setCategory] = useState("");

    const [rating, setRatings] = useState(0);


    const { products, loading, error, productsCount, resultPerPage } = useSelector((state) => state.products);

    let { keyword } = useParams();

    const setCurrentPageNo = (e) => {
        setCurrentPage(e)
    }

    const priceHandler = (event, newPrice) => {
        setPrice(newPrice)
    };

    const ratingsHandler = (event, newRating) => {
        setRatings(newRating);
    }

    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }
        dispatch(getProduct(keyword, currentPage, price, category, rating))
    }, [dispatch, keyword, currentPage, price, category, rating, error, alert])

    return (
        <Fragment>

            {loading ? <Loader /> :
                <Fragment>

                    <h2 className="productsHeading">Products</h2>
                    <div className="products">
                        {products && products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>

                    <div className="filterBox">

                        <Typography>Price</Typography>
                        <Slider
                            value={price}
                            onChange={priceHandler}
                            valueLabelDisplay="auto"
                            aria-labelledby="range-slider"
                            min={0}
                            max={25000}
                        />

                        <Typography>Categories</Typography>
                        <ul className="categoryBox">
                            {categories.map((category) => (
                                <li
                                    className="category-link"
                                    key={category}
                                    onClick={() => setCategory(category)}
                                >
                                    {category}
                                </li>
                            ))}
                        </ul>



                    </div>
                    {resultPerPage < productsCount && (<div className="paginationBox">
                        <Pagination
                            activePage={currentPage}
                            itemsCountPerPage={resultPerPage}
                            totalItemsCount={productsCount}
                            onChange={setCurrentPageNo}
                            nextPageText="Next"
                            prevPageText="Prev"
                            firstPageText="1st"
                            lastPageText="Last"
                            itemClass="page-item"
                            linkClass="page-link"
                            activeClass="pageItemActive"
                            activeLinkClass="pageLinkActive"
                        />

                    </div>)}

                </Fragment>}
        </Fragment>
    )
}
export default Products
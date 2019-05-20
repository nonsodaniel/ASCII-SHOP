import React, { Component, Fragment } from "react";
import CartDetails from './CartDetails'
import Spinner from './assets/spinner.gif'
class Cart extends Component {

    state = {
        cart: [], per: 15, page: 1, totalPages: null, isLoading: false
    }

    componentDidMount() {
        this.loadProducts();
        this.scrollListener = window.addEventListener('scroll', (e) => {
            this.handleScroll(e)
        })
    }

    handleSort = (e) => {
        const { per, page, cart } = this.state;
        let URL = `http://localhost:3000/api`
        let limit = `_limit=${per}&_page=${page}`
        console.log(e.target.value)
        let sortOption = e.target.value;
        let url = sortOption === "Id" ? `${URL}/products?_sort=id&${limit}` : sortOption === "Price" ?
            `${URL}/products?_sort=price&${limit}` : sortOption === "Size" ? `${URL}/products?_sort=size&${limit}` : null
        console.log("url", url);
        fetch(url).then((res) => {
            return res.json();
        }).then((data) => {
            console.log("My data", data)
            this.setState({ cart: [], })
        })

    }

    handleScroll = (e) => {
        const { scrolling, totalPages, page } = this.state;
        if (scrolling) return
        // if (totalPages <= page) return
        const allLi = document.getElementsByClassName("product-container");
        const lastLi = allLi[allLi.length - 1];
        console.log("offset", lastLi)
        const lastLiOffset = lastLi.offsetTop + lastLi.clientHeight;
        const pageOffset = window.pageYOffset + window.innerHeight;
        const bottomOffset = 28;
        console.log(pageOffset, lastLiOffset, bottomOffset);
        if (pageOffset > lastLiOffset - bottomOffset) this.loadMore()
    }

    loadProducts = () => {
        const { per, page, cart } = this.state;
        const url = `http://localhost:3000/api/products?_limit=${per}&_page=${page}`
        fetch(url).then((res) => {
            return res.json();
        }).then((data) => {
            console.log("My data", data)
            this.setState({ cart: [...cart, ...data] })
        })
    }

    loadMore = () => {
        const { per } = this.state;
        this.setState(prevState => ({
            page: prevState.page + 1,
            scrolling: true,
            isLoading: true
        }), this.loadProducts)
        const { page, cart } = this.state;
        console.log("gbese", page, cart.length)
        if (cart.length < per) {
            alert("complete")
        }
    }


    render() {
        let imageURL = `http://localhost:3000/ads/?r=${Math.floor(Math.random() * 1000)}`

        const { cart } = this.state
        if (cart.length === 0)
            return <div>Loading</div>

        return (

            <section className="section-content bg padding-y-sm">
                <div className="container">
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-3-24 text-right">
                                    <a href="#" data-toggle="tooltip" title="" data-original-title="List view"> <i className="fa fa-bars"></i></a>
                                    <a href="#" data-toggle="tooltip" title="" data-original-title="Grid view"> <i className="fa fa-th"></i></a>
                                </div>
                            </div>
                            <hr />

                            <div className="container">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="input-group" id="adv-search">
                                            <select className="form-control sort-select" onChange={this.handleSort}>
                                                <option >Select a sort option by</option>
                                                <option >Id</option>
                                                <option >Price</option>
                                                <option>Size</option>
                                            </select>
                                            <div className="input-group-btn">
                                                <div className="btn-group" role="group">
                                                    <button type="button" className="btn btn-primary"><span className="" aria-hidden="true"></span>Sort</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="padding-y-sm">
                    <span>{cart.length} ASCII Faces Available</span>
                </div>

                <div className="album py-5 bg-light">
                    <div className="container">

                        <div className="row product-row">

                            {
                                this.state.cart.map((item, i) => {
                                    if ((i + 1) % 20 == 0) {
                                        return <Fragment key={item.id}>
                                            <CartDetails   {...item} />
                                            <div className="col-md-4 product-container" key={item.id}>
                                                <div className="card mb-4 box-shadow">
                                                    <div className="text-white" style={{ height: "225px", background: "#504a4ab5", width: "100%", display: "block" }}>
                                                        <img className="ad" src={imageURL} style={{ height: "225px", background: "#504a4ab5", width: "100%", display: "block" }} />
                                                    </div>
                                                    <div className="card-body">
                                                        <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <div className="btn-group">
                                                                <button type="button" className="btn btn-sm btn-outline-secondary">${item.price}</button>
                                                                <button type="button" className="btn btn-sm btn-outline-secondary">Size- <b>{item.size}px</b></button>
                                                            </div>
                                                            <small className="text-muted">{item.date}</small>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Fragment>
                                    }
                                    return <CartDetails   {...item} key={item.id} />
                                })

                            }


                        </div>
                        {
                            this.state.isLoading ? <div className="text-center">
                                <div className="spinner-border" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div> : null
                        }


                        {
                            cart.length === 500 ? <div className="text-center">
                                <span className="sr-only">End of Data</span>
                            </div> : null
                        }
                    </div>
                </div>


            </section>
        );
    }
}

export default Cart;

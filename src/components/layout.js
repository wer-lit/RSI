import React from "react";
import {Link} from "react-router-dom";

export function Navbar(){
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom py-3 mb-3">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Products Management</Link>
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <Link className="nav-link active" aria-current="page" to="/products">Products</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link active" aria-current="page" to="/authors">Authors</Link>
                    </li>
                </ul>
            </div>

        </nav>
    )
}

export function Footer(){
    return (
        <footer>
            <div className={"container p-3 mt-5 border-top"}>
                <small className={"d-block text-muted text-center"}>&copy; 2023 - Weronika Litkowska Magdalena Nowicka</small>
            </div>
        </footer>

    )
}
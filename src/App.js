import React from 'react';
import {BrowserRouter, BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {Navbar, Footer} from "./components/layout";
import {Home} from "./components/home";
import {Products} from "./components/products";
import {Authors} from "./components/authors";


function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Navbar/>
                <Routes>
                    <Route path={"/"} element={<Home/>}/>
                    <Route path={"/products"} element={<Products/>}/>
                    <Route path={"/authors"} element={<Authors/>}/>

                </Routes>

                <Footer/>
            </BrowserRouter>
        </div>
    );
}

export default App;







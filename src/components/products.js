import React, {useEffect, useState} from "react";
import ProductsService from "../service/ProductsService";
import data from "bootstrap/js/src/dom/data";

const API_URL = "https://rsi-project.azurewebsites.net/products"
// const API_URL = "http://localhost:8080/products"


export function Products(){
    const [content, setContent] = useState(<ProductsList showForm={showForm}/>)

    function showList(){
        setContent(<ProductsList showForm={showForm}/> )
    }

    function showForm(product){
        setContent(<ProductForm product={product} showList={showList}/>)
    }




    return (
        <div className={"container my-5"}>
            {content}
        </div>
    )

}

export function ProductsList(props){
    const [products, setProducts] = useState([])
    const [quantity, setQuantity] = useState([])
    const [filter, setFilter] = useState("");
    const [state, setState] = useState(false)

    function fetchProducts(){
        setState(false)
        ProductsService.getProducts()
            .then((response) => {
                setProducts(response.data)
            })
            .catch((error) => console.log(error))
    }

    function getQuantity(){
        ProductsService.getNumberOfProducts()
            .then((response) => {
                setQuantity(response.data)
            })
            .catch((error) => console.log(error))
    }

    useEffect(() => {
        if (state === false){
            fetchProducts()
        }

        getQuantity()
    }, [state, quantity])



    function deleteProduct(id){

        ProductsService.deleteProduct(id)
            .then((response) => response.json)
        setState(false)
    }

    function getFiltered(name){
        setState(true)
        ProductsService.getFilteredProducts(name)
            .then((response) => {
                console.log(response.data)
                setProducts(response.data)
            })
            .catch((error) => console.log(error))

    }




    return(
        <div>
            <h2 className={"text-container mb-3"}>Products list</h2>
            <button onClick={() => props.showForm({})} type={"button"} className={"btn btn-primary me-2"} >Create</button>
            <button onClick={() => fetchProducts()} type={"button"} className={"btn btn-primary me-2"} >Get all</button>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    getFiltered(filter);
                }}
            >
                <div className="input-group mb-3">
                    <input
                        type="number"
                        step={"0.01"}
                        className="form-control"
                        placeholder="Filter by price"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary">Filter</button>
                </div>
            </form>
            <table className={"table"}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Weight</th>
                        <th>Expiration date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                {
                    products.map((product, index) => {
                        return(
                            <tr key={index}>
                                <td>{product.id}</td>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.weight}</td>
                                <td>{product.expirationDate}</td>
                                <td style={{width: "10px", whiteSpace: "nowrap"}}>
                                    <button onClick={() => props.showForm(product)} type={"button"} className={"btn btn-primary btn-sm me-2"}>Edit</button>
                                    <button onClick={() => deleteProduct(product.id)} type={"button"} className={"btn btn-danger btn-sm"}>Delete</button>
                                </td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>
            <div>
                <h2 className={"text-container mb-3"}>{quantity ? `Number of all products: ${quantity}` : ""}</h2>
            </div>
        </div>
    )
}

export function ProductForm(props){
    const [errorMessage, setErrorMessage] = useState("")
    const [products, setProducts] = useState([])
    function fetchProducts(){
        ProductsService.getProducts()
            .then((response) => {
                setProducts(response.data)
            })
            .catch((error) => console.log(error))
    }

    useEffect(() => {
        fetchProducts()
        console.log("working")

    }, [])

    function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const product = Object.fromEntries(formData.entries());
        console.log(product);




        if (!product.name || !product.price || !product.weight || !product.expirationDate) {
            setErrorMessage(
                <div className={"alert alert-warning"} role="alert">
                    Please fill all of the fields!
                </div>
            );
            return;
        }
        if (product.price <= 0){
            setErrorMessage(
                <div className={"alert alert-warning"} role="alert">
                    Price should be a positive number!
                </div>
            );
            return;
        }

        if (product.weight <= 0){
            setErrorMessage(
                <div className={"alert alert-warning"} role="alert">
                    Weight should be a positive number!
                </div>
            );
            return;
        }
        const currentDate = new Date().toISOString().split("T")[0];
        if (product.expirationDate <= currentDate) {
            setErrorMessage(
                <div className={"alert alert-warning"} role="alert">
                    Expiration date should be greater than today's date!
                </div>
            );
            return;
        }





        if (props.product.id) {
            fetch(API_URL + "/" + props.product.id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(product),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Product was not updated in the database");
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log(data);

                })
                .catch((error) => {
                    console.error("Error: ", error);
                });
        } else {
            const isNameUnique = products.every((existingProduct) => existingProduct.name !== product.name);
            if (!isNameUnique) {
                setErrorMessage(
                    <div className={"alert alert-warning"} role="alert">
                        Product name must be unique!
                    </div>
                );
                return;
            }
            fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(product),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Product was not added to the database");
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log(data);
                })
                .catch((error) => {
                    console.error("Error: ", error);
                });
        }
        props.showList()





    }
    return(
        <div>
            <h2 className={"text-container mb-3"}>{props.product.id ? "Edit product" : "Add new product"}</h2>
            <div className={"row"}>
                <div className={"col-lg-6 mx-auto"}>
                    {errorMessage}
                    <form onSubmit={(event) => handleSubmit(event)}>
                        {props.product.id &&
                            <div className={"row mb-3"}>
                                <label className={"col-sm-4 col-form-label"}>ID</label>
                                <div className={"col-sm-8"}>
                                    <input readOnly={true} type={"text"} className={"form-control-plaintext"} name={"name"} defaultValue={props.product.id}/>
                                </div>
                            </div>}
                        <div className={"row mb-3"}>
                            <label className={"col-sm-4 col-form-label"}>Name</label>
                            <div className={"col-sm-8"}>
                                <input type={"text"} className={"form-control"} name={"name"} defaultValue={props.product.name}/>
                            </div>
                        </div>
                        <div className={"row mb-3"}>
                            <label className={"col-sm-4 col-form-label"}>Price</label>
                            <div className={"col-sm-8"}>
                                <input type={"number"} step={"0.01"} className={"form-control"} name={"price"} defaultValue={props.product.price}/>
                            </div>
                        </div>
                        <div className={"row mb-3"}>
                            <label className={"col-sm-4 col-form-label"}>Weight</label>
                            <div className={"col-sm-8"}>
                                <input type={"number"} className={"form-control"} name={"weight"} defaultValue={props.product.weight}/>
                            </div>
                        </div>
                        <div className={"row mb-3"}>
                            <label className={"col-sm-4 col-form-label"}>Expiration date</label>
                            <div className={"col-sm-8"}>
                                <input type={"date"} className={"form-control"} name={"expirationDate"} defaultValue={props.product.expirationDate}/>
                            </div>
                        </div>
                        <div className={"row"}>
                            <div className={"offset-sm-4 col-sm-4 d-grid"}>
                                <button type={"submit"} className={"btn btn-primary btn-sm me-3"}>Save</button>
                            </div>
                            <div className={"col-sm-4 d-grid"}>
                                <button onClick={() => props.showList()} type={"button"} className={"btn btn-primary me-2"}>Cancel</button>
                            </div>
                        </div>

                    </form>

                </div>

            </div>
        </div>
    )
}




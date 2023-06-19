import React, {useEffect, useState} from "react";
import ProductsService from "../service/ProductsService";

export function Authors(props){
    const [authors, setAuthors] = useState([])

    function getAuthors(){
        ProductsService.getAuthors()
            .then((response) => {
                setAuthors(response.data)
            })
            .catch((error) => console.log(error))

    }

    useEffect(() => {
        getAuthors()
    }, [])
    return(
        <div className={"container my-5"}>
            <h2 className={"text-container mb-3"}>Authors</h2>
            <div>
                <p>{authors}</p>
            </div>

        </div>
    )
}
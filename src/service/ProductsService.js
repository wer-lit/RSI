import axios from "axios";

const API_BASE_URL = "https://rsi-project.azurewebsites.net/products";
// const API_BASE_URL = "http://localhost:8080/products";
class ProductsService {
    getProducts(){
        return axios.get(API_BASE_URL)
    }

    addProduct(product){
        return axios.post(API_BASE_URL, product)
    }

    getProductById(productId){
        return axios.get(API_BASE_URL + '/' + productId)
    }

    updateProduct(productId, product){
        return axios.put(API_BASE_URL + '/' + productId, product)
    }

    deleteProduct(productId){
        return axios.delete(API_BASE_URL + '/' + productId)
    }

    getNumberOfProducts(){
        return axios.get(API_BASE_URL + '/size')
    }

    getAuthors(){
        return axios.get(API_BASE_URL + '/authors')
    }

    getFilteredProducts(price){
        return axios.get(API_BASE_URL + '/filter?price=' + price )
    }




}

// eslint-disable-next-line import/no-anonymous-default-export
export default new ProductsService()
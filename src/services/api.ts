import axios from 'axios';

const api = axios.create({
    baseURL: 'https://barcode-product.herokuapp.com/'
});

export default api;
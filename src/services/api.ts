import axios from 'axios';

const api = axios.create({
    baseURL: 'https://formosa.agildesenvolvimento.com/api'
});

export default api;
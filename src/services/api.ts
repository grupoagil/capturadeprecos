import axios from 'axios';

const api = axios.create({
	baseURL: 'http://formosa.agildesenvolvimento.com/api'
});


export default api
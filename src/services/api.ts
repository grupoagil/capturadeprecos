import axios from 'axios';

const api = axios.create({
	// baseURL: 'http://167.249.210.93:9406/api',
	baseURL: 'http://formosa.agildesenvolvimento.com/api',
});

export default api
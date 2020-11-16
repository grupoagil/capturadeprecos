import axios from 'axios';
import { deleteUser } from '../utils/autoLogout'

const api = axios.create({
	baseURL: 'http://167.249.210.93:9406/api',

	headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.response.use(
	response => {
		return response
	},
	error => {
		if (error.response.status === 401) {
			deleteUser()
		}
		return Promise.reject(error)
	}

)

export default api
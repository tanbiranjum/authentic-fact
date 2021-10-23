import axios from 'axios'


const Api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  withCredentials: true,
  headers: {
    'Access-Control-Allow-Origin': 'http://localhost:3000',
  },
})

export default Api

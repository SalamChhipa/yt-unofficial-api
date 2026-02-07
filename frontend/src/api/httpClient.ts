import axios from 'axios';

const httpClient = axios.create({
  baseURL: 'http://192.168.1.61:3000/api',
  withCredentials:true
});

export default httpClient;

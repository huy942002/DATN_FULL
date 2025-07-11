import axios from 'axios';

const config = axios.create({
    baseURL: "http://localhost:8080/api", 
    timeout: 1000,
    headers: { 'Content-Type': 'application/json' }
})


export default config;
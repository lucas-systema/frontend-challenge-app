import axios from 'axios';
var tokenApi = null

class HttpInstance {
  httpInstance = null
  token = null
  constructor() {
    this.httpInstance = this.createAxiosInstance()
  }

  createAxiosInstance() {
    let headers = {
      "Content-Type": "application/json",
    };
    
    if (tokenApi) {
      headers['Authorization'] = `Bearer ${tokenApi}`;
    }

    return axios.create({
      baseURL: process.env.REACT_APP_API_URL,
      //withCredentials: true,
      headers: headers
    });
  }

  setToken(token) {
    tokenApi = token
    this.httpInstance = this.createAxiosInstance()
  }

}

export const apiClient = new HttpInstance()
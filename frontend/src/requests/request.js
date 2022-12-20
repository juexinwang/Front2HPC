import axios from 'axios'

// configurations
const axiosOption = {
    baseURL: '/api',
    timeout: 5000
}

// create a instance
const instance = axios.create(axiosOption);

// add request 
instance.interceptors.request.use(function (config) {
  return config;
}, function (error) {
  // do something for request error
  return Promise.reject(error);
});

// add response 
instance.interceptors.response.use(function (response) {
  // do something for response data
  return response.data;
}, function (error) {
  // do something for response error
  return Promise.reject(error);
});

export default instance;
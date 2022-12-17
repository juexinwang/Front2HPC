import request from './request'

//Submit
export const submitJobApi = (params) => request.post('/submit/', params)
//Upload trajectory
export const uploadTrajApi = (params) => request.post('/uploadtraj', params)
//Upload protein structure
export const uploadStrucApi = (params) => request.post('/uploadstruc', params)
//check job and get result
export const CheckApi = (params) => request.get('/result/', {params})
//add domain and submit in result
export const setDomainApi = (params) => request.get('/setdomain/', {params})
//set path and submit in result
export const setNodeApi = (params) => request.get('/setnode/', {params})
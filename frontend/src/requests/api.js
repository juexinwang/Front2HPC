import request from './request'

//Submit
export const submitJobApi = (params) => request.post('/submit/', params)
//Upload trajectory
export const uploadTrajApi = (params) => request.post('/uploadtraj', params)
//Upload protein structure
export const uploadStrucApi = (params) => request.post('/uploadstruc', params)
//Check
//export const CheckApi = (params) => request.post('/check/', params)
export const CheckApi = (params) => request.get('/result/', {params})
//Result
export const ResultApi = (params) => request.post('/result/', params)

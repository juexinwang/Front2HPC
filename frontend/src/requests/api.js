import request from './request'

//Submit
export const submitJobApi = (params) => request.post('/submit/', params)
//submit example
export const submitExampleApi = (params) => request.post('/submit_example/', params)
//Upload trajectory
export const uploadTrajApi = (params) => request.post('/uploadtraj', params)
//Upload protein structure
export const uploadStrucApi = (params) => request.post('/uploadstruc', params)
//check job and get result
export const CheckApi = (params) => request.get('/result/', {params})
//set domain and submit in result
export const setVisualApi = (params) => request.get('/setvisual/', {params})
//set path and submit in result
export const setNodeApi = (params) => request.get('/setnode/', {params})
//download result
export const downloadResultAPI = (params) => request.get('/download_result/', {params})


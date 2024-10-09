import axios from "axios";

const servicepi = 'http://localhost:8080/api/service'

export const getServiceById = async (serviceId) =>{
    try{
        const response = await axios.get(`${servicepi}/${serviceId}`)
        return response.data.result
    }catch(error){
        return []; 
    }
}

export const getListService = async()=>{
    try{
        const response = await axios.get(`${servicepi}`)
        return response.data.result
    }catch(error){
    
        return []; 
    }
}
import axios from "axios";
import Swal from "sweetalert2";

const serviceApi = 'http://localhost:8080/api/service'

export const getServiceById = async (serviceId) =>{
    try{
        const response = await axios.get(`${serviceApi}/${serviceId}`)
        return response.data.result
    }catch(error){
        return {}; 
    }
}

export const getServicess = async()=>{
    try{
        const response = await axios.get(`${serviceApi}`,{
        
        })
        return response.data.result
    }catch(error){
    
        return []; 
    }
}

export const getListService = async(page,status)=>{
    try{
        const response = await axios.get(`${serviceApi}/manager`,{
            params: {
                page: page,
                status: status
            },  
        })
        return response.data.result
    }catch(error){
    
        return []; 
    }
}

export const addService = async (userInfo,formData,navigate) =>{

    await axios.post(`${serviceApi}/add`, formData, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`
        }
    }).then(response =>{
        if(response.status === 200)
            navigate('/admin/manager/service');
    }).catch(error =>{
        const errorMessage = error.response.data.error;
        if(error.response.status!==401){
            Swal.fire({
                icon: "error",
                title: "Error",
                html: errorMessage.map(err => `${err.split(':')[1]}<br>`).join('')
            });
        }
        
    });
   
}

export const editService = async(userInfo,postId,formData,navigate) =>{

    await axios.put(`${serviceApi}/edit/${postId}`, formData, {
        headers: {
           'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`
        }
    }).then(response =>{
        if(response.status === 200)
            navigate('/admin/manager/service');
    }).catch(error =>{
        const errorMessage = error.response.data.error;
        Swal.fire({
            icon: "error",
            title: "Error",
            html: errorMessage.map(err => `${err.split(':')[1]}<br>`).join('')
        });
    });
}

export const showService = async(userInfo,serviceId) =>{

    await axios.put(`${serviceApi}/show/${serviceId}`,{}, {
        headers: {
            Authorization: `Bearer ${userInfo.token}`
        }
    }).catch(error =>{
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.response.data.error
            });
    })
   
}
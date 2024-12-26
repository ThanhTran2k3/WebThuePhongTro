import axios from "axios";
import Swal from "sweetalert2";

const reviewsApi ="http://localhost:8080/api/reviews"

export const getReviews = async (userName,page) => {

    try{
        const response  = await axios.get(`${reviewsApi}/${userName}`,{
            params: {
                page: page,
            },  
        })
        return response.data.result
    } catch (error) {
        console.error('Error get reviews:', error);
        return []; 
    }
};

export const addReviews = async (userInfo,formData,navigate) =>{

    await axios.post(`${reviewsApi}/add`, formData, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`
        }
    }).then(response =>{
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

export const showReviews = async(userInfo,reviewsId) =>{

    await axios.put(`${reviewsApi}/delete/${reviewsId}`,{}, {
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
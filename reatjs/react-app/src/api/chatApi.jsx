import axios from "axios";
import Swal from "sweetalert2";


const chatApi ="http://localhost:8080/api/messages"

export const getListUserChat = async(userInfo,navigate)=>{
    try{
        const response = await axios.get(`${chatApi}`,{
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            },
        })
        return response.data.result
    }catch(error){ 
        navigate('/error');
        return [];
    }
}

export const getDetailChat = async(userInfo,userChat,navigate)=>{
    try{
        const response = await axios.get(`${chatApi}/detail`,{
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            },
            params:{
                userChat: userChat 
            }
        })
        return response.data.result
    }catch(error){ 
        navigate('/error');
        return [];
    }
}

export const updateMessage = async(userInfo,receiverName,navigate)=>{
    await axios.put(`${chatApi}/update`,{},{
        headers: {
            Authorization: `Bearer ${userInfo.token}`
        },
        params:{
            receiverName: receiverName 
        }
    }).catch(error =>{
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.response.data.error
            });
    })
       
}

export const update = async(userInfo,messageId,navigate)=>{
    try{
        const response = await axios.put(`${chatApi}/update/${messageId}`,{},{
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            },
        })
        return response.data.result
    }catch(error){ 
        navigate('/error');
        return [];
    }
}
import axios from "axios";

const chatApi ="http://localhost:8080/api/messages"

export const getListUserChat = async(userInfo)=>{
    try{
        const response = await axios.get(`${chatApi}`,{
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            },
        })
        return response.data.result
    }catch(error){ 
        return [];
    }
}

export const getDetailChat = async(userInfo,userChat)=>{
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
        return [];
    }
}
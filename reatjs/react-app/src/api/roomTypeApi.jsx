import axios from "axios"

const roomTypeApi = 'http://localhost:8080/api/roomType'

export const getRoomType = async () =>{
    try{
        const response = await axios.get(`${roomTypeApi}`)
        return response.data
    }catch(error){
        console.error('Error get room type:', error);
        return []; 
    }
}
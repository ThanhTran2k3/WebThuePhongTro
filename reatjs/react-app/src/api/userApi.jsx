import axios from 'axios';


const userApi ='http://localhost:8080/api/user'

export const getUserByUserName = async (userInfo,navigate) =>{
    try{
        const response = await axios.get(`${userApi}/detail`,{
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        })
        return response.data.result
        
    }catch(error){
        navigate('/error');
        return {}; 
    }
}

export const getInfoUser = async (userName,navigate) =>{
    try{
        const response = await axios.get(`${userApi}/${userName}`)
        return response.data.result
        
    }catch(error){
        navigate('/error');
        return {}; 
    }
}

export const editUser = async(formData,userInfo,updateUser)=>{
    try{
        const response = await axios.put(`${userApi}/edit/profile`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${userInfo.token}`
            }
        })
            sessionStorage.setItem('userinfo', JSON.stringify(response.data.result));
            updateUser(response.data.result)

    }catch(error){
        console.error(`Error `, error);
    }
}
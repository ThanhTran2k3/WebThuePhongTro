import axios from 'axios';
import Swal from 'sweetalert2';


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

export const getPostUser = async (userName,navigate,page,postType) =>{
    try{
        const response = await axios.get(`${userApi}/post/${userName}`,{
            params: {
                page: page,
                postType: postType
            }
        })
        
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
        const errorMessage = error.response.data.error;
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    html: errorMessage.map(err => `${err.split(':')[1]}<br>`).join('')
                });
    }
}

export const getRoleUser = async(userInfo,status,page)=>{
    try{
        const response = await axios.get(`${userApi}/role/user`, {
            params:{
                type: status,
                page: page
            },
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        })
        return response.data.result   
    }catch(error){
        console.error(`Error `, error);
    }
}

export const getRoleEmployee = async(userInfo,status,page)=>{
    try{
        const response = await axios.get(`${userApi}/role/employee`, {
            params:{
                type: status,
                page: page
            },
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        })
        return response.data.result   
    }catch(error){
        console.error(`Error `, error);
    }
}

export const blockUser = async(userInfo,userName) =>{

    await axios.put(`${userApi}/block/${userName}`,{}, {
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

export const addEmployee = async (userInfo,formData,navigate) =>{

    await axios.post(`${userApi}/add/employee`, formData, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`
        }
    }).then(response =>{
        if(response.status === 200)
            navigate('/admin/manager/employee');
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
import axios from "axios";
import Swal from "sweetalert2";


const authApi ="http://localhost:8080/api/auth"

export const login = async (data,updateUser,navigate) =>{
    await axios.post(`${authApi}/log-in`,data,{
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response =>{
        sessionStorage.setItem("userinfo", JSON.stringify(response.data.result));
        updateUser(response.data.result);
        if(response.data.result.roles.includes('ROLE_EMPLOYEE'))
            navigate('/employee/manager/user')
        else
            navigate('/');
        
    }).catch(error =>{
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.response.data.error
            });
    })
  
}

export const register = async (formData,navigate) =>{

    await axios.post(`${authApi}/register`, formData, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response =>{
        if(response.status === 200)
            navigate('/login');
    }).catch(error =>{
        const errorMessage = error.response.data.error;
        Swal.fire({
            icon: "error",
            title: "Error",
            html: errorMessage.map(err => `${err.split(':')[1]}<br>`).join('')
        });
    });
   
}

export const refreshToken = async (userInfo,updateUser)=>{
    await axios.get(`${authApi}/refreshToken`,{
        headers: {
            Authorization: `Bearer ${userInfo.token}`
        }
    }).then(response =>{
        sessionStorage.setItem("userinfo", JSON.stringify(response.data.result));
        updateUser(response.data.result);
    })
   
}
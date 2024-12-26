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
        else if(response.data.result.roles.includes('ROLE_ADMIN'))
            navigate('/admin/manager/employee')
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

export const changePass = async (userInfo,formData,navigate,logout) =>{

    await axios.put(`${authApi}/changePass`, formData, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`
        }
    }).then(response =>{
        Swal.fire({
            title: "Bạn chắc chắn?",
            text: "Bạn đã đổi mật khẩu thành công.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Đăng xuất",
            cancelButtonText: "Để sau"
          }).then((result) => {
            if (result.isConfirmed) {
              logout()
              navigate('/login');
              Swal.fire({
                title: "Đăng xuất!",
                text: "Bạn đã đăng xuất thành công.",
                icon: "success"
              });
            }
          });
    }).catch(error =>{
        const errorMessage = error.response.data.error;
        console.log(error.response.data)
        Swal.fire({
            icon: "error",
            title: "Error",
            html: Array.isArray(errorMessage)?errorMessage.map(err => `${err.split(':')[1]}<br>`).join(''):error.response.data.error
        });
    });
   
}

export const changePassOTP = async (formData,navigate,logout) =>{

    await axios.post(`${authApi}/changePassOTP`, formData, {
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(response =>{
        navigate('/');
        Swal.fire({
            title: "Đổi mật khẩu thành công!",
            icon: "success",
            draggable: true
        });
    }).catch(error =>{
        const errorMessage = error.response.data.error;
        console.log(error.response.data)
        Swal.fire({
            icon: "error",
            title: "Error",
            html: Array.isArray(errorMessage)?errorMessage.map(err => `${err.split(':')[1]}<br>`).join(''):error.response.data.error
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
import axios from "axios";
import Swal from "sweetalert2";


const otpApi ="http://localhost:8080/api/otp"

export const sendOTPEmail = async (data) =>{

    try {
        const response =  await axios.post(`${otpApi}/send-email`,data,{
            
        })
        if (response.status === 200) {
            return true;
        }
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.response.data.error
            });
        return false
    }
  
}

export const verifyOTPEmail = async (email,otp) =>{
    try {
        const response = await axios.post(`${otpApi}/verify-otp`,{},{
            params: {
                otp: otp,
                users: email
            },
        })
        if (response.status === 200) {
            return true;
        }
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.response.data.error
            });
        return false
    }
}
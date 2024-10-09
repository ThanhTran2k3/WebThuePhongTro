import axios from "axios";
import Swal from "sweetalert2";

const paymentApi = 'http://localhost:8080/api/payment'

export const paymentMomo = async(userInfo,amount)=>{

    await axios.post(`${paymentApi}/momo?amount=${amount}`,{},{
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`

        }
    }).then(response =>{
        window.location.href = response.data.payUrl
    }).catch(error =>{
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.response.data.error
            });
    })
}
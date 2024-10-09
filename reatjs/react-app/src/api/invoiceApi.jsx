import axios from "axios";

const invoiceApi ="http://localhost:8080/api/invoice"

export const getInvoiceOfUser = async(userInfo,navigate)=>{
    try{
        const response = await axios.get(`${invoiceApi}/history`,{
            headers: {
                Authorization: `Bearer ${userInfo.token}`

            }
        })
        return response.data.result
    }catch(error){
        
        navigate('/error');
         
        return [];
    }
}
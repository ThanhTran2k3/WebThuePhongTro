import axios from "axios";

const invoiceApi ="http://localhost:8080/api/invoice"

export const getInvoiceOfUser = async(userInfo,navigate,page,service)=>{
    try{
        const response = await axios.get(`${invoiceApi}/history`,{
            params: {
                page: page,
                service: service
            },
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

export const getAllInvoice = async(userInfo,navigate,page,service)=>{
    try{
        const response = await axios.get(`${invoiceApi}`,{
            params: {
                page: page,
                service: service
            },
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
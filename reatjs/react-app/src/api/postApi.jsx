import axios from "axios";
import Swal from "sweetalert2";

const postApi = 'http://localhost:8080/api/post';

export const getPost = async()=>{
    try{
        const response = await axios.get(`${postApi}`)
        return response.data.result
    }catch(error){
        console.error('Error get post:', error);
        return []; 
    }
}

export const getPostById = async(userInfo,postId,navigate) =>{
    try{
        const response = await axios.get(`${postApi}/${postId}`,{
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

export const getPostDetail = async (postId, navigate) => {
    try {
        const response = await axios.get(`${postApi}/detail/${postId}`);
        return response.data.result;
    } catch (error) {
        navigate('/error');
        return {};
    }
};


export const addPost = async(formData,userInfo,navigate) =>{

    await axios.post(`${postApi}/add`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${userInfo.token}`
        }
    }).then(response =>{
        if(response.status === 200)
            navigate('/');
    }).catch(error =>{
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.response.data.error
            });
    });

}


export const editPost = async(formData,postId,userInfo,navigate) =>{

    await axios.put(`${postApi}/edit/${postId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${userInfo.token}`
        }
    }).then(response =>{
        if(response.status === 200)
            navigate('/');
    }).catch(error =>{
        const errorMessage = error.response.data.error;
        Swal.fire({
            icon: "error",
            title: "Error",
            html: errorMessage.map(err => `${err.split(':')[1]}<br>`).join('')
        });
    });
}


export const likePost = async(userInfo,postId) =>{
    try{
        const response = await axios.post(`${postApi}/like/${postId}`,{}, {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        })
        return response.data.result
    }catch(error){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.response.data.error
            });
    }
}

export const showPost = async(userInfo,postId,updatePostOfUser) =>{

    await axios.put(`${postApi}/show/${postId}`,{}, {
        headers: {
            Authorization: `Bearer ${userInfo.token}`
        }
    }).then(reponse =>{
        updatePostOfUser(reponse.data.result)
    }).catch(error =>{
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.response.data.error
            });
    })
   
}

export const extendPost = async(userInfo,postId,month,service,updatePostOfUser) =>{

    const data = {
        month: month,
        service: service
    }


    await axios.post(`${postApi}/extend/${postId}`,data, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`
        }
    }).then(reponse =>{
        updatePostOfUser(reponse.data.result)
    }).catch(error =>{
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.response.data.error
            });
    })

}

export const servicePost = async(userInfo,postId,day,service,updatePostOfUser) =>{

    const data = {
        day: day,
        service: service
    }


    await axios.post(`${postApi}/service/${postId}`,data, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`
        }
    }).then(reponse =>{
        updatePostOfUser(reponse.data.result)
    }).catch(error =>{
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.response.data.error
            });
    })
    
}






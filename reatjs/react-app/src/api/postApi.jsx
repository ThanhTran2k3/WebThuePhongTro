import axios from "axios";
import Swal from "sweetalert2";

const postApi = 'http://localhost:8080/api/post';

export const getNewPost = async()=>{
    try{
        const response = await axios.get(`${postApi}/new`)
        return response.data.result
    }catch(error){
        console.error('Error get post:', error);
        return []; 
    }
}

export const getNear = async(address)=>{
    try{
        const response = await axios.get(`${postApi}/near`,{
            params: {
                address: address
            }
        })
        return response.data.result
    }catch(error){
        console.error('Error get post:', error);
        return []; 
    }
}

export const getNearPost = async(address,page,city,district,ward,roomType)=>{
    try{
        const response = await axios.get(`${postApi}/near/post`,{
            params: {
                address: address,
                page: page,
                city: city,
                district: district,
                ward: ward,
                roomType: roomType
            }
        })
        return response.data.result
    }catch(error){
        console.error('Error get post:', error);
        return []; 
    }
}

export const getPostLocation = async(city)=>{
    try{
        const response = await axios.get(`${postApi}/city`,{
            params: {
                city: city
            }
        })
        return response.data.result
    }catch(error){
        console.error('Error get post:', error);
        return []; 
    }
}


export const getPost = async(page,city,district,ward,roomType)=>{
    try{
        const response = await axios.get(`${postApi}`,{
            params: {
                page: page,
                city: city,
                district: district,
                ward: ward,
                roomType: roomType
            }
        })
        return response.data.result
    }catch(error){
        console.error('Error get post:', error);
        return []; 
    }
}

export const getLocation = async(address,city,district,ward,roomType)=>{
    try{
        const response = await axios.get(`${postApi}/location`,{
            params: {
                address: address,
                city: city,
                district: district,
                ward: ward,
                roomType: roomType
            }
        })
        return response.data.result
    }catch(error){
        console.error('Error get post:', error);
        return []; 
    }
}

export const getRegion = async(query,city,district,ward,roomType)=>{
    try{
        const response = await axios.get(`${postApi}/region`,{
            params: {
                query: query,
                city: city,
                district: district,
                ward: ward,
                roomType: roomType
            }
        })
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

export const getPostManager = async (userInfo,navigate,page,postType) =>{
    try{
        const response = await axios.get(`${postApi}/management/post`,{
            params: {
                page: page,
                postType: postType
            },
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
            navigate('/user/manager/post');
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
            return
    }).catch(error =>{
        const errorMessage = error.response.data.error;
        Swal.fire({
            icon: "error",
            title: "Error",
            html: errorMessage.map(err => `${err.split(':')[1]}<br>`).join('')
        });
    });
}

export const deletePost = async(userInfo,postId,navigate,action) =>{

    await axios.put(`${postApi}/status/${postId}`,{}, {
        params: {
            action: action,
        },
        headers: {
            Authorization: `Bearer ${userInfo.token}`
        }
    }).then(response =>{
        if(response.status === 200)
            navigate('/employee/manager/post');
    }).catch(error =>{
        navigate('/error');
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
        console.log(error)
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.response.data.error
            });
    })
   
}

export const extendPost = async(userInfo,postId,month,service,navigate) =>{

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
        navigate('/user/manager/post');
    }).catch(error =>{
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.response.data.error
            });
    })

}

export const servicePost = async(userInfo,postId,day,service,navigate) =>{

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
        navigate('/user/manager/post');
    }).catch(error =>{
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.response.data.error
            });
    })
    
}


export const postSuggestions = async (query) => {
    try {
        const response = await axios.get(`${postApi}/search/suggestions`,{
            params: {
                query: query,
            },
        });
        return response.data.result;
    } catch (error) {
        return [];
    }
};

export const postSearch = async (query,page,city,district,ward,roomType) => {
    try {
        const response = await axios.get(`${postApi}/search/result`,{
            params: {
                query: query,
                page: page,
                city: city,
                district: district,
                ward: ward,
                roomType: roomType
            },
        });
        return response.data.result;
    } catch (error) {
        return [];
    }
};




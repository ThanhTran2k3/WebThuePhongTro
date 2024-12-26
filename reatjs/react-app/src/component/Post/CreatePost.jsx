import React, { useEffect } from "react";
import FormPost from "./FormPost";
import { useNavigate } from "react-router-dom";
import { useUser } from '../../UserContext';
const CreatePost = () => {
    
    const { userInfo  } = useUser();
    const navigate = useNavigate()

    useEffect(()=>{
        if (!userInfo) {
            navigate('/login');
        }
    })
    return (
        <div>
            <FormPost
                post = {{}}
            />
        </div>
    );
};

export default CreatePost;


    

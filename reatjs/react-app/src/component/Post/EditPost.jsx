import React, { useEffect, useState } from 'react';
import { getPostById } from "../../api/postApi";
import FormPost from './FormPost';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../../UserContext';

const EditPost = () => {
    const { userInfo  } = useUser();
    const [post, setPost] = useState({})
    const { postId } = useParams()
    const navigate = useNavigate()
    useEffect(()=>{
        const fetchData = async () => {
            const post = await getPostById(userInfo,postId,navigate);
            setPost(post)
        };
        fetchData();
    },[postId,userInfo,navigate])
    return (
        <div>
            <FormPost
                post = {post}
            />
        </div>
    );
};

export default EditPost;




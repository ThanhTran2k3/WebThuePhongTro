import React from 'react';
import { useUser } from '../../UserContext';
import PostList from './PostList';

const FavoritePost = () => {

    const { userInfo  } = useUser();



    return (
        <div className='m-5 w-75 mx-auto'>
            <PostList listPost={userInfo.likePost} />
        </div>
    );
};

export default FavoritePost;
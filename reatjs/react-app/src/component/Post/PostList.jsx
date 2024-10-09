import React from 'react';
import Post from './Post';

const PostList = (props) => {
    return (

            <div className='m-5'>
                {props.listPost.length !== 0 ? (
                    props.listPost.map((item)  => (
                        <Post  
                                key={item.postId}
                                postId={item.postId}
                                filteredAnh= {item.postImages}
                                postCategory= {item.postCategory}
                                title = {item.title}
                                area ={item.area}
                                rentPrice = {item.rentPrice}
                                city = {item.city}
                                district = {item.district}
                                
                        />
                    ))
                ) : (
                    <div className="no-posts">
                        <p>Không có bài viết để hiển thị.</p>
                    </div>
                )}
            </div>

    );
};

export default PostList;
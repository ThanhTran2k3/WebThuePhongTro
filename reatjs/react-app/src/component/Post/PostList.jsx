import React, { useEffect, useState } from 'react';
import Post from './Post';
import { Pagination } from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../../UserContext';
import { getPostManager } from '../../api/postApi';
import { getPostUser } from '../../api/userApi';


const PostList = (props) => {
    const [listPost, setListPost] = useState([])
    const [totalPage, setTotalPage] = useState()
    const [page, setPage] = useState(1);
    const { userInfo, postOfUser } = useUser();
    const { userName } = useParams()
    const currentUserName = userName || userInfo.userName;
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const pageUrl = queryParams.get('page');
    const newPage = pageUrl ? Number(pageUrl) : 1; 
    const navigate = useNavigate();
    const [reload, setReload] = useState(false)

    useEffect(()=>{
        
        const fetchData = async () => {
            
            let post;
            if(userInfo.roles.includes('ROLE_USER'))
                post = await getPostUser(currentUserName,navigate,newPage,props.postType)
            else
                post = await getPostManager(userInfo,navigate,newPage,props.postType)
            setListPost(post.content)
            setTotalPage(post.totalPage)
            setPage(post.currentPage)
        };

        fetchData();
        
        window.scrollTo(0, 0); 
    },[currentUserName,navigate,newPage,props.postType,postOfUser,userInfo,reload])

   

    const handlePageChange = async (event,value) => {
        navigate(`?page=${value}`);
        window.scrollTo(0, 0); 
    };

    return (

            <div className='m-5'>
                {listPost.length !== 0 ? (
                    <>
                        {listPost.map((item)  => (
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
                                    expirationDate= {item.expirationDate}
                                    approvalStatus={item.approvalStatus}
                                    status={item.status}
                                    userName ={item.userName}
                                    reload = {reload}
                                    setReload ={setReload}
                            />
                        ))}
                        <div className="d-flex justify-content-center mt-5">
                                <Pagination count={totalPage} page={page} onChange={handlePageChange} variant="outlined" shape="rounded" />
                        </div>
                    </>
                ) : (
                    <div className="no-posts">
                        <p>Không có bài viết để hiển thị.</p>
                    </div>
                )}
                
            </div>

    );
};

export default PostList;
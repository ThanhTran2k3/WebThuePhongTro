import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Post from './Post';
import { Pagination } from '@mui/material';
import FormLocation from './FormLocation';
import { postSearch } from '../../api/postApi';
import { getRoomType } from '../../api/roomTypeApi';

const SearchResult = () => {
    const [listPost, setListPost] = useState([])
    const [totalPage, setTotalPage] = useState()
    const [listRoomType, setListRoomType] = useState([])
    const [selectedRoomType, setSelectedRoomType] = useState("0")
    const navigate = useNavigate();
    const [page, setPage] = useState(1);        
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const pageUrl = queryParams.get('page');
    const queryUrl = queryParams.get('query');
    const newPage = pageUrl ? Number(pageUrl) : 1; 
    const query = queryUrl ?queryUrl:''; 

    useEffect(() => {
        const fetchData = async () => {
            const result = await postSearch(query,newPage);
            setPage(result.currentPage)
            setListPost(result.content);
            setTotalPage(result.totalPage)
        };
        fetchData();
    }, [query,newPage]); 

    useEffect(() => {
        const fetchData = async () => {
            const roomTypes = await getRoomType();
            setListRoomType(roomTypes);
        };
        fetchData();
    }, []); 

    const handleRoomTypeChange = (event) => {
        setSelectedRoomType(event.target.value); 
    };

    const handlePageChange = async (event,value) => {
        navigate(`?page=${value}`);
    };

    return (
        <div className="container">
            <div className="list-container pb-5">
                {listPost.length !==0 ? (
                    listPost.map((item)  => (
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
                                userName = {item.userName}
                        />

                    ))
                ) : (
                    <div className="error-container w-100">
                        <p>Không có kết quả tìm kiếm nào</p>
                    </div>
                )}
                {listPost.length !==0 && (
                    <div className="mx-auto mt-5">
                        <Pagination count={totalPage} page={page} onChange={handlePageChange} variant="outlined" shape="rounded" />
                    </div>
                )}
                
            </div>
            

            <div className="filter-form-container">
                <form action="/LocKetQua" method="POST" encType="multipart/form-data" className="filter-form">
                    <FormLocation />
                    <div className="form-floating mb-4">
                        <select className="form-control" value={selectedRoomType} onChange={handleRoomTypeChange}>
                            <option value="0" disabled hidden>Chọn loại phòng</option>
                            <option value="allRoomType">Tất cả</option>
                            {Array.isArray(listRoomType)&&(
                                listRoomType.map(roomType => (
                                    <option value={roomType.roomTypeId} key={roomType.roomTypeId}>{roomType.typeRoomName}</option>
                            )))}
                        </select>
                        <label className="control-label">Loại phòng</label>
                    </div>

                    <div className="submit-group">
                        <input type="submit" value="Lọc" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SearchResult;
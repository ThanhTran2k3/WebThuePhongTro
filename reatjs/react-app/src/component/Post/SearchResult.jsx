import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Post from './Post';
import { Pagination } from '@mui/material';
import FormLocation from './FormLocation';
import { getRegion, postSearch } from '../../api/postApi';
import { getRoomType } from '../../api/roomTypeApi';
import { GoogleMap, InfoWindow, LoadScript, Marker } from '@react-google-maps/api';

const SearchResult = () => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const [listPost, setListPost] = useState([])
    const [listALLPost, setListALLPost] = useState([])
    const [listRoomType, setListRoomType] = useState([])
    const [totalPage, setTotalPage] = useState()
    const [page, setPage] = useState(1);        
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const pageUrl = queryParams.get('page');
    const queryUrl = queryParams.get('query');
    const newPage = pageUrl ? Number(pageUrl) : 1; 
    const [query,setQuery] =useState(queryUrl ?queryUrl:'' )
    const [selectedRoomType, setSelectedRoomType] = useState(null)
    const [selectedCity, setSelectedCity] = useState(null)
    const [selectedDistrict, setSelectedDistrict] = useState(null)
    const [selectedWard, setSelectedWard] = useState(null)
    const [selected, setSelected] = useState(null);
    const [center, setCenter] = useState();
    const navigate = useNavigate();
    const containerStyle = {
        width: "100%",
        height: "100%",
    };
    useEffect(() => {
        const fetchData = async () => {
            const result = await postSearch(query,newPage,selectedCity,selectedDistrict,selectedWard,selectedRoomType);
            setPage(result.currentPage)
            setListPost(result.content);
            setTotalPage(result.totalPage)
            const allPost = await getRegion(query,selectedCity,selectedDistrict,selectedWard,selectedRoomType);
            setListALLPost(allPost)
        };
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth' 
        });
        fetchData();
    }, [query,newPage,selectedCity,selectedDistrict,selectedWard,selectedRoomType,location]); 

    useEffect(() => {
        const fetchData = async () => {
            const roomTypes = await getRoomType();
            setListRoomType(roomTypes);
        };
        fetchData();
    }, []); 

    useEffect(() => {
        if(listALLPost.length !== 0){
            setCenter({ lat: listALLPost[0].latitude, lng: listALLPost[0].longitude });
        }
    }, [listALLPost]); 

    const handleRoomTypeChange = (event) => {
        const selectedRoomTypeName = event.target.value==='0'?null:event.target.options[event.target.selectedIndex].text;
        setSelectedRoomType(selectedRoomTypeName); 
    };

    const handlePageChange = async (event,value) => {
        navigate(`?page=${value}`);
    };

    const handleMarkerClick = (location) => {
        setSelected(location);
        setCenter({ lat: location.latitude, lng: location.longitude });
    };

    const handleClick = (url) => {
        window.open(url, "_blank");
    };
    return (
        <div className="container">
            <div className='d-flex'>
                <div className="list-container pb-5">
                   <div className="option-container">
                        <FormLocation 
                            setSelectedCity = {setSelectedCity}
                            setSelectedDistrict = {setSelectedDistrict}
                            setSelectedWard = {setSelectedWard}
                        />
                        <div className="form-floating mb-4">
                            <select className="form-control form-select" onChange={handleRoomTypeChange}>
                                <option selected disabled hidden>Chọn loại phòng</option>
                                <option value="0">Tất cả</option>
                                {Array.isArray(listRoomType)&&(
                                    listRoomType.map(roomType => (
                                        <option value={roomType.roomTypeId} key={roomType.roomTypeId}>{roomType.typeRoomName}</option>
                                )))}
                            </select>
                            <label className="control-label">Loại phòng</label>
                        </div>
                    
                    </div>
                    <>
                    {listPost&&listPost.length !==0 ? (
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
                            <p>Không có bài đăng nào</p>
                        </div>
                    )}
                    {listPost&&listPost.length !==0 && (
                        <div className="d-flex justify-content-center mt-5">
                            <Pagination count={totalPage} page={page} onChange={handlePageChange} variant="outlined" shape="rounded" />
                        </div>
                    )}
                    </>
                    
                    
                </div>
                <div className='map-container'>
                    <LoadScript googleMapsApiKey={apiKey}>
                            <GoogleMap mapContainerStyle={containerStyle} options={{gestureHandling: "greedy", }}  center={center} zoom={10}>
                            {listALLPost.map((post) => (
                                <Marker
                                    key={post.postId}
                                    position={{ lat: post.latitude, lng: post.longitude }}
                                    onClick={() => handleMarkerClick(post)}
                                />
                            ))}
                            {selected && (
                            <InfoWindow
                                position={{ lat: selected.latitude, lng: selected.longitude }}
                                onCloseClick={() => setSelected(null)}
                                >
                               <div className="info-window-content d-flex">
                              
                                    <img src={`http://localhost:8080${selected.postImages[0].urlImage}`} alt="Hình ảnh bài đăng"/>
                                    <div>
                                            {/* <Link to={`/post/${selected.postId}`}> */}
                                                <h3 onClick={() => handleClick(`/post/${selected.postId}`)} className='mb-2'>{selected.title}</h3>
                                            {/* </Link> */}
                                            
                                            <span className="card-area lead mb-2">
                                                {selected.area} m<sup>2</sup>
                                            </span>
                                            <p className="card-price lead mb-2">
                                                {selected.rentPrice.toLocaleString()} đ/ tháng
                                            </p>
                                    </div>
                                </div>
                            </InfoWindow>
                            )}
                            </GoogleMap>
                        
                    </LoadScript>
                </div>
            </div>
           
            

            
        </div>
    );
};

export default SearchResult;
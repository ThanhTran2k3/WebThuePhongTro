import React, { useEffect, useState } from 'react';
import { getPost } from '../../api/postApi';
import FormLocation from './FormLocation';
import { getRoomType } from "../../api/roomTypeApi";
import Post from './Post';
import Pagination from '@mui/material/Pagination';
import { useLocation, useNavigate } from 'react-router-dom';

const ListPost = () => {
    const [listPost, setListPost] = useState([])
    const [totalPage, setTotalPage] = useState()
    const [listRoomType, setListRoomType] = useState([])
    const [selectedRoomType, setSelectedRoomType] = useState("0")
    const navigate = useNavigate();
    const [page, setPage] = useState(1);        
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const pageUrl = queryParams.get('page');
    const newPage = pageUrl ? Number(pageUrl) : 1; 

    useEffect(() => {
        const fetchData = async () => {
            const result = await getPost(newPage);
            setPage(result.currentPage)
            setListPost(result.content);
            setTotalPage(result.totalPage)
        };
        fetchData();
    }, [newPage]); 

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
                    <p>Không có dữ liệu để hiển thị.</p>
                )}
                <div className="mx-auto mt-5">
                    <Pagination count={totalPage} page={page} onChange={handlePageChange} variant="outlined" shape="rounded" />
                </div>
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

export default ListPost;


// class ListPost extends React.Component {

//     state = {
//         listPost: [],
//         // listCity: [],
//         // listDistrict: [],
//         // listWards: [],
//         listRoomType: [],
//         // isAllCity: true,
//         // isAllDistrict: true,
//     };

    
//     componentDidMount() {
//         this.loadPosts();
//         // this.loadCities();
//         this.loadRoomType();
//     }

//     loadRoomType = async () =>{
//         const data = await getRoomType()
//         this.setState({listRoomType: data})
//     }

//     loadPosts = async () =>{
//         const data = await getPost();
//         this.setState({listPost:data})
//     }

//     // loadCities = async () => {
//     //     const data = await getCities();
//     //     this.setState({ listCity: data });
//     // };

//     // handleCityChange = (event) => {
//     //     const selectedCityId = event.target.value;
//     //     this.setState({listDistrict:[],listWards:[]})
//     //     if(selectedCityId!=="allCity"){     
//     //         this.setState({isAllCity: false,isAllDistrict: true}) 
//     //         this.loadDistricts(selectedCityId);
//     //     }
//     //     else
//     //     {
//     //         this.setState({isAllCity: true,isAllDistrict:true})
//     //     }
            
       
//     // };

//     // loadDistricts = async(selectedCityId) =>{
//     //     const data = await getDistricts(selectedCityId)
//     //     this.setState({listDistrict : data})
//     // }
    
//     // handleDistrictChange = (event) =>{
//     //     const selectedDistrictId = event.target.value;
//     //     this.setState({listWards: []}) 
//     //     if(selectedDistrictId!=="allDistrict"){
//     //         this.setState({isAllDistrict: false})  
//     //         this.loadWards(selectedDistrictId)
//     //     }
//     //     else
//     //         this.setState({isAllDistrict: true})  
        
//     // }

//     // loadWards = async (selectedDistrictId) =>{
//     //     const data = await getWards(selectedDistrictId)
//     //     this.setState({listWards : data})
//     // }



//     render() {
//         const { listPost, listCity, listDistrict, listWards, isAllCity, isAllDistrict, listRoomType  } = this.state;
//         return (
//             <div className="container">
//                 <div className="list-container">
//                     {listPost.length > 0 ? (
//                         listPost.map((item)  => (
//                         <PostCard  
//                                 key={item.postId}
//                                 postId={item.postId}
//                                 filteredAnh= {item.postImages}
//                                 postCategory= {item.postCategory}
//                                 title = {item.title}
//                                 area ={item.area}
//                                 rentPrice = {item.rentPrice}
//                                 city = {item.city}
//                         />
//                         ))
//                     ) : (
//                         <p>Không có dữ liệu để hiển thị.</p>
//                     )}
//                 </div>

//                 <div className="filter-form-container">
//                     <form action="/LocKetQua" method="POST" encType="multipart/form-data" className="filter-form">
//                         {/* <div className="mb-3">
//                             <select className="form-control" id="thanhPhoSelect" onChange={this.handleCityChange}>
//                                 <option value="" disabled selected hidden>Chọn tỉnh thành</option>
//                                 <option key="allCity" value="allCity">Toàn quốc</option>
//                                 {listCity.map(city => (
//                                     <option key={city.id} value={city.id}>{city.full_name}</option>
//                                 ))}
//                             </select>
//                             <span className="text-danger"></span>
//                         </div>

//                         <div className="mb-3">
//                             <select className="form-control" id="quanHuyenSelect" onChange={this.handleDistrictChange} disabled={isAllCity}>
//                                 <option value="" selected hidden>Chọn quận huyện</option>
//                                 {!isAllCity && (
//                                     <option key="allDistrict" value="allDistrict">Tất cả</option>
//                                 )}
//                                 {listDistrict.map(district =>(
//                                     <option key={district.id} value={district.id}>{district.full_name}</option>
//                                 ))}
//                             </select>
//                             <span className="text-danger"></span>
//                         </div>

//                         <div className="mb-3">
//                             <select className="form-control" id="phuongXaSelect" disabled={isAllDistrict} >
//                                 <option value="" selected hidden>Chọn phường xã</option>
//                                 {!isAllDistrict && (
//                                     <option key="allWards" value="allWards">Tất cả</option>
//                                 )}
                               
//                                 {listWards.map(ward =>(
//                                     <option key={ward.id} value={ward.id}>{ward.full_name}</option>
//                                 ))}
//                             </select>
//                             <span className="text-danger"></span>
//                         </div> */}
//                         <FormLocation />

//                         <div className="form-floating mb-4">
//                             <select className="form-control" id="loaiPhongSelect">
//                                 <option value="" disabled selected hidden>Chọn loại phòng</option>
//                                 <option value="">Tất cả</option>
//                                 {listRoomType.map(roomType => (
//                                     <option value={roomType.roomTypeId} key={roomType.roomTypeId}>{roomType.typeRomName}</option>
//                                 ))}
//                             </select>
//                             <label className="control-label">Loại phòng</label>
//                         </div>

//                         <div className="submit-group">
//                             <input type="submit" value="Lọc" className="btn btn-primary" />
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         );
//     }
// }

// export default ListPost;

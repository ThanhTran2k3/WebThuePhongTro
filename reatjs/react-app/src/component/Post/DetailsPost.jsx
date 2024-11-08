import React, { useEffect, useState } from "react";
import {getPostDetail } from "../../api/postApi";
import { Link, useNavigate, useParams } from 'react-router-dom';
import PostCard from "./PostCard";


const DetailsPost = () => {
    const [post, setPost] = useState({})
    const [user, setUser] = useState({})
    const [listPost, setListPost] = useState([])
    const [isShowPhone, setIsShowPhone] = useState(false);
    const { postId } = useParams()
    const navigate = useNavigate()


    useEffect(() => {
        const fetchData = async () => {
            const result = await getPostDetail(postId,navigate);
            setPost(result.post)
            setUser(result.userCreate)
            setListPost(result.posts)
        };
        window.scrollTo(0, 0); 
        fetchData();
    }, [postId,navigate]);

    const handlePhoneClick = () => {
        setIsShowPhone(!isShowPhone); 
    };

    const timeAgo = (postedAt)=> {
        const now = new Date();
        const postedDate = new Date(postedAt);
        const diffMs = now - postedDate;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);
        const diffMonth = Math.floor(diffDay / 30);
    
        if(diffMonth>0){
            return `${diffMonth} tháng trước`;
        }
        else if (diffDay > 0) {
            return `${diffDay} ngày trước`;
        } else if (diffHour > 0) {
            return `${diffHour} giờ trước`;
        } else if (diffMin > 0) {
            return `${diffMin} phút trước`;
        } else {
            return `${diffSec} giây trước`;
        }
    }


    return (
        Object.keys(post).length > 0 && (
            <div>
                <div className="d-flex">
                <div className="detail-post ">
                    <div className="gap-3 info-post bg-white border">
                        <div className="table-responsive text-nowrap">
                            {post.postImages.map(image =>(
                                <img  key={image.postImageId} src={`http://localhost:8080${image.urlImage}`} className="post-image" alt="Hình ảnh bài đăng"/>
                            ))}
                            
                        </div>
    
                        <div className="d-flex justify-content-end w-100">
                            <div className="favorite-button">
                                <a href="/BaiDangs/AddYeuThich?id=item.BaiDangId&nameAction=Index">
                                    <button className="heart-button">
                                        <i className="far fa-heart"></i>
                                    </button>
                                </a>
                            </div>
                        </div>

                        
                        <h1 className="title mb-4">{post.title}</h1>

                        <span className="mb-4 baseFont price">
                            {post.rentPrice.toLocaleString()+' đ/tháng'}
                            <span className="lead baseFont baseColor ml-5"> - {post.area} m<sup>2</sup></span>
                        </span>

                        <p className="lead mb-4">
                            <i className="fas fa-map-marker-alt w-20"></i>
                            <span className="baseFont baseColor ml-5">{post.address +', '+post.wards+', '+post.district+', '+post.city}</span>
                        </p>

                        <p className="lead mb-4">
                            <i className="fas fa-clock"></i>
                            <span className="baseFont baseColor ml-5">Đăng: {timeAgo(post.postingDate)}</span>
                        </p>

                        

                        {post.approvalStatus === true ? (
                            <p className="lead mb-4">
                                <i className="fa-solid fa-check"></i>
                                <span className="baseFont baseColor"> Tin đã kiểm duyệt</span> 
                            </p>
                        ):(
                            <p className="lead mb-4">
                                <i className="fa-solid fa-xmark w-20"></i>
                                <span className="baseFont baseColor"> Tin chưa được kiểm duyệt</span> 
                            </p>
                        )}
                        
                        {post.postCategory && post.postCategory.postCategoryId === 3 && (
                            <p className="lead mb-4">
                                <i className="fa-solid fa-medal"></i>
                                <span className="baseFont baseColor ml-5">Tin ưu tiên</span>
                            </p>
                        )}
                            
                    </div>

                    <div className="features-post bg-white border">
                        <h5 className="my-2 text-center">Đặc điểm</h5>

                        <div className="d-flex">
                            <div className="feature-item">
                                <p className="lead mb-4">
                                    <i className="fa-solid fa-chart-area"></i>
                                    <span className="baseFont baseColor ml-5">Diện tích: {post.area} m<sup>2</sup></span>
                                </p>
                            </div>

                            <div className="feature-item">
                                <p className="lead mb-4">
                                    <i className="fa-solid fa-money-bill-wave "></i>
                                    <span className="baseFont baseColor ml-5"> Tiền thuê: {post.rentPrice.toLocaleString()+' đ'}/tháng</span>
                                </p>
                            </div>
                        </div>

                        <div className="d-flex">
                            <p className="lead mb-4">
                                <i className="fa-solid fa-file-invoice-dollar w-20"></i> 
                                <span className="baseFont baseColor ml-5">Tiền cọc: {post.deposit.toLocaleString()+ ' đ'}</span>
                            </p>
                        </div>
                    </div>

                    <div className="description-post gap-3 bg-white border">
                        <h5 className="my-2 text-center">Mô tả</h5>
                        <pre className="baseFont baseColor pre-wrap">{post.description}</pre>
                    </div>

                    {Array.isArray(listPost) && listPost.length > 0 && (
                        <div className="suggestions bg-white border">
                            <h5 className="my-2 text-center">Gợi ý</h5>
                            <div className="table-responsive suggestion-items">
                                {listPost.map(item => (
                                    <PostCard
                                        key={item.postId}
                                        postId={item.postId}
                                        filteredAnh={item.postImages}
                                        postCategory={item.postCategory}
                                        title={item.title}
                                        area={item.area}
                                        rentPrice={item.rentPrice}
                                        city={item.city}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                </div>


                <div className="info-user border">
                    <div className="details-user">
                        <img src={`http://localhost:8080${user.avatar}`} alt="" className="avatar" />
                        <h4 className="p-5px text-center">{user.userName}</h4>
                       

                        <button onClick={handlePhoneClick} className="button-info phone-number">
                            <label>
                                <i className="fa-solid fa-phone"></i>
                                <span>{isShowPhone?user.phoneNumber:user.phoneNumber.replace(/\d{6}$/,"******")}</span>
                            </label>
                        </button>
                        <Link to={`/user/${user.userName}`} >
                            <button className="button-info view-info">Xem trang</button>
                        </Link>
                        
                    </div>
                </div>

                </div>
                
                    

                
            </div>
        ) 
    )

};

export default DetailsPost;

// class DetailsPost extends React.Component{
//     state = {
//         post: {}
//     }
//     componentDidMount() {

//         const { postId } = this.props.params;
//         this.loadPost(postId)
            
         
//     }

//     loadPost = async(postId)=>{
//         const data = await getPostById(postId)
//         this.setState({post:data})
//     }
   
//     formatCurrency(amount) {
//         if (amount === undefined || amount === null) {
//             return 'N/A';
//         }
//         return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' đ';
//     }
    
//     timeAgo(postedAt) {
//         const now = new Date();
//         const postedDate = new Date(postedAt);
//         const diffMs = now - postedDate;
//         const diffSec = Math.floor(diffMs / 1000);
//         const diffMin = Math.floor(diffSec / 60);
//         const diffHour = Math.floor(diffMin / 60);
//         const diffDay = Math.floor(diffHour / 24);
//         const diffMonth = Math.floor(diffDay / 30);
    
//         if(diffMonth>0){
//             return `${diffMonth} tháng trước`;
//         }
//         else if (diffDay > 0) {
//             return `${diffDay} ngày trước`;
//         } else if (diffHour > 0) {
//             return `${diffHour} giờ trước`;
//         } else if (diffMin > 0) {
//             return `${diffMin} phút trước`;
//         } else {
//             return `${diffSec} giây trước`;
//         }
//     }

//     render(){
//         const { post } = this.state;
//         return(
//             Object.keys(post).length > 0 ? (
//                 <div>
//                     <div className="d-flex">
//                     <div className="detail-post">
//                         <div className="gap-3 info-post">
//                             <div className="table-responsive text-nowrap">
//                                 {post.postImages.map(image =>(
//                                     <img src={`http://localhost:8080/${image.urlImage}`} className="post-image" alt="Hình ảnh bài đăng"/>
//                                 ))}
                                
//                             </div>
        
//                             <div className="d-flex justify-content-end w-100">
//                                 <div className="favorite-button">
//                                     <a href="/BaiDangs/AddYeuThich?id=item.BaiDangId&nameAction=Index">
//                                         <button className="heart-button">
//                                             <i className="far fa-heart"></i>
//                                         </button>
//                                     </a>
//                                 </div>
//                             </div>

                            
//                             <h1 className="title mb-4">{post.title}</h1>

//                             <span className="mb-4 baseFont price">
//                                 {this.formatCurrency(post.rentPrice)+' /tháng'}
//                                 <span className="lead baseFont mb-4 baseColor ml-5"> - {post.area} m<sup>2</sup></span>
//                             </span>

//                             <p className="lead mb-4">
//                                 <i className="fas fa-map-marker-alt w-20"></i>
//                                 <span className="baseFont baseColor ml-5">{post.address +', '+post.wards+', '+post.district+', '+post.city}</span>
//                             </p>

//                             <p className="lead mb-4">
//                                 <i className="fas fa-clock"></i>
//                                 <span className="baseFont baseColor ml-5">Đăng: {this.timeAgo(post.postingDate)}</span>
//                             </p>

                            

//                             {post.approvalStatus === true ? (
//                                 <p className="lead mb-4">
//                                     <i className="fa-solid fa-check"></i>
//                                     <span className="baseFont baseColor"> Tin đã kiểm duyệt</span> 
//                                 </p>
//                             ):(
//                                 <p className="lead mb-4">
//                                     <i className="fa-solid fa-xmark w-20"></i>
//                                     <span className="baseFont baseColor"> Tin chưa được kiểm duyệt</span> 
//                                 </p>
//                             )}
                            
//                             {post.postCategory && post.postCategory.postCategoryId === 3 && (
//                                 <p className="lead mb-4">
//                                     <i className="fa-solid fa-medal"></i>
//                                     <span className="baseFont baseColor ml-5">Tin ưu tiên</span>
//                                 </p>
//                             )}
                                
//                         </div>

//                         <div className="features-post">
//                             <h5 className="my-2">Đặc điểm</h5>

//                             <div className="d-flex">
//                                 <div className="feature-item">
//                                     <p className="lead mb-4">
//                                         <i className="fa-solid fa-chart-area"></i>
//                                         <span className="baseFont baseColor ml-5">Diện tích: {post.area} m<sup>2</sup></span>
//                                     </p>
//                                 </div>

//                                 <div className="feature-item">
//                                     <p className="lead mb-4">
//                                         <i className="fa-solid fa-money-bill-wave "></i>
//                                         <span className="baseFont baseColor ml-5"> Tiền thuê: {this.formatCurrency(post.rentPrice)}/ tháng</span>
//                                     </p>
//                                 </div>
//                             </div>

//                             <div className="d-flex">
//                                 <p className="lead mb-4">
//                                     <i className="fa-solid fa-file-invoice-dollar w-20"></i> 
//                                     <span className="baseFont baseColor ml-5">Tiền cọc: {this.formatCurrency(post.deposit)}</span>
//                                 </p>
//                             </div>
//                         </div>

//                         <div className="description-post gap-3">
//                             <h5 className="my-2">Mô tả</h5>
//                             <pre className="baseFont baseColor pre-wrap">{post.description}</pre>
//                         </div>
//                     </div>


//                     <div className="info-user">
//                         <div className="avatar-user">
//                             <img src={`http://localhost:8080/images/0.26365870559140553.jpg/`} className="avatar" />
//                         </div>
                        
//                         <div className="details-user">
//                             <h4 className="p-5px">Tên Người Dùng</h4>
//                             <p className="location">
//                                 <i className="fas fa-map-marker-alt"></i>
//                                 <span className="baseFont baseColor ml-5">Tỉnh thành</span>
//                             </p>

//                             <button id="sdtButton" className="phone-number">1234567*****</button>
//                             <div id="sdtUser" className="d-none" data-action="" ></div>
//                             <a href="/User/Details/username" >
//                                 <button className="view-profile">Xem trang</button>
//                             </a>
                            
//                         </div>
//                     </div>

//                     </div>
//                     <div className="suggestions">
//                     <h4>Gợi ý</h4>
//                     <div className="suggestion-items">
//                         <div className="card">
//                             <img src="suggestion_image_url" className="img-fluid" alt="Hình ảnh gợi ý"/>
//                             <div className="card-body">
//                                 <a href="/BaiDangs/Details/item_id" className="item-title">Tên Bài Đăng</a>
//                                 <span className="item-area">50 m<sup>2</sup></span>
//                                 <p className="item-price">1,000,000 đ/ tháng</p>
//                                 <p className="item-location">
//                                     <i className="fas fa-map-marker-alt"></i> Tỉnh thành
//                                 </p>
//                                 <p className="item-username">
//                                     <i className="fa-solid fa-user"></i>
//                                     <a href="/User/Details/username">Tên Người Dùng</a>
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                     </div>
//                 </div>
//             ): (
//                 <p>No user data available.</p>
//             )  
//         )
//     }

// }
// export default withRouter(DetailsPost)
import React, { useEffect, useState } from 'react';
import { getNear, getNewPost, getPostLocation } from '../../api/postApi';
import PostCard from './PostCard';
import { Link } from 'react-router-dom';
import { getAddress } from '../../api/mapApi';
import Slider from 'react-slick';
import Post from './Post';

const Home = () => {
    const [listNewPost, setNewListPost] = useState([])
    const [listNearPost, setNearListPost] = useState([])
    const [listHCMPost, setHCMListPost] = useState([])
    const [listHNPost, setHNListPost] = useState([])
    const [location, setLocation] = useState(null);
    const [address, setAddress] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
           const newPost = await getNewPost()
           setNewListPost(newPost)
           const hcmPost = await getPostLocation("Hồ Chí Minh")
           setHCMListPost(hcmPost)
           const hnPost = await getPostLocation("Hà Nội")
           setHNListPost(hnPost)
        }
        fetchData();
    }, []); 

    useEffect(() => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
            },
            
          );
        } 
        
      }, []);
      


 
    useEffect(() => {
        const fetchData = async () => {
           if(location){
            const result = await getAddress(location)
            const nearPost = await getNear(result)
            setAddress(result)
            setNearListPost(nearPost)
        }
        };
        fetchData();
    }, [location]); 

    const settings = {
        autoplay: true,
        dots: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 3,
        infinite: false, 
    };

    return (
        <div className="mt-5 mb-5 main-home">
            <div className='w-100 mb-4 banner-home d-flex'>
                <img src='/hcm.jpg' alt='' className='w-50'/>
                <Link to={'/new'} state={{city: 'Thành phố Hồ Chí Minh'}}>
                    <p className="image-text">TP. Hồ Chí Minh</p>
                </Link>
                <div className='div-images'>
                    <img src='/hn.jpg' alt='' className='h-50' />
                    <Link to={'/new'} state={{city: 'Thành phố Hà Nội'}}>
                        <p className="image-text-right-top">TP. Hà Nội</p>
                    </Link>
                    <img src='/dn.jpg' alt='' className='h-50' />
                    <Link to={'/new'} state={{city: 'Thành phố Đà Nẵng'}}>
                        <p className="image-text-right-bottom">TP. Đà Nẵng</p>
                    </Link>
                </div>
            </div>
            
            {listNewPost.length !==0 && (
                <div className="bg-light border rounded">
                    <div className='d-flex justify-content-between align-items-center'>
                        <h5 className="m-3">Mới nhất</h5>
                        <Link to={'/new'} className="btn btn-outline-dark mt-2 mb-2 me-5">
                            Xem thêm
                        </Link>
                    </div>
                    <div className="m-3" >
                    
                        {listNewPost.map(item => (
                            <Post
                                key={item.postId}
                                postId={item.postId}
                                filteredAnh={item.postImages}
                                postCategory={item.postCategory}
                                title={item.title}
                                area={item.area}
                                rentPrice={item.rentPrice}
                                district = {item.district}
                                city={item.city}
                                userName={item.userName}
                            />
                        ))}
                    </div>
                    {/* <div className="d-flex justify-content-center mt-3">
                            <Link to={'/new'} className="btn btn-outline-dark mb-3">
                                Xem thêm
                            </Link>
                    </div> */}
                </div>
            )}


            {listNearPost.length !==0 && (
                <div className="bg-light border rounded mt-4">
                <div className='d-flex justify-content-between align-items-center'>
                    <h5 className="m-3">Gần nhất</h5>
                            <Link to={'/near'} state={{address: address}} className="btn btn-outline-dark mt-2 mb-2 me-5">
                                Xem thêm
                            </Link>
   
                </div>
                   
                    <div className="post-items d-flex m-3" >
                
                        {listNearPost.map(item => (
                            <PostCard
                                key={item.postId}
                                postId={item.postId}
                                filteredAnh={item.postImages}
                                postCategory={item.postCategory}
                                title={item.title}
                                area={item.area}
                                rentPrice={item.rentPrice}
                                city={item.city}
                                userName={item.userName}
                            />
                        ))}
                        
                    </div>
                    {/* <div className="d-flex justify-content-center mt-3">
                            <Link to={'/new'} className="btn btn-outline-dark mb-3">
                                Xem thêm
                            </Link>
                    </div> */}
                </div>
            )}

            
            {listHCMPost.length !== 0 && (
                <div className="bg-white border mt-4">
                    <div className='d-flex justify-content-between align-items-center'>
                        <h5 className="m-3">TP. Hồ Chí Minh</h5>
                        <Link to={'/new'} state={{city: 'Thành phố Hồ Chí Minh'}} className="btn btn-outline-dark mt-2 mb-2 me-5">
                            Xem thêm
                        </Link>
                    </div>
                   
                    <div className='m-3'>
                        <Slider {...settings}>
                            {listHCMPost.map((item) => (
                                <PostCard
                                    key={item.postId}
                                    postId={item.postId}
                                    filteredAnh={item.postImages}
                                    postCategory={item.postCategory}
                                    title={item.title}
                                    area={item.area}
                                    rentPrice={item.rentPrice}
                                    city={item.city}
                                    userName={item.userName}
                                />
                            ))}
                        </Slider>
                        {/* <div className="d-flex justify-content-center mt-3">
                            <Link to={'/new'} className="btn btn-outline-dark mb-3">
                                Xem thêm
                            </Link>
                        </div> */}
                    </div>
                </div>
            )}

            {listHNPost.length !== 0 && (
                <div className="bg-white border mt-4">
                    <div className='d-flex justify-content-between align-items-center'>
                        <h5 className="m-3">Hà Nội</h5>
                        <Link to={'/new'} state={{city: 'Thành phố Hà Nội'}} className="btn btn-outline-dark mt-2 mb-2 me-5">
                            Xem thêm
                        </Link>
                    </div>
                    
                    <div className='m-3'>
                        <Slider {...settings}>
                            {listHNPost.map((item) => (
                                <PostCard
                                    key={item.postId}
                                    postId={item.postId}
                                    filteredAnh={item.postImages}
                                    postCategory={item.postCategory}
                                    title={item.title}
                                    area={item.area}
                                    rentPrice={item.rentPrice}
                                    city={item.city}
                                    userName={item.userName}
                                />
                            ))}
                        </Slider>
                        {/* <div className="d-flex justify-content-center mt-3">
                            <Link to={'/new'} className="btn btn-outline-dark mb-3">
                                Xem thêm
                            </Link>
                        </div> */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
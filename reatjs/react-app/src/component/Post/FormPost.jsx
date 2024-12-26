import React, { useEffect, useState } from 'react';
import { addPost } from "../../api/postApi";
import { getRoomType } from '../../api/roomTypeApi';
import FormLocation from './FormLocation';
import { useLocation } from 'react-router-dom';
import { editPost } from '../../api/postApi';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../UserContext';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { getCoordinates } from '../../api/mapApi';

const FormPost = (props) => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const { userInfo  } = useUser();
    const [listImage, setListImage] = useState([])
    const [listRoomType, setListRoomType] = useState([])
    const location = useLocation().pathname;
    const [post, setPost] = useState(props.post);
    const navigate = useNavigate();
    const [center, setCenter] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null)
    const [selectedDistrict, setSelectedDistrict] = useState(null)
    const [selectedWard, setSelectedWard] = useState(null)
    const [debouncedQuery, setDebouncedQuery] = useState(""); 
    const containerStyle = {
        width: "100%",
        height: "100%",
    };
      
    useEffect(() => {
        if(Object.keys(post).length ===0){
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                  setCenter({
                      lat: position.coords.latitude,
                      lng: position.coords.longitude,
                      });
                  },
                  
                );
              } 
        }
       
    }, [post]);

    useEffect(()=>{
        if (props.post) {
            setPost(props.post);  
            setSelectedCity(props.post.city)
            setSelectedDistrict(props.post.district)
            setSelectedWard(props.post.ward)
        }
        const fetchData = async () => {
            await loadRoomType()
        };
        fetchData();
    },[props.post])

    useEffect(() => {
        const timer = setTimeout(() => {
          setDebouncedQuery(post.address); 
        }, 500);
    
        return () => clearTimeout(timer); 
      }, [post.address]);

    useEffect(() => {
        const fetchCoordinates = async () => {
            const address = debouncedQuery +', '+selectedWard+', '+selectedDistrict+', '+selectedCity
            const coords = await getCoordinates(address);
            if (coords) {
                setCenter(coords);
            }
        };
        if(selectedCity)
            fetchCoordinates();
    }, [debouncedQuery,selectedWard,selectedDistrict,selectedCity]);

    

    const loadRoomType = async () =>{
        const data = await getRoomType()
       setListRoomType(data)
    }

    const handleSubmit = async (event) => {

        event.preventDefault()
        const formData = new FormData()
        formData.append('title', event.target.title.value);
        formData.append('area', event.target.area.value);
        formData.append('rentPrice', event.target.rentPrice.value);
        formData.append('deposit', event.target.deposit.value);
        if(event.target.city.selectedOptions[0].text!=="Chọn tỉnh thành")
            formData.append('city', event.target.city.selectedOptions[0].text);
        if(event.target.district.selectedOptions[0].text!=="Chọn quận huyện")
            formData.append('district', event.target.district.selectedOptions[0].text);
        if(event.target.wards.selectedOptions[0].value!=="Chọn phường xã")
            formData.append('wards', event.target.wards.selectedOptions[0].text);
        formData.append('address', event.target.address.value);
        formData.append('latitude', center.lat);
        formData.append('longitude', center.lng);
        formData.append('description', event.target.description.value);
        formData.append('roomType', event.target.roomType.value);

        const files = event.target.file.files; 
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        if(location==='/user/manager/post/create'){
            await addPost(formData,userInfo,navigate)
        }
        else
            await editPost(formData,post.postId,userInfo,navigate)
    }

    const handleImageSelect = (event) => {
        const files = Array.from(event.target.files);
        const imageUrls = files.map(file => URL.createObjectURL(file));
        setListImage(imageUrls)
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setPost((prevPost) => ({
            ...prevPost,
            [name]: value
        }));
      };

    return (
        <div>
            <div className="row">
                <div className="col-md-12 ">
                        <form onSubmit={handleSubmit}>
                            <div className="form-03-main w-100">
                                <div className="text-danger"></div>
                                    <div className="d-flex">
                                        <div className="w-50">
                                            <div className="form-floating mb-4">
                                                <input value={post.title || ''} onChange={handleInputChange} className="form-control" name="title" required />
                                                <label  className="control-label">Tiêu đề</label>
                                                <span className="text-danger"></span>
                                            </div>

                                            <div className="form-floating mb-4">
                                                <input  value={post.area || ''} onChange={handleInputChange} type="number" min="1" step="0.1" className="form-control" name="area" required />
                                                <label className="control-label">Diện tích</label>
                                                <span  className="text-danger"></span>
                                            </div>
                                        </div>
                                        <div className='w-50 ms-3'>
                                            <div className="form-floating mb-4">
                                                <input value={post.rentPrice||''} onChange={handleInputChange} min="0" type="number" step="1000" className="form-control" name="rentPrice" required />
                                                <label className="control-label">Tiền thuê</label>
                                                <span asp-validation-for="TienThue" className="text-danger"></span>
                                            </div>

                                            <div className="form-floating mb-4">
                                                <input value={post.deposit||''} onChange={handleInputChange} min="0" type="number" step="1000" className="form-control" name="deposit" required />
                                                <label className="control-label">Tiền cọc</label>
                                                <span asp-validation-for="TienCoc" className="text-danger"></span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="d-flex">
                                        <div className='w-50'>
                                            <FormLocation 
                                                city = {props.post.city}
                                                district = {props.post.district}
                                                ward = {props.post.wards}
                                                setSelectedCity = {setSelectedCity}
                                                setSelectedDistrict = {setSelectedDistrict}
                                                setSelectedWard = {setSelectedWard}
                                            />
                                            <div className="form-floating mb-4">
                                                <input value={post.address || ''} onChange={handleInputChange} className="form-control" name="address" required />
                                                <label className="control-label">Địa chỉ</label>
                                                <span className="text-danger"></span>
                                            </div>
                                        </div>
                                        <div className='w-50 mb-4 ms-3'>
                                            <LoadScript googleMapsApiKey={apiKey}>
                                                {center && (
                                                    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
                                                        <Marker position={center} />
                                                    </GoogleMap>
                                                )}
                                            </LoadScript>
                                        </div>
                                    </div>

                               

                                <div className="form-floating mb-4">
                                    <textarea value={post.description || ''} onChange={handleInputChange} className="form-control w-100 he-200" name="description" required></textarea>
                                    <label className="control-label">Mô tả</label>
                                    <span asp-validation-for="MoTa" className="text-danger"></span>
                                </div>

                                <div className="form-floating mb-4">
                                    <select className="form-control" name="roomType" required>
                                        <option value="0" selected hidden>Chọn loại phòng</option>
                                        {listRoomType.map(roomType =>(
                                            <option value={roomType.roomTypeId} selected={post&&post.roomType?roomType.roomTypeId===post.roomType.roomTypeId:false} key={roomType.roomTypeId}>{roomType.typeRoomName}</option>
                                        ))}
                                    </select>
                                    <label className="control-label">Loại phòng</label>
                                </div>

                                <div className="mb-4">
                                    <input type="file" id="imageInput" name="file" accept="image/*" onChange={handleImageSelect} multiple required={!post}/>
                                    <div className="d-flex flex-wrap">
                                        {listImage.map((image, index)  =>(
                                            <img key={index} src={image} alt={`preview ${index}`} className="previewImages"/>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="_btn_04">
                                        <button type="submit" className="btn createButton">{location==='/user/manager/post/create'?'Tạo mới':'Lưu'}</button>
                                    </div>
                                </div>
                                
                                <div className="text-center">
                                    <a href="#fttr">Trở về</a>
                                </div>


                            </div>

                        </form>
                </div>
            </div>
        </div>
    );
};

export default FormPost;
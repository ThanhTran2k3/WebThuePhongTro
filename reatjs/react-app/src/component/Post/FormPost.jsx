import React, { useEffect, useState } from 'react';
import { addPost } from "../../api/postApi";
import { getRoomType } from '../../api/roomTypeApi';
import FormLocation from './FormLocation';
import { useLocation } from 'react-router-dom';
import { editPost } from '../../api/postApi';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../UserContext';

const FormPost = (props) => {
    const { userInfo  } = useUser();
    const [listImage, setListImage] = useState([])
    const [listRoomType, setListRoomType] = useState([])
    const location = useLocation().pathname;
    const [post, setPost] = useState(props.post);
    const navigate = useNavigate();

    useEffect(()=>{
        if (props.post) {
            setPost(props.post);  
        }
        const fetchData = async () => {
            await loadRoomType()
        };
        fetchData();
    },[props.post])

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
        formData.append('city', event.target.city.selectedOptions[0].text);
        formData.append('district', event.target.district.selectedOptions[0].text);
        formData.append('wards', event.target.wards.selectedOptions[0].text);
        formData.append('address', event.target.address.value);
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
                                    <div className="w-50 mr-50">
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

                                    <div className="w-50">
                                        {/* <div class="form-floating mb-4">
                                            
                                            <select class="form-control he-58" name="city" onChange={this.handleCityChange} required>
                                                <option disabled selected hidden>Chọn tỉnh thành</option>
                                                {listCity.map(city=>(
                                                    <option value={city.id} key={city.id}>{city.full_name}</option>
                                                ))}
                                            </select>
                                            <label class="control-label">Tỉnh thành</label>
                                            <span class="text-danger"></span>
                                        </div>
                                        <div class="form-floating mb-4">
                                            <select class="form-control he-58" name="district"  onChange={this.handleDistrictChange} disabled={isAllCity} required>
                                                <option value="" selected hidden>Chọn quận huyện</option>
                                                {listDistrict.map(district=>(
                                                    <option value={district.id} key={district.id}>{district.full_name}</option>
                                                ))}
                                            </select>
                                            <label class="control-label">Quận huyện</label>
                                        </div>
                                        <div class="form-floating mb-4">
                                            <select class="form-control he-58" name="wards" disabled={isAllDistrict} required>
                                                <option value="" selected hidden>Chọn phường xã</option>
                                                {listWards.map(ward=>(
                                                    <option value={ward.id} key={ward.id}>{ward.full_name}</option>
                                                ))}
                                            </select>
                                            <label class="control-label">Phường xã</label>
                                        </div> */}

                                        <FormLocation 
                                            city = {props.post.city}
                                            district = {props.post.district}
                                            ward = {props.post.wards}
                                        />



                                        <div className="form-floating mb-4">
                                            <input value={post.address || ''} onChange={handleInputChange} className="form-control" name="address" required />
                                            <label className="control-label">Địa chỉ</label>
                                            <span asp-validation-for="DiaChi" className="text-danger"></span>
                                        </div>
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
                                            <option value={roomType.roomTypeId} selected={post&&post.postCategory?roomType.roomTypeId===post.postCategory.postCategoryId:false} key={roomType.roomTypeId}>{roomType.typeRoomName}</option>
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
                                        <button type="submit" className="btn createButton">{location==='/post/create'?'Tạo mới':'Lưu'}</button>
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
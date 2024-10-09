import React, { useEffect, useState } from 'react';
import { getPostById } from "../../api/postApi";
import FormPost from './FormPost';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../../UserContext';

const EditPost = () => {
    const { userInfo  } = useUser();
    const [post, setPost] = useState({})
    const { postId } = useParams()
    const navigate = useNavigate()
    useEffect(()=>{
        const fetchData = async () => {
            const post = await getPostById(userInfo,postId,navigate);
            setPost(post)
        };
        fetchData();
    },[postId,userInfo,navigate])
    return (
        <div>
            <FormPost
                post = {post}
            />
        </div>
    );
};

export default EditPost;



// class EditPost extends React.Component {
//     state = {
//         listCity: [],
//         listDistrict: [],
//         listWards: [],
//         listRoomType: [],
//         listImage: [],
//         isAllCity: false,
//         isAllDistrict: false,
//         post: {},
//     };

//     componentDidMount = async () =>{
//         const { postId } = this.props.params;
//         await this.loadPost(postId)
//         await this.loadCities()
//         await this.loadRoomType();
//         this.updateLocationData();
//     }

//     updateLocationData = async () => {
//         const { post, listCity } = this.state;
    
//         const city = listCity.find(item => item.full_name === post.city);
//         if (city) {
//           this.setState({ selCity: city });
//           await this.loadDistricts(city.id);
          
//         }
//         if (this.state.listDistrict.length > 0) {
//           const district = this.state.listDistrict.find(item => item.full_name === post.district);
//           if (district) {
//             await this.loadWards(district.id);
//           }
//         }
//       };
    

//     loadPost = async(postId)=>{
//         const data = await getPostById(postId)
//         this.setState({post:data})
//     }

//     loadRoomType = async () =>{
//         const data = await getRoomType()
//         this.setState({listRoomType: data})
//     }

//     loadCities = async()=>{
//         const data = await getCities()
//         this.setState({listCity: data})
//     }

//     handleCityChange = (event)=>{
//         const selectedCityId = event.target.value;
//         this.setState({isAllCity:false,isAllDistrict:true,listDistrict:[],listWards:[]})
//         this.loadDistricts(selectedCityId)
//     }

//     loadDistricts = async (selectedCityId)=>{
//         const data = await getDistricts(selectedCityId)
//         this.setState({listDistrict:data})
//     }

//     handleDistrictChange = (event) =>{
//         const selectedDistrictId = event.target.value;
//         this.setState({isAllDistrict:false,listWards: []})
//         this.loadWards(selectedDistrictId)

//     }

//     loadWards = async (selectedDistrictId)=>{
//         const data = await getWards(selectedDistrictId)
//         this.setState({listWards:data})
//     }


//     handleSubmit = async (event) => {

//         event.preventDefault();

//         const formData = new FormData()
//         formData.append('title', event.target.title.value);
//         formData.append('area', event.target.area.value);
//         formData.append('rentPrice', event.target.rentPrice.value);
//         formData.append('deposit', event.target.deposit.value);
//         formData.append('city', event.target.city.selectedOptions[0].text);
//         formData.append('district', event.target.district.selectedOptions[0].text);
//         formData.append('wards', event.target.wards.selectedOptions[0].text);
//         formData.append('address', event.target.address.value);
//         formData.append('description', event.target.description.value);
//         formData.append('roomType', event.target.roomType.value);

    
//         const files = event.target.file.files; 
//         for (let i = 0; i < files.length; i++) {
//             formData.append('file', files[i]);
//         }
//         await editPost(formData)
//     }

//     handleImageSelect = (event) => {
//         const files = Array.from(event.target.files);
//         const imageUrls = files.map(file => URL.createObjectURL(file));
//         this.setState({listImage: imageUrls})
//     };

//     handleInputChange = (event) => {
//         const { name, value } = event.target;
//         this.setState({
//           post: {
//             ...this.state.post,
//             [name]: value 
//           }
//         });
//       };

//     render(){
//         const { post, listCity, listDistrict, listWards, listRoomType, listImage, isAllCity, isAllDistrict } = this.state
//         return(
//             // <div class="row">
//             //     <div class="col-md-12 ">
//             //             <form onSubmit={this.handleSubmit}>
//             //                 <div class="form-03-main w-100">
//             //                     <h2>Edit Post</h2>
//             //                     <div class="text-danger"></div>
//             //                     <div className="d-flex">
//             //                         <div className="w-50 mr-50">
//             //                             <div class="form-floating mb-4">
//             //                                 <input class="form-control" value={post.title} onChange={this.handleInputChange} name="title" required />
//             //                                 <label  class="control-label">Tiêu đề</label>
//             //                                 <span class="text-danger"></span>
//             //                             </div>

//             //                             <div class="form-floating mb-4">
//             //                                 <input type="number" min="1" step="0.1" value={post.area} onChange={this.handleInputChange} class="form-control" name="area" required />
//             //                                 <label class="control-label">Diện tích</label>
//             //                                 <span  class="text-danger"></span>
//             //                             </div>

//             //                             <div class="form-floating mb-4">
//             //                                 <input min="0" type="number" step="1000" value={post.rentPrice} onChange={this.handleInputChange} class="form-control" name="rentPrice" required />
//             //                                 <label class="control-label">Tiền thuê</label>
//             //                                 <span asp-validation-for="TienThue" class="text-danger"></span>
//             //                             </div>

//             //                             <div class="form-floating mb-4">
//             //                                 <input min="0" type="number" step="1000" value={post.deposit} onChange={this.handleInputChange} class="form-control" name="deposit" required />
//             //                                 <label class="control-label">Tiền cọc</label>
//             //                                 <span asp-validation-for="TienCoc" class="text-danger"></span>
//             //                             </div>




//             //                         </div>

//             //                         <div className="w-50">
//             //                             <div class="form-floating mb-4">
//             //                                 <select class="form-control he-58" name="city" id="city" onChange={this.handleCityChange} required>
//             //                                     <option value="" disabled selected hidden>Chọn tỉnh thành</option>
//             //                                     {listCity.map(city=>(
//             //                                         <option value={city.id} selected={city.full_name===post.city} key={city.id}>{city.full_name}</option>
//             //                                     ))}
//             //                                 </select>
//             //                                 <label class="control-label">Tỉnh thành</label>
//             //                                 <span class="text-danger"></span>
//             //                             </div>
//             //                             <div class="form-floating mb-4">
//             //                                 <select class="form-control he-58" name="district"  onChange={this.handleDistrictChange}  disabled={isAllCity} required>
//             //                                     <option value="" selected hidden>Chọn quận huyện</option>
//             //                                     {listDistrict.map(district=>(
//             //                                         <option value={district.id} selected={district.full_name===post.district}  key={district.id}>{district.full_name}</option>
//             //                                     ))}
//             //                                 </select>
//             //                                 <label class="control-label">Quận huyện</label>
//             //                             </div>
//             //                             <div class="form-floating mb-4">
//             //                                 <select class="form-control he-58" name="wards" disabled={isAllDistrict} required>
//             //                                     <option value="" selected hidden>Chọn phường xã</option>
//             //                                     {listWards.map(ward=>(
//             //                                         <option value={ward.id}  selected={ward.full_name===post.wards} key={ward.id}>{ward.full_name}</option>
//             //                                     ))}
//             //                                 </select>
//             //                                 <label class="control-label">Phường xã</label>
//             //                             </div>



//             //                             <div class="form-floating mb-4">
//             //                                 <input class="form-control" value={post.address} onChange={this.handleInputChange} name="address" required />
//             //                                 <label class="control-label">Địa chỉ</label>
//             //                                 <span asp-validation-for="DiaChi" class="text-danger"></span>
//             //                             </div>
//             //                         </div>

//             //                     </div>

//             //                     <div class="form-floating mb-4">
//             //                         <textarea class="form-control w-100 he-200" value={post.description} onChange={this.handleInputChange} name="description" required></textarea>
//             //                         <label class="control-label">Mô tả</label>
//             //                         <span asp-validation-for="MoTa" class="text-danger"></span>
//             //                     </div>

//             //                     <div class="mb-4">
//             //                         <select class="form-control" value={post.postCategory && post.postCategory.postCategoryId?post.postCategory.postCategoryId:''} name="roomType" required>
//             //                             <option value="" disabled selected hidden>Chọn loại phòng</option>
//             //                             {listRoomType.map(roomType =>(
//             //                                 <option value={roomType.roomTypeId} key={roomType.roomTypeId}>{roomType.typeRomName}</option>
//             //                             ))}
//             //                         </select>
//             //                     </div>

//             //                     <div class="mb-4">
//             //                         <input type="file" id="imageInput" name="file" accept="image/*" onChange={this.handleImageSelect} multiple required/>
//             //                         <div class="d-flex flex-wrap">
//             //                             {listImage.map((image, index)  =>(
//             //                                 <img key={index} src={image} alt={`preview ${index}`} className="previewImages"/>
//             //                             ))}
//             //                         </div>
//             //                     </div>

//             //                     <div class="mb-4">
//             //                         <div class="_btn_04">
//             //                             <button type="submit" class="btn createButton">Save</button>
//             //                         </div>
//             //                     </div>
                                
//             //                     <div class="text-center">
//             //                         <a href="#">Back to List</a>
//             //                     </div>


//             //                 </div>

//             //             </form>
//             //     </div>
//             // </div>
//             <>
//                 <FormPost
//                     post = {post}
                
//                 />
//             </>
//         )
//     }
// };

// export default withRouter(EditPost);
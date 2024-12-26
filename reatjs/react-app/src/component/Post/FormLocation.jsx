import React, { useState, useEffect } from 'react';
import { getCities, getDistricts, getWards } from '../../api/locationApi';
import { useLocation, useParams } from 'react-router-dom';

const FormLocation = (props) => {

    const [listCity, setListCity] = useState([])
    const [listDistrict, setListDistrict] = useState([])
    const [listWards, setListWards] = useState([])
    const [disDistrict, setDisDistrict] = useState(true)
    const [disWards, setDisWards] = useState(true)
    const location = useLocation().pathname;
    const { postId } = useParams();


    useEffect(() => {
        const fetchData = async () => {
            const cities = await getCities();
            setListCity(cities);
    
            if (location.startsWith('/user/manager/edit/profile')|| location.startsWith('/user/manager/post/edit')) {
                setDisDistrict(false);
                setDisWards(false);
    
                if (cities.length > 0) {
                    const city = cities.find(item => item.full_name === props.city);
                    if (city) {
                        const districts = await getDistricts(city.id);
                        setListDistrict(districts);
                        if (districts.length > 0) {
                            const district = districts.find(item => item.full_name === props.district);
                            if (district) {
                                const wards = await getWards(district.id);
                                setListWards(wards);
                            }
                        }
                    }
                }
            }
        };
        fetchData()
      }, [location, postId, props.city, props.district]); 
    
    

    const handleCityChange = (event)=>{
        const selectedCityId = event.target.value;
        if(props.setSelectedCity){
            const selectedCityName = event.target.value==='0'?null:event.target.options[event.target.selectedIndex].text;
            props.setSelectedCity(selectedCityName)
            if(!selectedCityName){
                props.setSelectedCity(null)
                props.setSelectedDistrict(null)
                props.setSelectedWard(null)
            }
        }
           
        setListDistrict([])
        setListWards([])

        const shouldLoadDistricts = location==='/new'?selectedCityId!=="0":true

        setDisDistrict(!shouldLoadDistricts)
        setDisWards(true)

        if(shouldLoadDistricts)
            loadDistricts(selectedCityId)
        
    }

    const loadDistricts = async (selectedCityId)=>{
        const data = await getDistricts(selectedCityId)
        setListDistrict(data)
    }

    const handleDistrictChange = (event) =>{
        const selectedDistrictId = event.target.value;
        if(props.setSelectedDistrict){
            const selectedDistrictName = event.target.value==='0'?null:event.target.options[event.target.selectedIndex].text;
            props.setSelectedDistrict(selectedDistrictName)
        }
        setListWards([])
        

        const shouldLoadWards = location==='/new'?selectedDistrictId!=="0":true
        setDisWards(!shouldLoadWards)
        if(shouldLoadWards)
            loadWards(selectedDistrictId)
        

    }

    const handleWardChange = (event) =>{
        if(props.setSelectedWard){
            const selectedWardName = event.target.value==='0'?null:event.target.options[event.target.selectedIndex].text;
            props.setSelectedWard(selectedWardName)
        }
    }

    const loadWards = async (selectedDistrictId)=>{
        const data = await getWards(selectedDistrictId)
        setListWards(data)
    }



    return (
        <div className={`${(location.startsWith('/user/manager/edit/profile') || location.startsWith('/user/manager/post/edit') || location.startsWith('/user/manager/post/create')) ? '' : 'd-flex'}`}>
            <div className="form-floating mb-4">
                <select className="form-control he-58 form-select"  name="city" onChange={handleCityChange} required>
                    <option disabled selected hidden>Chọn tỉnh thành</option>
                    {location==='/new' &&(
                        <option value="0">Toàn quốc</option>
                    )}
                    {listCity.map(city=>(
                        <option value={city.id} selected={city.full_name===props.city} key={city.id}>{city.full_name}</option>
                    ))}
                </select>
                <label className="control-label">Tỉnh thành</label>
            </div>
            <div className="form-floating mb-4">
                <select className="form-control he-58 form-select" name="district"  onChange={handleDistrictChange} disabled={disDistrict} required>
                    <option selected hidden>Chọn quận huyện</option>
                    {!disDistrict && location==='/new' && (
                        <option value="0">Tất cả</option>
                    )}
                    {listDistrict.map(district=>(
                        <option value={district.id} selected={district.full_name===props.district} key={district.id}>{district.full_name}</option>
                    ))}
                </select>
                <label className="control-label">Quận huyện</label>
            </div>
            <div className="form-floating mb-4">
                <select className="form-control he-58 form-select" name="wards" onChange={handleWardChange} disabled={disWards} required>
                    <option selected hidden>Chọn phường xã</option>
                    {!disWards &&location==='/new' && (
                        <option value="0">Tất cả</option>
                    )}
                    {listWards.map(ward=>(
                        
                        <option value={ward.id} selected={ward.full_name===props.ward} key={ward.id}>{ward.full_name}</option>
                    ))}
                </select>
                <label className="control-label">Phường xã</label>
            </div>
        </div>
    );
};

export default FormLocation;
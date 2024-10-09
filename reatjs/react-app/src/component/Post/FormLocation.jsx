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
        setListDistrict([])
        setListWards([])

        const shouldLoadDistricts = location==='/'?selectedCityId!=="allCity":true

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
        
        setListWards([])
        

        const shouldLoadWards = location==='/'?selectedDistrictId!=="allDistrict":true
        setDisWards(!shouldLoadWards)
        if(shouldLoadWards)
            loadWards(selectedDistrictId)
        

    }

    const loadWards = async (selectedDistrictId)=>{
        const data = await getWards(selectedDistrictId)
        setListWards(data)
    }



    return (
        <div>
            <div className="form-floating mb-4">
                <select className="form-control he-58" name="city" onChange={handleCityChange} required>
                    <option disabled selected hidden>Chọn tỉnh thành</option>
                    {location==='/' &&(
                        <option key="allCity" value="allCity">Toàn quốc</option>
                    )}
                    {listCity.map(city=>(
                        <option value={city.id} selected={city.full_name===props.city} key={city.id}>{city.full_name}</option>
                    ))}
                </select>
                <label className="control-label">Tỉnh thành</label>
                <span className="text-danger"></span>
            </div>
            <div className="form-floating mb-4">
                <select className="form-control he-58" name="district"  onChange={handleDistrictChange} disabled={disDistrict} required>
                    <option value="" selected hidden>Chọn quận huyện</option>
                    {!disDistrict && location==='/' && (
                        <option key="0" value="allDistrict">Tất cả</option>
                    )}
                    {listDistrict.map(district=>(
                        <option value={district.id} selected={district.full_name===props.district} key={district.id}>{district.full_name}</option>
                    ))}
                </select>
                <label className="control-label">Quận huyện</label>
            </div>
            <div className="form-floating mb-4">
                <select className="form-control he-58" name="wards" disabled={disWards} required>
                    <option value="" selected hidden>Chọn phường xã</option>
                    {!disWards &&location==='/' && (
                        <option key="0" value="allWards">Tất cả</option>
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
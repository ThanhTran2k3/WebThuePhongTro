import axios from 'axios';

const locationApi = 'https://esgoo.net/api-tinhthanh';

export const getCities = async () => {

    try{
        const response  = await axios.get(`${locationApi}/1/0.htm`)
        return response.data.data
    } catch (error) {
        console.error('Error get cities:', error);
        return []; 
    }
};

export const getDistricts = async (cityId) => {

    try{
        const response = await axios.get(`${locationApi}/2/${cityId}.htm`)
        return response.data.data
    }catch(error){
        console.error('Error get districts:', error);
    }
};

export const getWards = async (districtId) => {
    try{
        const response = await axios.get(`${locationApi}/3/${districtId}.htm`)
        return response.data.data
    }catch(error){
        console.error('Error get wards:', error);
        return [];
    }
};

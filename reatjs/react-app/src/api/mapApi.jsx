import axios from 'axios';
const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

export const getCoordinates = async (address) => {
    try {
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
        );
        const data = response.data;  
        if (data.results.length > 0) {
            return data.results[0].geometry.location; 
        }
        return null; 
    } catch (error) {
        console.error("Error fetching coordinates:", error);  
        return null;
    }
}

export const getAddress = async (location) => {
    try {
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.latitude},${location.longitude}&key=${apiKey}`
        );
        const data = response.data;  
        if (data.results.length > 0) {
            return data.results[3].formatted_address; 
        }
        return null; 
    } catch (error) {
        console.error("Error fetching coordinates:", error);  
        return null;
    }
}


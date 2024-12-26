import React, { useEffect, useState } from 'react';
import { useUser } from '../../UserContext';
import { useParams } from 'react-router-dom';
import { getServiceById } from '../../api/serviceApi';
import FormService from './FormService';

const EditService = () => {
    const { userInfo  } = useUser();
    const [service, setService] = useState({})
    const { serviceId } = useParams()

    useEffect(()=>{
        const fetchData = async () => {
            const service = await getServiceById(serviceId);
            setService(service)
        };
        fetchData();
       
    },[serviceId,userInfo])

    return (
        <div>
            <FormService
                service = {service}
            />
        </div>
    );
};

export default EditService;
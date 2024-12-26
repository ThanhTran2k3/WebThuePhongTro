import React, { useEffect } from 'react';
import { useUser } from '../../UserContext';
import { useNavigate } from 'react-router-dom';
import FormService from './FormService';

const CreateService = () => {
    const { userInfo  } = useUser();
    const navigate = useNavigate()

    useEffect(()=>{
        if (!userInfo) {
            navigate('/login');
        }
    })
    return (
        <div>
            <FormService
                service = {{}}
            />
        </div>
    );
};

export default CreateService;
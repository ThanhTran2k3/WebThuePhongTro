import React, { useEffect, useState } from 'react';
import PostList from '../Post/PostList';
import { useNavigate } from 'react-router-dom';

const ApprovePost = () => {
    
    const [activeButton, setActiveButton] = useState('postDisplays');
    const [selectedAction, setSelectedAction] = useState(<PostList/>);
    const navigate = useNavigate()


    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName)
        navigate('');
    };
    useEffect(()=>{
        if (activeButton) {
            setSelectedAction(<PostList postType={activeButton}/>)
        }
    },[activeButton])

    return (
        
        <div className='manager-post'>
            <div className='btn-postpption'>
                <button className={`btn ${activeButton==='postDisplays'?'red-underline':''}`} onClick={() => handleButtonClick('postDisplays')}>
                    Tin đang hiển thị
                </button>
                <button className={`btn ${activeButton==='postPending'?'red-underline':''}`} onClick={() => handleButtonClick('postPending')}>
                    Tin chờ duyệt
                </button>
                <button className={`btn ${activeButton==='postRejected'?'red-underline':''}`} onClick={() => handleButtonClick('postRejected')}>
                    Tin bị từ chối
                </button>
            </div>
                <div style={{ flex: 1}}>
                    {selectedAction}
                </div>
            </div>
    );
};

export default ApprovePost;
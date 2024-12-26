import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Pagination } from '@mui/material';
import { getListService, showService } from '../../api/serviceApi';
import { useUser } from '../../UserContext';

const Service = () => {
    const { userInfo } = useUser();
    const [listService, setListService] = useState([])
    const [activeButton, setActiveButton] = useState('show');
    const [totalPage, setTotalPage] = useState()
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState(true);   
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const pageUrl = queryParams.get('page');
    const pageNum = pageUrl ? Number(pageUrl) : 1; 
    const navigate = useNavigate()
    const [reload, setReload] = useState(false);

    useEffect(()=>{
        const fetchData = async () => {
            const result = await getListService(pageNum,status);
            setListService(result.content);
            setTotalPage(result.totalPage);
            setPage(result.currentPage);
        };
        fetchData();
    },[pageNum,status,reload])

    useEffect(() => {
        if (activeButton) {
            if (activeButton === 'show') {
                setStatus(true);
            } else {
                setStatus(false);
            }
        }
    }, [activeButton]);

    const handleButtonClick = async(buttonName) => {
        setActiveButton(buttonName)
        navigate('');
    };

    const handlePageChange = async (event,value) => {
        navigate(`?page=${value}`);
        window.scrollTo(0, 0); 
    };

    const handleShow = async(serviceId) =>{
        await showService(userInfo,serviceId)
        setReload(!reload)
    }

    return (
        <div className='manager-post'>
            <div className='btn-postpption'>
                <button className={`btn ${activeButton==='show'?'red-underline':''}`} onClick={() => handleButtonClick('show')}>
                    Đang hiện
                </button>
                <button className={`btn ${activeButton==='hidden'?'red-underline':''}`} onClick={() => handleButtonClick('hidden')}>
                    Đang ẩn
                </button>
                
            </div>

            <table class="table table-hover">
                <thead>
                    <tr>
                        <th class="text-center w-25" >
                            Dịch vụ
                        </th>
                        <th class="text-center w-25" >
                            Giá tiền
                        </th>
                        <th className='w-25'></th>
                    </tr>
                </thead>
                <tbody>
                    {listService&&listService.length !== 0 &&(
                        listService.map((service) =>(
                            <tr className='bg-light' key={service.serviceId}>
                                <td className="text-center pt-3" >
                                {service.serviceName}
                                </td>
                                <td class="text-center pt-3">
                                    <label>{service.price}</label>
                                </td>
                                <td  >
                                    <Link to={`/admin/manager/service/edit/${service.serviceId}`} className='btn btn-outline-dark button me-2'>
                                        Chỉnh sửa
                                    </Link>

                                    <button class="btn btn-outline-dark button" onClick={() => handleShow(service.serviceId)}>
                                        <i className={`${service.status?'fa-solid fa-eye-slash':'fa-solid fa-eye'} w-20`}></i>
                                        <span className='baseFont ps-1'>{service.status?'Ẩn':'Hiện'}</span>
                                    </button>
                                </td>
                            </tr>
                        ))
                    )} 
                </tbody>
            </table>
                {listService&&listService.length !== 0 &&(
                    <div className="d-flex justify-content-center mt-5">
                        <Pagination count={totalPage} page={page} onChange={handlePageChange}  variant="outlined" shape="rounded" />
                    </div>
                )}
        </div>
    );
};

export default Service;
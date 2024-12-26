import React, { useEffect, useMemo, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { useUser } from '../../UserContext';
import { getStatistic, getStatisticByTime } from '../../api/invoiceApi';
import { useNavigate } from 'react-router-dom';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Statistical = () => {
  const { userInfo } = useUser();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [cost, setCost] = useState([]);
  const [service, setService] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState();
  const [costTime, setCostTime] = useState([]);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();


  const month = useMemo(() => {
    const months = [];
    for (let i = 1; i <= 12; i++) {
      months.push(`Tháng ${i}`);
    }
    return months;
  }, []); 
  const year = [];
  for (let i = new Date().getFullYear(); i >=2020; i--){
    year.push(i);
  }

  useEffect(()=>{
      const fetchData = async () =>{
          const result = await getStatistic(userInfo,selectedYear,navigate)
          const costData = month.map(monthName => result[monthName] || 0);
          setCost(costData);
      }

      fetchData()
  },[userInfo,selectedYear,navigate,month])


  const handleYearChange = (event) => {
    setSelectedYear(Number(event.target.value));
    setShow(false)
  };

  const data = {
    labels: month,
    datasets: [
      {
        label: 'Doanh thu',
        data: cost,
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',   
          'rgba(54, 162, 235, 0.5)',   
          'rgba(255, 206, 86, 0.5)',   
          'rgba(75, 192, 192, 0.5)',    
          'rgba(153, 102, 255, 0.5)',  
          'rgba(255, 159, 64, 0.5)',    
          'rgba(100, 149, 237, 0.5)',   
          'rgba(255, 140, 0, 0.5)',    
          'rgba(0, 128, 128, 0.5)',   
          'rgba(218, 112, 214, 0.5)',  
          'rgba(60, 179, 113, 0.5)',    
          'rgba(240, 128, 128, 0.5)'  
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',    
          'rgba(54, 162, 235, 1)',    
          'rgba(255, 206, 86, 1)',    
          'rgba(75, 192, 192, 1)',   
          'rgba(153, 102, 255, 1)',   
          'rgba(255, 159, 64, 1)',   
          'rgba(100, 149, 237, 1)',  
          'rgba(255, 140, 0, 1)',    
          'rgba(0, 128, 128, 1)',     
          'rgba(218, 112, 214, 1)',  
          'rgba(60, 179, 113, 1)',    
          'rgba(240, 128, 128, 1)'   
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Biểu đồ doanh thu ${selectedYear}`,
      },
    },
    onClick: async (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        setSelectedMonth(index + 1);
        if (index + 1 === selectedMonth) {
          setShow(!show);
        } else {
          const result = await getStatisticByTime(userInfo, index + 1, selectedYear, navigate);
          const services = Object.keys(result);
          setService(services);
          const costData = services.map(serviceName => result[serviceName] || 0);
          setCostTime(costData);
          setShow(true);
        }
      }
    },
  };


  const data1 = {
    labels: service,
    datasets: [
      {
        data: costTime,
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',   
          'rgba(54, 162, 235, 0.5)',   
          'rgba(255, 206, 86, 0.5)',   
          'rgba(75, 192, 192, 0.5)',    
          'rgba(153, 102, 255, 0.5)',  
          'rgba(255, 159, 64, 0.5)',    
          'rgba(100, 149, 237, 0.5)',   
          'rgba(255, 140, 0, 0.5)',    
          'rgba(0, 128, 128, 0.5)',   
          'rgba(218, 112, 214, 0.5)',  
          'rgba(60, 179, 113, 0.5)',    
          'rgba(240, 128, 128, 0.5)'  
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',    
          'rgba(54, 162, 235, 1)',    
          'rgba(255, 206, 86, 1)',    
          'rgba(75, 192, 192, 1)',   
          'rgba(153, 102, 255, 1)',   
          'rgba(255, 159, 64, 1)',   
          'rgba(100, 149, 237, 1)',  
          'rgba(255, 140, 0, 1)',    
          'rgba(0, 128, 128, 1)',     
          'rgba(218, 112, 214, 1)',  
          'rgba(60, 179, 113, 1)',    
          'rgba(240, 128, 128, 1)'   
        ],
        borderWidth: 1,
      },
    ],
  };

  const options1 = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Doanh thu dịch vụ tháng ${selectedMonth}/${selectedYear}`,
      },
    },
  };

  return (
    <div className="row">
      <div className="w-75 mt-2">
        <label className='me-2' htmlFor="year-select">Chọn năm: </label>
        <select className="year-select" value={selectedYear} onChange={handleYearChange}>
          {year.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
          <Bar data={data} options={options} className='h-75' />
      </div>
      {show&&(
        <div className="w-25 mt-5">
          <Pie data={data1} options={options1} className='h-75' />
        </div>
      )}
      
    </div>
  );
};

export default Statistical;

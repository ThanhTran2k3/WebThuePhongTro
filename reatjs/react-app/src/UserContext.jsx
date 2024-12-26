import React, { createContext, useState, useContext, useEffect  } from 'react';
import { refreshToken } from './api/authApi';


const UserContext = createContext();


export const UserProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(() => {
        const savedUser = sessionStorage.getItem('userinfo');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [postOfUser, setPostOfUser] = useState([]);

    useEffect(() => {
      
      if (userInfo) {
        const timeoutId = setInterval(async() => {
          await refreshToken(userInfo,updateUser)
        }, 50 * 60 * 1000);

        return () => clearInterval(timeoutId);
      }
    }, [userInfo]);

    
  const updateUser = (newUserInfo) => {
    setUserInfo((prev) => ({
      ...prev,
      ...newUserInfo
    }));
  };
  const updatePostOfUser = (newListPost) => {
      setPostOfUser(newListPost);
  }; 
  const logout = () => {
    setUserInfo(null);
    sessionStorage.removeItem('userinfo');
  };

  return (
    <UserContext.Provider value={{ userInfo, updateUser,logout, setUserInfo,updatePostOfUser,postOfUser }}>
      {children}
    </UserContext.Provider>
  );
};


export const useUser = () => useContext(UserContext);

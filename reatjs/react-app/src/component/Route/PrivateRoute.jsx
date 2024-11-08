import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../../UserContext';

const PrivateRoute = ({ roles }) => {
    const { userInfo } = useUser();

    const hasAccess = roles.some(role => userInfo.roles.includes(role));

  if (!hasAccess) {
    return <Navigate to="/404" replace />; 
  }

  return <Outlet />; 
};

export default PrivateRoute;

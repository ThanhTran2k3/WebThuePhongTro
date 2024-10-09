
import './App.css';
import HeaderWeb from './component/headerWeb/HeaderWeb.jsx';
import FooterWeb from './component/footerWeb/FooterWeb.jsx';
import ListPost from './component/Post/ListPost.jsx';
import DetailsPost from './component/Post/DetailsPost.jsx';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from './component/Auth/Register.jsx';
import Login from './component/Auth/Login.jsx';
import Error from './component/error/Error.jsx';
import UserDashboard from './component/User/UserDashboard.jsx';
import { UserProvider } from './UserContext.jsx';
import UserInfo from './component/User/UserInfo.jsx';
import FavoritePost from './component/Post/FavoritePost.jsx';
import ChatApp from './component/Chat/ChatApp.jsx';
import PostList from './component/Post/PostList.jsx';


function App() {



  return (
    <Router>
    <UserProvider>
    <div className="wrapper">
        <HeaderWeb/>
        <div className='main-content'>
          <Routes>
            <Route path="/" element={<ListPost />} />
            <Route path="/post/:postId" element={<DetailsPost />} />
            <Route path='/register' element={<Register />}/>
            <Route path='/login' element={<Login />}/>
            <Route path='/user/:userName' element={<UserInfo/>}/>
            <Route path="/user/manager/payment" element={<UserDashboard />} />
            <Route path="/user/manager/post/create" element={<UserDashboard />} />
            <Route path="/user/manager/post" element={<UserDashboard />} />
            <Route path="/user/manager/edit/profile" element={<UserDashboard />} />
            <Route path="/user/manager/post/edit/:postId" element={<UserDashboard />} />
            <Route path="/user/manager/post/extend/:postId" element={<UserDashboard />} />
            <Route path="/user/manager/post/service/:postId" element={<UserDashboard />} />
            <Route path="/user/manager/payment/history" element={<UserDashboard />} />
            <Route path="/user/manager/change/password" element={<UserDashboard />} />
            <Route path='/user/manager' element={<UserDashboard/>}/>
            <Route path='/user/favorite/post' element={<FavoritePost/>}/>
            <Route path="/chat" element={<ChatApp />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </div>
       
        <FooterWeb/>
      </div>
      </UserProvider>
    </Router>
  );
}

export default App;
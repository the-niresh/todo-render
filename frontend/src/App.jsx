import { Route, Routes, useLocation } from 'react-router-dom';
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import EmailVerifyPage from "./pages/EmailVerifyPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

import Navbar from "./components/Navbar";

import { Toaster } from "react-hot-toast";
import { useContext } from "react";
import { AppContent } from "./context/app.context";
import DashBoardPage from "./pages/DashBoardPage";
import NotificationsPage from "./pages/NotificationsPage";
import TodoList from "./pages/TodoList";
import SidePanel from "./components/SidePanel";
import TodoBoard from './pages/TodoBoard';
import ProfilePage from './pages/ProfilePage';
import Footer from './components/Footer';

export default function App() {
  const {userData} = useContext(AppContent)
  const location = useLocation();

  //  className='flex h-screen overflow-hidden'
  
  return (
    <div>
      {/* <div className="absolute inset-0 -z-50 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]"></div> */}
      {/* <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_150%_at_50%_10%,#000_40%,#63e_100%)]"></div> */}
      <Navbar />
      {/* {userData && <SidePanel />} */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/email-verify" element={<EmailVerifyPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        {userData && <Route path="/dashboard" element={<DashBoardPage />} />}
        {userData && <Route path='/todo-list' element={<TodoList />} />}
		    {userData && <Route path='/todo-board' element={<TodoBoard />} />}
		    {userData && <Route path='/notifications' element={<NotificationsPage />} />}
		    {userData && <Route path='/profile' element={<ProfilePage />} />}
      </Routes>
      <Toaster />
      
    </div>
  )
}
import { useContext, useState } from "react";
import { IoPerson } from "react-icons/io5";
import { IoIosMail } from "react-icons/io";
import { RiLockPasswordFill, RiAdminFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/app.context";
import axios from "axios";
import toast from "react-hot-toast";

const LoginPage = () => {

  const navigate = useNavigate();

  const { backendURL, setIsLoggedIn, getUserData } = useContext(AppContent);

  const [ state, setState] = useState('Login.!!')
  const [ name, setName] = useState("")
  const [ email, setEmail] = useState("")
  const [ password, setPassword] = useState("")

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true;
      if(state === 'Sign Up.!!') {
        const {data} = await axios.post(backendURL + "/api/auth/signup", {name,email,password});
        if(data.success) {
          setIsLoggedIn(true)
          getUserData()
          navigate("/")
        }
        else{
          toast.error(data.message)
        }
      }
      else {
        const {data} = await axios.post(backendURL + "/api/auth/login", {email,password});
        if(data.success) {
          setIsLoggedIn(true)
          getUserData()
          navigate("/")
        }
        else{
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
	<div className="flex flex-col items-center justify-center min-h-screen">
    {/* TODO: add fradient to the below div */}
    <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
      <h2 className="text-3xl font-semibold text-white text-center mb-3">{state === "Sign Up.!!" ? "Create account..!!" : "Login.!!"}</h2>
      <p className="text-center text-sm mb-6">{state === "Sign Up.!!" ? "Create your account..!!" : "Login to you account..!!"}</p>
      
      <form onSubmit={onSubmitHandler}>
        {state === "Sign Up.!!" && (
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
          <IoPerson />
          <input type="text" placeholder="Full Name" required className="bg-transparent outline-none"
          onChange={e => setName(e.target.value)} value={name} />
        </div>
        )}
        
        <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
          <IoIosMail />
          <input type="email" placeholder="Email" required className="bg-transparent outline-none"
          onChange={e => setEmail(e.target.value)} value={email} />
        </div>

        <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
          <RiLockPasswordFill />
          <input type="password" placeholder="••••••••" required className="bg-transparent outline-none"
          onChange={e => setPassword(e.target.value)} value={password} />
        </div>

        <p className="mb-4 text-indigo-500 cursor-pointer" onClick={() => navigate("/reset-password")}>Forgot Password.?!</p>

        <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900"
        >{state}</button>
      </form>

      {state === "Sign Up.!!" ? (
        <p className="text-gray-400 text-center text-xs mt-4">
        Already have an Account.?{" "}
        <span className="text-blue-400 cursor-pointer underline" onClick={() => setState("Login..!!")}>
          Login
        </span>
      </p>
      ) : (
        <p className="text-gray-400 text-center text-xs mt-4">
        Don't have an Account.?{" "}
        <span className="text-blue-400 cursor-pointer underline" onClick={() => setState("Sign Up.!!")}>
          Sign Up
        </span>
      </p>
      )}
    </div>
  </div>
  )
}

export default LoginPage
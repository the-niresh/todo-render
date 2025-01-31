import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { IoIosMail } from "react-icons/io";
import React, { useContext, useState } from "react";
import { AppContent } from "../context/app.context";
import axios from "axios";
import { RiLockPasswordFill } from "react-icons/ri";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {

  axios.defaults.withCredentials = true;
  const { backendURL, isLoggedin, userData, getUserData } = useContext(AppContent);

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState('');
  const [OTP, setOTP] = useState(0);
  const [isOTPSubmitted, setIsOTPSubmitted ] = useState(false);

  const inputRefs = React.useRef([]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmitEmail = async (e) => {
    try {
      e.preventDefault();
      // const OTParray = inputRefs.current.map((e) => e.value);
      // const OTP = OTParray.join("");

      const { data } = await axios.post(
        backendURL + "/api/auth/verify-account",
        { OTP }
      );
      if (data.success) {
        toast.success("OTP verified");
        getUserData();
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onSubmitOTP = async (e) => {
      e.preventDefault();
      const OTParray = inputRefs.current.map((e) => e.value);
      setOTP(OTParray.join(''));
      setIsOTPSubmitted(true);
  };
  const onSubmitPassword = async (e) => {
    e.preventDefault();
    try {
      const {data} = await axios.post(backendURL + '/api/auth/reset-password',{OTP, email, newPassword});
      console.log("####",data)
      data.success ? toast.success("password reset successful") : toast.error(data.message)
      data.success && navigate('/login')
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Navbar />
      {/* to enter the email */}
      {!isEmailSent && 
      <form onSubmit={onSubmitEmail} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Reset Password
        </h1>
        <p className="text-center mb-6 text-indigo-300">
          Enter your registered Email address
        </p>
        <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
          <IoIosMail />
          <input
            type="email"
            placeholder="Email"
            required
            className="bg-transparent outline-none text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full">
          Submit
        </button>
      </form>
    }

      {/* OTP Input form */}
      {!isOTPSubmitted && isEmailSent &&
      <form
        className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        onSubmit={onSubmitOTP}
      >
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Reset Password OTP
        </h1>
        <p className="text-center mb-6 text-indigo-300 ">
          Enter the 6-digit code sent to your email id
        </p>
        <div className="flex justify-between mb-8" onPaste={handlePaste}>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                type="text"
                maxLength="1"
                key={index}
                required
                className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
                ref={(e) => (inputRefs.current[index] = e)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
        </div>
        <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full">
          Verify OTP
        </button>
      </form>
      }

      {/* form to enter new password */}
      {isOTPSubmitted && isEmailSent && 
      <form onSubmit={onSubmitPassword} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          New Password
        </h1>
        <p className="text-center mb-6 text-indigo-300">
          Enter the new Password
        </p>
        {/* <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
          <IoIosMail />
          <input
            type="email"
            placeholder="Email"
            required
            className="bg-transparent outline-none text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div> */}
        <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
          <RiLockPasswordFill />
          <input
            type="password"
            placeholder="••••••••"
            required
            className="bg-transparent outline-none text-white"
            onChange={(e) => setNewPassword(e.target.value)}
            value={newPassword}
          />
        </div>
        <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full">
          Submit
        </button>
      </form>
      }

    </div>
  );
};

export default ResetPasswordPage;

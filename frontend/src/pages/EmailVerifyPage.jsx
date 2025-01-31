import React, { useContext, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { AppContent } from "../context/app.context";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { IoIosMail } from "react-icons/io";

const EmailVerifyPage = () => {
  axios.defaults.withCredentials = true;
  const { backendURL, isLoggedin, userData, getUserData } =
    useContext(AppContent);
  const [state, setState] = useState("Emailing");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();
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

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const OTParray = inputRefs.current.map((e) => e.value);
      const OTP = OTParray.join("");

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

  const onSendingVerifyOTP = async () => {
    console.log("000");
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        backendURL + "/api/auth/send-verify-otp"
      );
      console.log("000", data);
      if (data.success) {
        navigate("/email-verify");
        toast.success("OTP sent to you email successfully");
      } else {
        toast.error("OTP sending failed");
      }
    } catch (error) {
      console.log("***");
      toast.error("error in sending OTP");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Navbar />
      {/* form to send an OTP to the registered email */}
      {/* filling OTP screen */}
      <div>
        {state === "Emailing" && (
          <form
            onSubmit={onSendingVerifyOTP}
            className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
          >
            <h1 className="text-white text-2xl font-semibold text-center mb-4">
              Verify your mail
            </h1>
            <p className="text-center mb-6 text-indigo-300">
              To verify your mail please click on the button below to send
              verification mail
            </p>
            {/* <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
          <IoIosMail />
          <input
            type="email"
            placeholder={email}
            required
            className="bg-transparent outline-none text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          </div> */}
            <button
              onClick={() => setState("OTPing")}
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full"
            >
              Verify Email
            </button>
          </form>
        )}

        {state === "OTPing" && (
          <form
            className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
            onSubmit={onSubmitHandler}
          >
            <h1 className="text-white text-2xl font-semibold text-center mb-4">
              Verify the OTP
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
            <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full">
              Verify OTP
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EmailVerifyPage;

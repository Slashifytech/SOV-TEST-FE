import React, { useState } from "react";
import AgentSidebar from "../components/dashboardComp/AgentSidebar";
import Header from "../components/dashboardComp/Header";
import { BsKeyFill } from "react-icons/bs";
import PasswordField from "../components/reusable/PasswordField";
import { toast } from "react-toastify";
import { changePassowrd } from "../features/authApi";
import { changePasswordData } from "../features/generalApi";
import Sidebar from "../components/dashboardComp/Sidebar";

import socketServiceInstance from "../services/socket";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ChangeDashboardPassword = () => {
  const { agentData } = useSelector((state) => state.agent);
  const { studentInfoData } = useSelector((state) => state.student);
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const [isPassword, setIsPassword] = useState({
    password: "",
    newPassword: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showConPassword, setShowConPassword] = useState(false);

  const userId =
    role === "3"
      ? studentInfoData?.data?.studentInformation?._id
      : agentData?._id;

  const handleInput = (e) => {
    const { name, value } = e.target;
    if (name === "confirmPassword") {
      setConfirmPassword(value);
    } else {
      setIsPassword((prev) => ({ ...prev, [name]: value }));
    }
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConPasswordVisibility = () => setShowConPassword((prev) => !prev);

  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);

  const handleSubmit = async () => {
    if (isPassword.newPassword !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      return;
    }

    try {
      const res = await changePasswordData(isPassword);
      toast.success(
        
          "Your password has been successfully updated. Please log in using your new password to regain access to your account"
      );
      if (socketServiceInstance.isConnected()) {
        //from agent to admin
        const data = { userId: userId, reason: "password changed" };

        socketServiceInstance.socket.emit("DELETE_AUTH_TOKEN", data);
      } else {
        console.error("Socket connection failed, cannot emit notification.");
      }
      localStorage.removeItem("student");
      localStorage.removeItem("role");
      localStorage.removeItem("userAuthToken");
      navigate("/login");

      setErrors({});
    } catch (error) {
      console.log(error);
      toast.error(error?.message || "Something went wrong");
    }
  };

  return (
    <>
      <Header customLink="/agent/shortlist" />
      <div>
        <span className="fixed overflow-y-scroll scrollbar-hide bg-white">
          {role === "2" ? <AgentSidebar /> : <Sidebar />}
        </span>
      </div>
      <div className="font-poppins">
        <span className="flex md:flex-row sm:flex-col md:items-center bg-white mt-16 md:ml-[16.5%] sm:ml-[22%]  pb-6">
          <span>
            <p className="text-[28px] font-bold text-sidebar mt-6 ml-9">
              Change Password
            </p>
            <p className="mt-1 md:font-normal sm:font-light text-body md:pr-[8%] sm:pr-[20%] ml-9">
              Edit your password
            </p>
          </span>
        </span>

        <div className="flex flex-row gap-2 items-center mb-2 md:ml-[31.5%] md:mr-[16%] sm:ml-[26%] mt-12 text-[20px] sm:mx-[22%]  text-secondary">
          <span>
            <BsKeyFill />
          </span>
          <span className="font-semibold">Password</span>
        </div>
        <div className="bg-white rounded-md mb-20 md:ml-[31.5%] md:mr-[16%] px-8 py-6 sm:ml-[26%] sm:mr-6">
          <PasswordField
            name="password"
            value={isPassword.password}
            handleInput={handleInput}
            label="Current Password"
            showPassword={showPassword}
            toggleVisibility={togglePasswordVisibility}
            error={errors.password}
          />

          <div className="mt-6">
            <PasswordField
              name="newPassword"
              value={isPassword.newPassword}
              handleInput={handleInput}
              label="New Password"
              showPassword={showConPassword}
              toggleVisibility={toggleConPasswordVisibility}
              error={errors.newPassword}
            />
            <p className="text-[13px] text-primary pt-[9px] font-poppins">
              Use 10 or more characters including - alphabets, numbers and
              special characters.
            </p>
          </div>
          <div className="mt-6">
            <PasswordField
              name="confirmPassword"
              label="Confirm New Password"
              value={confirmPassword}
              handleInput={handleInput}
              showPassword={showConfirmPassword}
              toggleVisibility={toggleConfirmPasswordVisibility}
              error={errors.confirmPassword}
            />
          </div>
          <div
            onClick={handleSubmit}
            className="text-white cursor-pointer bg-primary text-center py-2 rounded-md mt-9"
          >
            Submit
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangeDashboardPassword;

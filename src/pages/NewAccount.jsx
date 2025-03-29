import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdSupportAgent } from "react-icons/md";
import { FaBookOpenReader } from "react-icons/fa6";
import { logo } from "../assets";
import Footer from "../components/Footer";
import ImageComponent from "../components/reusable/Input";
import Mobile from "../components/Mobile";
const NewAccount = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedRole === "student") {
      navigate("/student-signup", { state: "passPage" });
    } else if (selectedRole === "agent") {
      navigate("/agent-signup", {state: "passPage"});
    }
  };

  return (
    <>
    <Mobile/>
    <div className="sm:block md:block hidden">
    <div className="flex flex-col min-h-screen">
      <header>
        <span className="flex flex-row justify-between items-center mx-6">
        <a href="https://sovportal.in" className="cursor-pointer">
          <ImageComponent src={logo} alt="logo" className="w-40 h-24" />
        </a>

          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 rounded-md bg-primary text-white"
          >
            Login
          </button>
        </span>
      </header>

      <main className="flex-grow">
        <div className="flex flex-col justify-center items-center md:pt-10 sm:pt-36 xl:pt-32">
          <p className="font-bold text-[40px]">
            Create <span className="text-primary">Your Account</span>
          </p>
          <p className="text-secondary font-semibold text-[19px] md:px-[36%] sm:px-[25%] text-center pt-2">
            Welcome to SOV Portal
          </p>

          <span
            className={`flex flex-row items-center justify-center mt-9 text-[22px] text-[#303031] bg-white px-6 py-3 rounded-md md:w-[35%] ${
              selectedRole === "student" ? "border border-primary" : ""
            }`}
            onClick={() => setSelectedRole("student")}
          >
            <span className="mr-5 p-4 bg-[#F4F4F4]">
              <FaBookOpenReader />
            </span>
            <span className="pr-40 text-[20px]">I am a Student</span>
            <span>
              <input
                type="radio"
                checked={selectedRole === "student"}
                onChange={() => setSelectedRole("student")}
              />
            </span>
          </span>

          <span
            className={`flex flex-row items-center justify-center mt-3 text-[22px] text-[#303031] bg-white px-6 py-3 rounded-md md:w-[35%] ${
              selectedRole === "agent" ? "border border-primary" : ""
            }`}
            onClick={() => setSelectedRole("agent")}
          >
            <span className="mr-5 p-4 bg-[#F4F4F4]">
              <MdSupportAgent />
            </span>
            <span className="pr-40 text-[20px]">I am an Agent</span>
            <span>
              <input
                type="radio"
                checked={selectedRole === "agent"}
                onChange={() => setSelectedRole("agent")}
              />
            </span>
          </span>

          <button
            onClick={handleContinue}
            className="px-6 md:w-[35%] sm:w-[55%] text-center mt-9 py-2 rounded-md bg-primary text-white"
          >
            Continue
          </button>
        </div>
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
    </div>
    </>
  );
};

export default NewAccount;

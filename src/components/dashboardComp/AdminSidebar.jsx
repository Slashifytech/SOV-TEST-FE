import React, { useEffect, useState, useMemo } from "react";
import {
  BsFillBuildingsFill,
  BsFillTicketPerforatedFill,
  BsPieChartFill,
} from "react-icons/bs";
import { FaHandsHelping, FaPassport, FaUserCheck, FaUsers } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { IoDocumentTextSharp } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { MdDocumentScanner, MdFlight } from "react-icons/md";
import { RiLogoutBoxRLine, RiTeamFill } from "react-icons/ri";
import LogoutPop from "../login/LogoutPop";
import ImageComponent from "../reusable/Input";
import { logo } from "../../assets";
import { FaUserGroup } from "react-icons/fa6";
import { setNullStudentDirectory } from "../../features/adminSlice";
import { useDispatch, useSelector } from "react-redux";
import { ImUsers } from "react-icons/im";

const SidebarItem = ({ item, path, onClick }) => (
  <div
    className={`cursor-pointer py-4 hover:bg-[#FBD5D5] hover:text-primary hover:border-l-4 hover:font-medium ${
      path === item.pathPage ||
      path === item?.otherPath ||
      path === item?.otherPathTwo ||
      path === item?.otherPathThree 
        ? "bg-[#FBD5D5] text-primary border-l-4 border-primary font-medium"
        : "text-sidebar"
    }`}
  >
    <Link
      to={item.pathPage}
      onClick={item.label === "Applications" ? onClick : null}
      className="flex items-center gap-3 md:pl-6 lg:px-6 sm:pl-6"
    >
      <span className="text-[20px]">{item.icon}</span>
      <span>{item.label}</span>
    </Link>
  </div>
);

const AdminSidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { getAdminProfile } = useSelector((state) => state.admin);
  const role = getAdminProfile?.data?.role;
  const path = location.pathname;

  const [isOpen, setIsOpen] = useState(
    JSON.parse(localStorage.getItem("isOpen")) ?? true
  );
  const [isLogoutOpen, setisLogoutOpen] = useState(false);

  const sidebarList = [
    { pathPage: "/admin/dashboard", icon: <BsPieChartFill />, label: "Dashboard", otherPath: "/admin/province/add-employee" },
    { pathPage: "/admin/province/employee-lists", icon: <ImUsers />, label: "Employees", otherPath: "/admin/edit-employee" },
    { pathPage: "/admin/partner-directory", icon: <FaHandsHelping />, label: "Assign Partners", otherPath: "/admin/add-partner",  otherPathThree: "/admin/partner-employee", otherPathTwo: "/admin/partner-employee-details"},
    { pathPage: "/admin/team-members", icon: <RiTeamFill />, label: "Team Members", otherPath: "/admin/add-member", otherPathTwo: "/admin/team-activity" },
    { pathPage: "/admin/institute", icon: <BsFillBuildingsFill />, label: "Institutions", otherPath: "/add-institute", otherPathTwo: "/institute-view" },
    { pathPage: "/admin/student-directory", icon: <FaUsers />, label: "Students", otherPath: "/student-profile" },
    { pathPage: "/admin/agent-directory", icon: <FaUserGroup />, label: "Agents", otherPath: "/admin/agent-student", otherPathTwo: "/agent-profile" },
    { pathPage: "/admin/application-list", icon: <IoDocumentTextSharp />, label: "Applications", otherPath: "/admin/student-applications" },
    { pathPage: "/admin/approvals", icon: <FaUserCheck />, label: "Profile Approvals" },
    { pathPage: "/admin/applications-review", icon: <MdDocumentScanner />, label: "Applications Review", otherPath: "/coursefee-view", otherPathTwo: "/application-view", otherPathThree: "/visa-view" },
    { pathPage: "/admin/air-ticket-lists", icon: <MdFlight />, label: "Air Ticket" },
  ];

  const filteredSidebarList = useMemo(() => {
    return sidebarList.filter((item) => {
      return !(
        ((role === "0" || role === "5") && item.label === "Employees") ||

        (role === "1" && ["Team Members", "Employees"].includes(item.label)) ||

        ((role === "4" || role === "5") && ["Air Ticket", "Institutions", "Assign Partners", "Team Members"].includes(item.label))
      );
    });
  }, [role, sidebarList]);

  const handleDispatch = () => {
    dispatch(setNullStudentDirectory());
  };

  useEffect(() => {
    localStorage.setItem("isOpen", JSON.stringify(isOpen));
  }, [isOpen]);

  const toggleLogoutPopup = () => {
    setisLogoutOpen((prev) => !prev);
  };

  return (
    <>
      <div className="bg-white md:w-[17.5vw] sm:w-[24vw] h-[100vh] pb-6 overflow-y-auto scrollbar-hide border-r-2 border-[#E8E8E8]">
        <a href="https://sovportal.in">
          <ImageComponent
            src={logo}
            alt="logo"
            className="md:w-44 sm:w-32 md:h-24 sm:h-16 ml-2"
          />
        </a>
        {filteredSidebarList.map((item, index) => (
          <SidebarItem key={index} item={item} path={path} onClick={handleDispatch} />
        ))}
        {role === "0" && (
          <div className={`cursor-pointer py-4 hover:bg-[#FBD5D5] hover:text-primary hover:border-l-4 hover:font-medium ${path === "/admin/ticket" ? "bg-[#FBD5D5] text-primary border-l-4 border-primary font-medium" : "text-sidebar"}`}>
            <Link to="/admin/ticket" className="flex items-center gap-3 md:pl-6 lg:px-6 sm:pl-6">
              <span className="text-[20px]"><BsFillTicketPerforatedFill /></span>
              <span>Ticket Support</span>
            </Link>
          </div>
        )}
        {role === "0" && (
          <>
            <div onClick={() => setIsOpen((prev) => !prev)} className="flex items-center mt-2 bg-transparent py-2 relative hover:text-primary hover:bg-[#FBD5D5] px-5 text-sidebar cursor-pointer">
              <span className="text-[23px]"><CgProfile /></span>
              <span className="flex items-center pl-[12px]">
                My Account
                {isOpen ? <IoIosArrowUp className="text-[18px] absolute right-6" /> : <IoIosArrowDown className="absolute right-6" />}
              </span>
            </div>
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
              <ul className="sm:mt-2 list-none text-[16px]">
                {["/admin/profile", "/admin/change-password", "/admin/change-email"].map((link, idx) => (
                  <Link key={idx} to={link}>
                    <li className={`text-sidebar py-2 mb-2 cursor-pointer md:pl-12 lg:px-12 sm:pl-12 hover:bg-[#f5ebeb] hover:text-primary capitalize ${path === link ? "bg-[#FBD5D5] border-l-4 border-primary text-primary" : ""}`}>
                      {link.split("/").pop().replace("-", " ").replace("email", "Email").replace("password", "Password").replace("profile", "Profile")}
                    </li>
                  </Link>
                ))}
              </ul>
            </div>
          </>
        )}
        <div className={`cursor-pointer py-4 hover:bg-[#FBD5D5] hover:text-primary hover:border-l-4 hover:font-medium text-secondary`} onClick={toggleLogoutPopup}>
          <div className="flex items-center gap-3 px-6">
            <span className="text-[20px]"><RiLogoutBoxRLine /></span>
            <span>Logout</span>
          </div>
        </div>
        <p className="text-secondary pl-6 pt-8 font-bold text-[14px]">SOV PORTAL</p>
        <p className="font-light text-secondary pl-6 text-[12px] pt-1 mb-20">© 2024 All Rights Reserved</p>
      </div>
      <LogoutPop isLogoutOpen={isLogoutOpen} setisLogoutOpen={setisLogoutOpen} />
    </>
  );
};

export default AdminSidebar;

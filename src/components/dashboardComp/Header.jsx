import React from "react";
import { profileSkeleton } from "../../assets";
import { CiBellOn, CiStar } from "react-icons/ci";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = ({ icon, customLink, iconTwo }) => {
  const { notificationCount } = useSelector((state) => state.notifications);
  const { agentData } = useSelector((state) => state.agent);
  const { studentInfoData } = useSelector((state) => state.student);
  const { getAdminProfile } = useSelector((state) => state.admin);
  const role = localStorage.getItem("role") 
  const adminRole = getAdminProfile?.data?.role
  return (
    <>
      <div
        className={`flex flex-row items-center w-[82.5vw]  py-2.5 z-10 bg-primary font-poppins pr-6 fixed md:ml-[17.5vw] sm:ml-[23.5vw] ${
          (adminRole === "0" || adminRole === "1" || adminRole === "4" || adminRole === "5") && "h-16"
        } `}
      >
        
        <span className="md:w-[85vw] sm:w-[60vw]">
          <span className="flex justify-end flex-row gap-6 sm:w-[120%] md:w-full">
           { role !== "0" && role !== "1" && !adminRole && <Link
              to={customLink}
              className="bg-white rounded-full px-[11px] py-2 text-[27px] cursor-pointer "
            >
              {icon ? (
                <span className="text-primary text-[26px]">{icon}</span>
              ) : (
                <CiStar />
              )}
            </Link>}
            <Link to="/notifications" className="bg-white rounded-full px-[11px] py-2 text-[27px] cursor-pointer relative">
             
              {iconTwo ? (
                <span className="text-primary text-[26px]">{iconTwo}</span>
              ) : (
                <CiBellOn /> 
              )}
             {notificationCount > 0 &&  <span className="absolute rounded-full w-5 h-5 text-[13px] -top-1 -right-2 bg-[#FBD5D5] text-primary text-center">
                {notificationCount}
              </span>}
            </Link>
            <span className="bg-white rounded-full flex items-center gap-3 px-2 pr-6 py-[4px] cursor-pointer">
              <img
                src={
                  role === "2"&& !adminRole
                    ? agentData?.primaryContact?.profilePicture
                    : role === "3" && !adminRole
                    ? studentInfoData?.data?.studentInformation
                        ?.personalInformation?.profilePicture
                    : (adminRole === "0" || adminRole === "1" || adminRole ==="4" || adminRole ==="5")
                    ? getAdminProfile?.data?.profilePicture
                    : profileSkeleton
                }
                alt="img"
                className="w-10 h-10 rounded-full"
                onError={(e) => {
                  e.target.src = profileSkeleton;
                }}
                loading="lazy"
              />

              <span className="flex flex-col">
                <span className="font-normal text-[14px]">
                  {role === "2"&& !adminRole
                    ? agentData?.companyDetails?.businessName
                    : role === "3" && !adminRole
                    ? studentInfoData?.data?.studentInformation
                        ?.personalInformation?.firstName +
                      " " +
                      studentInfoData?.data?.studentInformation
                        ?.personalInformation?.lastName
                    : (adminRole === "0" || adminRole === "1"  ||  adminRole ==="5")
                    ? getAdminProfile?.data?.firstName +
                      " " +
                      getAdminProfile?.data?.lastName
                    : adminRole === "4" ? getAdminProfile?.data?.firstName : null}
                </span>
    
                <span className="font-light text-[13px]">
                  {role === "2" && !adminRole
                    ? agentData?.agentEmail
                    : role === "3" && !adminRole
                    ? studentInfoData?.data?.studentInformation
                        ?.personalInformation?.email
                    : (adminRole === "0" ||adminRole === "1" || adminRole ==="4" ||  adminRole ==="5")
                    ? getAdminProfile?.data?.email
                    : null}{" "}
                </span>
              </span>
            </span>
          </span>
        </span>
        
      </div>
    </>
  );
};

export default Header;
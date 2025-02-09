import React, { useEffect, useState } from "react";
import Header from "../components/dashboardComp/Header";
import AdminSidebar from "../components/dashboardComp/AdminSidebar";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminProfileById } from "../features/adminSlice";
import { useLocation } from "react-router-dom";
import { profileSkeleton } from "../assets";
import { FaRegEye, FaRegIdCard } from "react-icons/fa";
import { IoMdHome } from "react-icons/io";
import Loader from "../components/Loader";

const PartnerEmployeeDetail = () => {
  const { profileById, loading } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const location = useLocation();
  const userId = location?.state?.id;

  useEffect(() => {
    if (userId) {
      dispatch(fetchAdminProfileById({ userId }));
    }
  }, [userId]);

  return (
    <>
      <Header customLink="/agent/shortlist" />
      <div>
        <span className="fixed overflow-y-scroll scrollbar-hide bg-white">
          <AdminSidebar />
        </span>
      </div>

      <div className="md:ml-[19%] sm:ml-[26.5%] mt-20">
        {loading && (
          <div className="w-full ml-[53%] mt-12">
            <Loader />
          </div>
        )}

        {!loading && !profileById && (
          <div className="text-center text-lg font-semibold text-red-500">
            Profile Not Found
          </div>
        )}

        {!loading && profileById && (
          <>
            <div className="flex items-center gap-4">
              <img
                src={profileById?.profilePicture || profileSkeleton}
                alt="Profile"
                className="rounded-md w-28 h-28"
                onError={profileSkeleton}
                loading="lazy"
              />
              <span className="flex flex-col">
                <span className="text-sidebar text-[18px] font-medium">
                  {profileById?.firstName + " " + profileById?.lastName || "NA"}
                </span>
                <span className="text-[14px] text-body font-normal">
                  {profileById?.email || "NA"}
                </span>
                <span className="text-[14px] text-body font-normal">
                  {profileById?.phone || "NA"}
                </span>
                <span className="text-[14px] text-body font-normal">
                  ID: {profileById?.teamId || "NA"}
                </span>
              </span>
            </div>

            <div className="bg-white rounded-md px-6 py-4 font-poppins mt-6">
              <div className="flex flex-row text-sidebar items-center justify-between border-b border-greyish">
                <span className="flex flex-row gap-4 items-center pb-3">
                  <span className="text-[24px]">
                    <FaRegIdCard />
                  </span>
                  <span className="font-semibold text-[22px]">
                    Personal Information
                  </span>
                </span>
              </div>
              <div className="flex flex-row w-full justify-between mt-6">
                <span className="w-1/2 flex flex-col text-[15px]">
                  <span className="font-light">Profile Picture</span>
                  {profileById?.profilePicture ? (
                    <a
                      className="flex items-center gap-3 text-primary font-medium"
                      href={profileById?.profilePicture}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Uploaded
                      <span>
                        <FaRegEye />
                      </span>
                    </a>
                  ) : (
                    "NA"
                  )}
                  <span className="font-light mt-4">Gender</span>
                  <span className="font-medium">
                    {profileById?.gender || "NA"}
                  </span>
                  <span className="font-light mt-4">Phone Number</span>
                  <span className="font-medium">
                    {profileById?.phone || "NA"}
                  </span>
                  <span className="font-light mt-4">Email</span>
                  <span className="font-medium">
                    {profileById?.email || "NA"}
                  </span>
                </span>
                <span className="w-1/2 flex flex-col text-[15px]">
                  <span className="font-light">Full Name </span>
                  <span className="font-medium">
                    {profileById?.firstName + " " + profileById?.lastName ||
                      "NA"}
                  </span>
                  <span className="font-light mt-4">Date of Joining</span>
                  <span className="font-medium">
                    {profileById?.dateOfJoining || "NA"}
                  </span>

                  <span className="font-light mt-4">Date of Birth</span>
                  <span className="font-medium">
                    {profileById?.dob || "NA"}
                  </span>
                </span>
              </div>
            </div>

            <div className="bg-white rounded-md px-6 py-4 font-poppins mt-6 mb-20">
              <div className="flex flex-row text-sidebar items-center justify-between border-b border-greyish">
                <span className="flex flex-row gap-4 items-center pb-3">
                  <span className="text-[24px]">
                    <IoMdHome />
                  </span>
                  <span className="font-semibold text-[22px]">
                    Residence Address
                  </span>
                </span>
              </div>
              <div className="flex flex-row w-full justify-between mt-6">
                <span className="w-1/2 flex flex-col text-[15px]">
                  <span className="font-light mt-4">Residence Address</span>
                  <span className="font-medium">
                    {profileById?.residenceAddress?.address || "NA"}
                  </span>
                  <span className="font-light mt-4">Province/ State</span>
                  <span className="font-medium">
                    {profileById?.residenceAddress?.state || "NA"}
                  </span>
                  <span className="font-light mt-4">Postal/ Zip Code</span>
                  <span className="font-medium">
                    {profileById?.residenceAddress?.zipcode || "NA"}
                  </span>
                </span>
                <span className="w-1/2 flex flex-col text-[15px]">
                  <span className="font-light">Country </span>
                  <span className="font-medium">
                    {profileById?.residenceAddress?.country || "NA"}
                  </span>
                  <span className="font-light mt-4">City/ Town</span>
                  <span className="font-medium">
                    {profileById?.residenceAddress?.city || "NA"}
                  </span>
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default PartnerEmployeeDetail;

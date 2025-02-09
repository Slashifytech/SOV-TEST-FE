import React, { useEffect, useState } from "react";
import Header from "../components/dashboardComp/Header";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../components/dashboardComp/Pagination";
import { CustomInput } from "../components/reusable/Input";
import { IoSearchOutline } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";
import { dnf } from "../assets";
import Dnf from "../components/Dnf";
import Loader from "../components/Loader";
import AdminSidebar from "../components/dashboardComp/AdminSidebar";
import {
  fetchAdminPartnerData,
  setEmptyMemberInput,
} from "../features/adminSlice";

import { CustomTableSixteen } from "../components/Table";
import { FaRegEye } from "react-icons/fa";

const PartnerEmployee = () => {
  const location = useLocation();
  const { PartnersData } = useSelector((state) => state.admin);
  const [search, setSearch] = useState("");
  const perPage = 10;
  const [page, setPage] = useState(1);
  const totalUsersCount = PartnersData?.total || 0;
  const currentPage = PartnersData?.currentPage;
  const totalPagesCount = PartnersData?.totalPages;
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const userId = location?.state?.id;
  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };


  useEffect(() => {
    dispatch(
      fetchAdminPartnerData({
        perPage,
        page,
        search,
        endpoint: `/auth/admin/get-partner-employees`,
        userId,
      })
    );
  }, [perPage, page, search, userId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const TABLE_HEAD = [
    "S.No.",
    "Employee Name",
    "Id",
    "Email Id",
    "Phone Number",
    "View",
  ];

  const TABLE_ROWS = PartnersData?.partnerEmployee?.map((data, index) => ({
    sno: (currentPage - 1) * perPage + index + 1,
  
    data: data || "NA",
  }));
  return (
    <>
      <Header customLink="/agent/shortlist" />
      <div>
        <span className="fixed overflow-y-scroll scrollbar-hide bg-white ">
          <AdminSidebar />
        </span>
        <div className="md:ml-[17%] sm:ml-[23%] pt-14 font-poppins bg-white pb-6">
          <p className="md:text-[28px] sm:text-[22px] font-bold text-sidebar mt-6 ml-9">
         Partner's Employee Directory ({totalUsersCount})
          </p>
          <p className="font-normal text-body pr-[20%] text-[16px] ml-9">
            Manage and view details in one place.
          </p>
        </div>
        <div className="flex items-center justify-between  md:mr-7 sm:mr-5 md:ml-[19.5%] sm:ml-[27%] mt-6">
          <span className="flex flex-row items-center">
            {" "}
            <span className="flex flex-row items-center ">
              <CustomInput
                className="h-11 md:w-96 sm:w-80 rounded-md text-body placeholder:px-3 pl-7 border border-[#E8E8E8] outline-none"
                type="text"
                placeHodler="Search Employee Name, Phone Number, & Email"
                name="search"
                value={search}
                onChange={handleSearchChange}
              />
              <span className="absolute pl-2 text-[20px] text-body">
                <IoSearchOutline />
              </span>
            </span>
          </span>
      
        </div>

        {isLoading ? (
          <div className="w-full ml-[53%] mt-12">
            <Loader />
          </div>
        ) : !PartnersData?.partnerEmployee ? (
          <p className="mt-8 font-medium text-body ml-[25%] mr-[15%]">
            <Dnf
              dnfImg={dnf}
              headingText="Start Your Journey!"
              bodyText="No Employee Available to Show"
            />
          </p>
        ) : PartnersData?.partnerEmployee.length === 0 ? (
          <p className="mt-8 font-medium text-body ml-[25%] mr-[15%]">
            <Dnf
              dnfImg={dnf}
              headingText="Start Your Journey!"
              bodyText="No Member Employee to Show"
            />
          </p>
        ) : (
          <>
                   <div className="mt-3 mr-6 md:ml-[19%] sm:ml-[26%]">
                      <CustomTableSixteen
                        tableHead={TABLE_HEAD}
                        tableRows={TABLE_ROWS}
                        action="View"
                     
                        icon={<FaRegEye />}
                      />
                    </div>
            <div className="mt-12 mb-10">
              <Pagination
                currentPage={currentPage}
                hasNextPage={currentPage * perPage < totalUsersCount}
                hasPreviousPage={currentPage > 1}
                onPageChange={handlePageChange}
                totalPagesCount={totalPagesCount}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default PartnerEmployee;

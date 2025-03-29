import React, { useEffect, useState } from "react";
import Header from "../components/dashboardComp/Header";
import { CustomTableFourteen } from "../components/Table";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { dnf } from "../assets";
import { FaRegEye } from "react-icons/fa";
import { CustomInput } from "../components/reusable/Input";
import { IoSearchOutline } from "react-icons/io5";
import Pagination from "../components/dashboardComp/Pagination";
import Loader from "../components/Loader";
import Dnf from "../components/Dnf";
import Sidebar from "../components/dashboardComp/Sidebar";

import AgentSidebar from "../components/dashboardComp/AgentSidebar";
import { fetchAllAirTicketAdmin } from "../features/adminSlice";
import AdminSidebar from "../components/dashboardComp/AdminSidebar";

const AirTicketLists = () => {
  const role = localStorage.getItem("role");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { airTickets } = useSelector((state) => state.admin);
  const [isLoading, setIsLoading] = useState(true);
  const [perPage, setPerPage] = useState(10);
  const totalUsersCount = airTickets?.data?.length || 0;
  const currentPage = airTickets?.currentPage || 1;
  const totalPagesCount = airTickets?.totalPages || 1;
  const dispatch = useDispatch();

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };
  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  useEffect(() => {
    dispatch(fetchAllAirTicketAdmin({ page, perPage, search }));
  }, [search, page, perPage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const TABLE_HEAD = [
    "S.No.",
    "Air Ticket ID",
    "User Name",
    "User Id",
    "User Type",
    "Date Created",
    "View",
  ];

  const TABLE_ROWS = airTickets?.requests?.map((data, index) => ({
    sno: (currentPage - 1) * perPage + index + 1,
    data: data || "NA",
  }));

  return (
    <>
      <Header customLink="/agent/shortlist" />
      <span className="fixed overflow-y-scroll scrollbar-hide  bg-white ">
        <AdminSidebar />
      </span>

      {isLoading ? (
        <div className=" ml-[53%] md:mt-80 sm:mt-80 ">
          <Loader />
        </div>
      ) : (
        <>
          <div>
            <span className="flex items-center pt-20 pb-6 md:pl-[18.5%] sm:pl-[27%] bg-white">
              <span className="flex  flex-col items-start">
                <p className="text-[28px] font-bold text-sidebar mt-6 md:ml-9 sm:ml-20">
                  Air-Tickets Directory
                </p>
                <p className="text-sidebar ml-9 text-[15px] mr-[36%]">
                  Review your agents and students air tickets request here. Stay
                  updated on status and view detailed issues for each air
                  ticket.
                </p>
              </span>
            </span>
            <div className="md:ml-[19.5%] sm:ml-[26%] mt-6 md:mr-6 sm:mr-2">
              <span className="flex flex-row items-center mb-3">
                <span className="flex flex-row justify-between w-full items-center">
                  <span className="flex flex-row items-center ">
                    <span className="flex flex-row items-center  ">
                      <CustomInput
                        className="h-11 md:w-96 sm:w-44  rounded-md text-body placeholder:px-3 pl-9 border border-[#E8E8E8] outline-none"
                        type="text"
                        placeHodler="Search by Air Ticket Id, UserId and User Name"
                        name="search"
                        value={search}
                        onChange={handleSearchChange}
                      />
                      <span className="absolute pl-2 text-[20px] text-body">
                        <IoSearchOutline />
                      </span>
                    </span>
                  </span>
                  {/* <Link
                    to="/air-ticket/add"
                    className="bg-primary text-white md:px-4 sm:px-2 rounded-md py-2 cursor-pointer"
                  >
                    + Create Air Ticket
                  </Link> */}
                </span>
              </span>
            </div>

            {airTickets?.requests?.length > 0 ? (
              <>
                <div className="md:ml-[19.5%] sm:ml-[27%] mt-6 mr-6  ">
                  <CustomTableFourteen
                    tableHead={TABLE_HEAD}
                    tableRows={TABLE_ROWS}
                    SecondLink="/offerLetter-apply"
                    action={"Edit/View"}
                    icon={<FaRegEye />}
                  />
                </div>
                <div className="mt-16 mb-10 ml-20">
                  <Pagination
                    currentPage={currentPage}
                    hasNextPage={currentPage * perPage < totalUsersCount}
                    hasPreviousPage={currentPage > 1}
                    onPageChange={handlePageChange}
                    totalPagesCount={totalPagesCount}
                  />
                </div>
              </>
            ) : (
              <div className="mt-8 font-medium text-body ml-[25%] mr-[15%]">
                <Dnf
                  dnfImg={dnf}
                  headingText="Start Your Journey!"
                  bodyText="No Air Tickets Available to show"
                />
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default AirTicketLists;

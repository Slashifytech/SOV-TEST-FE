import React, { useEffect, useState } from "react";
import Header from "../components/dashboardComp/Header";
import { CustomTableFifteen, CustomTableThree, CustomTableTwo } from "../components/Table";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { dnf, profileSkeleton } from "../assets";
import { FaRegEye } from "react-icons/fa";
import { studentById } from "./../features/generalSlice";
import { CustomInput } from "../components/reusable/Input";
import { IoSearchOutline } from "react-icons/io5";
import { applicationTypeOption, statusOption } from "../constant/data";
import Pagination from "../components/dashboardComp/Pagination";
import Loader from "../components/Loader";
import Dnf from "../components/Dnf";
import Sidebar from "../components/dashboardComp/Sidebar";
import { clearApplicationData, getApplications } from "../features/studentSlice";
import ApplicationChoosePop from "../components/dashboardComp/ApplicationChoosePop";
import { fetchAllVisaByAgent } from "../features/agentSlice";
import AgentSidebar from "../components/dashboardComp/AgentSidebar";
import VisaAddPop from "../components/dashboardComp/VisaAddPop";

const AllVisa = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isType, setIsType] = useState("");
  const { agentVisas, agentData } = useSelector(
    (state) => state.agent
  );
  const userId = agentData?.agentId
  const [isOpenOpt, setIsOpenOpt] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [perPage, setPerPage] = useState(10);
  const totalUsersCount = agentVisas?.totalDocuments || 0;
  const currentPage = agentVisas?.currentPage || 1;
  const totalPagesCount = agentVisas?.totalPages || 1;
  const dispatch = useDispatch();
  const closeOpt = () => {
    setIsOpenOpt(false); 
  };

  const handleOpenOpt = () => {
    setIsOpenOpt(true); 
  };
  const handlePerPageChange = (e) => {
    setPerPage(parseInt(e.target.value));
    setPage(1);
  };
  const handleApplicatioTypeChange = (e) => {
    dispatch(clearApplicationData())
    setIsType(e.target.value);
    setPage(1);
  };
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };
  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  useEffect(() => {
    dispatch(fetchAllVisaByAgent({ page, perPage, search }));
  }, [page, perPage, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const perPageOptions = [];
  for (let i = 10; i <= Math.min(totalUsersCount, 100); i += 10) {
    perPageOptions.push(i);
  }

  const TABLE_HEAD = ["S.No.", "Application ID","Country", "Status", "Action"];
  
  const TABLE_ROWS = agentVisas?.data?.map((data, index) => ({
    sno: (currentPage - 1) * perPage + index + 1,
    id: data?.applicationId || "NA",
    data: data || "NA",
    status: data?.status || "NA",
    appId: data?._id,
  }));

  return (
    <>
      <Header customLink="/agent/shortlist" />
      <span className="fixed overflow-y-scroll scrollbar-hide  bg-white">
        <AgentSidebar />
      </span>

      {isLoading ? (
        <div className=" ml-[53%] md:mt-80 sm:mt-80 ">
          <Loader />
        </div>
      ) : (
        <>
          <div>
            <span className="flex items-center pt-20 pb-6 md:pl-[16.5%] sm:pl-[18%] sm:mt-6 bg-white">
            <p className="text-[28px] font-bold text-sidebar  md:ml-9 sm:ml-16">

               Visa Lodgement Directory
              </p>
            </span>

            <div className="md:ml-[19.5%] sm:ml-[26%] mt-6 md:mr-6 sm:mr-2">
              <span className="flex flex-row items-center mb-3">
                <span className="flex flex-row justify-between w-full items-center">
                  <span className="flex flex-row items-center ">
                    {/* <span className="text-body">Show</span>
                    <select
                      className="ml-3 border px-2 py-1 w-10 h-11 rounded outline-none"
                      value={perPage}
                      onChange={handlePerPageChange}
                    >
                      {perPageOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <span className="md:px-3 sm:px-1 text-body">entries</span> */}
                    {/* <select
                      className="ml-3 border px-2 py-1 md:w-40 sm:w-24 h-11 rounded outline-none"
                      value={isType}
                      onChange={handleApplicatioTypeChange}
                    >
                      <option value="">Status</option>
                      {statusOption.map((option) => (
                        <option key={option.option} value={option.option}>
                          {option.label}
                        </option>
                      ))}
                    </select> */}
                    <span className="flex flex-row items-center ">
                      <CustomInput
                        className="h-11 md:w-80 sm:w-60  rounded-md text-body placeholder:px-3 pl-7 border border-[#E8E8E8] outline-none"
                        type="text"
                        placeHodler="Search by Application Id"
                        name="search"
                        value={search}
                        onChange={handleSearchChange}
                      />
                      <span className="absolute pl-2 text-[20px] text-body">
                        <IoSearchOutline />
                      </span>
                    </span>
                  </span>
                  <span
                    onClick={handleOpenOpt}
                    className="bg-primary text-white md:px-4 sm:px-2 rounded-md py-2 cursor-pointer"
                  >
                    + Apply Visa Lodgement
                  </span>
                </span>
              </span>
            </div>

            {totalUsersCount > 0 ? (
              <>
                <div className="md:ml-[19.5%] sm:ml-[27%] mt-6 md:w-[85%]  ">
                  <CustomTableFifteen
                    tableHead={TABLE_HEAD}
                    tableRows={TABLE_ROWS}
                    SecondLink="/offerLetter-apply"
                    action={"Edit/View"}
                    icon={<FaRegEye />}
                    // link="/offerLetter/edit"
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
                  bodyText="No Application Data Available for this Student"
                />
              </div>
            )}
          </div>
          
      <VisaAddPop
        isOpenOpt={isOpenOpt}
        closeOpt={closeOpt}
        state={userId}
      />
        </>
      )}
    </>
  );
};

export default AllVisa;

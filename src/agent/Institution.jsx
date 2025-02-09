import React, { useEffect, useState } from "react";
import {
  CountrySelect,
  CustomInput,
  InstituteComponent,
  SelectComponent,
} from "../components/reusable/Input";
import { IoSearchOutline } from "react-icons/io5";
import InstituteCard from "../components/dashboardComp/InstituteCard";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/dashboardComp/Header";
import AgentSidebar from "../components/dashboardComp/AgentSidebar";
import { emptyData, fetchInstituteData } from "../features/generalSlice";
import { shortlistedData } from "../features/agentSlice";
import Dnf from "../components/Dnf";
import { noInstitute } from "../assets";
import { shortlistAdd } from "../features/agentApi";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import Pagination from "../components/dashboardComp/Pagination";
import { removeDuplicates } from "../constant/commonfunction";
import { Select } from "antd";
import { intakeOption } from "../constant/data";

const Institution = () => {
  const [updatedFilteredData, setUpdatedFilteredData] = useState([]);
  const { prefCountryOption, popularCourse, instituteData } = useSelector(
    (state) => state.general
  );
  const courses = popularCourse;
  const shortlistedUniversities = useSelector(
    (state) => state.agent.shortlisted?.institutes
  );

  const [isLoading, setIsLoading] = useState(false);
  const [filterData, setFilterData] = useState({
    country: "",
    institutes: "",
    search: "",
    courses: "",
    inTake: "",
  });
  const dispatch = useDispatch();
  const perPage = 20;
  const [page, setPage] = useState(1);
  const totalUsersCount = instituteData?.totalRecords || 0;
  const currentPage = instituteData?.currentPage;
  const totalPagesCount = instituteData?.totalPages;

  const options = removeDuplicates(courses).map((option, index) => ({
    value: option.courseName,
    label: option.courseName,
  }));

  const handleInput = (e) => {
    const { value, name } = e.target;

    setFilterData((prevData) => {
      if (name === "country") {
        return {
          ...prevData,
          [name]: value,
          institutes: "",
        };
      }

      return {
        ...prevData,
        [name]: value,
      };
    });

    setPage(1);
  };

  const handleChange = (value) => {
    setFilterData((prevState) => ({
      ...prevState,
      courses: value,
      country: "",
    }));
    setPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  useEffect(() => {
    setIsLoading(true);
    dispatch(shortlistedData());
    setIsLoading(false);
  }, [dispatch]);

  useEffect(() => {
    setIsLoading(true);
    if (
      filterData.courses ||
      filterData.country ||
      filterData.inTake ||
      filterData.search ||
      filterData.institutes
    ) {
      dispatch(
        fetchInstituteData({
          page,
          perPage,
          courses: filterData.courses,
          country: filterData.country,
          inTake: filterData.inTake,
          search: filterData.search,
          institute: filterData.institutes,
        })
      );
    }

    setIsLoading(false);
  }, [
    page,
    perPage,
    filterData.country,
    filterData.inTake,
    filterData.search,
    filterData.courses,
    filterData.institutes,
  ]);

  useEffect(() => {
    const isEmpty =
      !filterData.country &&
      !filterData.inTake &&
      !filterData.search &&
      !filterData.institutes &&
      !filterData.courses;

    if (isEmpty) {
      dispatch(emptyData());
    }
  }, [filterData, dispatch]);
  const shortlistInstitute = async (instituteId) => {
    try {
      const res = await shortlistAdd(instituteId);
      toast.success(res.message || "University shortlisted");
      dispatch(shortlistedData());
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Something went wrong");
    }
  };

  const displayedInstitutes = instituteData?.institutes;

  useEffect(() => {
    const updatedInstitutes = displayedInstitutes?.map((institute) => {
      const isShortlisted = shortlistedUniversities?.some(
        (item) => item.instituteId?._id === institute?._id
      );
      return {
        ...institute,
        status: isShortlisted ? "added" : "removed",
      };
    });

    setUpdatedFilteredData(updatedInstitutes);
  }, [filterData, instituteData, shortlistedUniversities]);

  return (
    <>
      <Header customLink="/agent/shortlist" />
      <div>
        <span className="fixed overflow-y-scroll scrollbar-hide bg-white">
          <AgentSidebar />
        </span>
      </div>
      <div>
        <span className="flex md:flex-row sm:flex-col items-center mt-20 md:ml-[16.5%] sm:ml-[22%]">
          <span>
            <p className="text-[28px] font-bold text-sidebar mt-6 ml-9">
              Explore: Colleges & Universities
            </p>
            <p className="mt-1 md:font-normal sm:font-light text-body md:pr-[8%] sm:pr-[20%] ml-9">
              Discover colleges worldwide tailored to your study abroad dreams.
              Filter and Search by country and institutions to find the perfect
              match for your educational journey.
            </p>
          </span>
        </span>
        <span className="flex flex-row items-center  sm:mt-6 md:mr-6 sm:mr-3  md:ml-[19%] sm:ml-[27%]">
          <CustomInput
            className="h-11 w-96 rounded-md placeholder:px-3 pl-9 border border-[#E8E8E8] outline-none"
            type="text"
            placeHodler="Search by Country, Universities & Courses"
            name="search"
            value={filterData.search}
            onChange={handleInput}
          />
          <span className="absolute pl-2 text-[20px] text-body">
            <IoSearchOutline />
          </span>
        </span>
        <span className="grid md:grid-cols-4 sm:grid-cols-2 items-center md:gap-8 md:mr-[9%] md:ml-[19%] sm:ml-[27%] sm:mr-[9%]">
          <div className="mt-1">
            <p className="mb-2 text-sidebar">Courses</p>
            <Select
              showSearch
              className="md:w-[115%] sm:w-[100%]"
              style={{
                height: 42,
              }}
              onChange={(e) => handleChange(e)}
              value={filterData.courses || undefined}
              placeholder="Courses"
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={options}
              allowClear
            />
          </div>
          <div className="ml-9">
            <CountrySelect
              notImp={true}
              name="country"
              label="Country"
              options={prefCountryOption}
              customClass="bg-white"
              value={filterData.country}
              handleChange={handleInput}
            />
          </div>
          <div className="flex flex-col mb-4 mt-6 font-poppins">
            <label className="font-normal text-secondary mb-2 text-[14px]">
              University & Institutes
            </label>
            <select
              name="institutes"
              value={filterData.institutes}
              onChange={handleInput}
              className={`border border-gray-300 text-secondary rounded-md px-3 py-2 outline-none `}
            >
              <option className="text-secondary font-poppins" value="">
                Select Options
              </option>
              {instituteData?.instituteNames?.map((option, index) => (
                <option className="text-secondary" key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:ml-9 md:ml-0">
            <SelectComponent
              notImp={true}
              customClass="bg-white"
              name="inTake"
              label="Intake"
              options={intakeOption}
              value={filterData.inTake}
              handleChange={handleInput}
            />
          </div>
        </span>
      </div>

      {/* Loading and data handling */}
      {isLoading ? (
        <div className="w-full ml-[53%]">
          <Loader />
        </div>
      ) : !displayedInstitutes ? (
        <p className="mt-8 font-medium text-body ml-[25%] mr-[15%]">
          <Dnf
            dnfImg={noInstitute}
            headingText="Start Your Journey!"
            bodyText="Apply a filter by country, institution, or search to view universities."
          />
        </p>
      ) : displayedInstitutes.length === 0 ? (
        <p className="mt-8 font-medium text-body ml-[25%] mr-[15%]">
          <Dnf
            dnfImg={noInstitute}
            headingText="No results found"
            bodyText="Try adjusting your filters to find universities."
          />
        </p>
      ) : (
        <>
          <p className="mt-1 font-medium text-body pr-[20%] md:ml-[19%] sm:ml-[27%]">
            Showing {displayedInstitutes.length} of {totalUsersCount}{" "}
            universities
          </p>
          <p className="text-[24px] font-semibold text-sidebar md:ml-[19%] sm:ml-[27%]">
            All universities and colleges
          </p>
          <div className="md:ml-[19%] sm:ml-[27%] mt-6 grid md:grid-cols-2 lg:grid-cols-3 sm:grid-cols-2 mx-6 md:gap-6 sm:gap-6">
            {updatedFilteredData?.map((institute) => (
              <InstituteCard
                key={institute._id}
                institutename={institute?.instituteName}
                institute={institute}
                country={institute?.country}
                state={institute?.status}
                instituteId={institute?._id}
                link="/agent/student-lists"
                customState={{
                  country: institute.country,
                  institute: institute.instituteName,
                }}
                shortlistInstitute={shortlistInstitute}
                data={institute}
              />
            ))}
          </div>
          <div className="flex justify-center mt-8 mb-20 ml-9">
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
    </>
  );
};

export default Institution;

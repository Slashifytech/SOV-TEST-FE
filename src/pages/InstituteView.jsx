import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { getSingleInstitute } from "../features/adminSlice";
import ImageComponent from "../components/reusable/Input";
import { dnf, nodata, noImage } from "../assets";
import Header from "../components/dashboardComp/Header";
import Sidebar from "../components/dashboardComp/Sidebar";
import AgentSidebar from "../components/dashboardComp/AgentSidebar";
import AdminSidebar from "../components/dashboardComp/AdminSidebar";
import { FaStar } from "react-icons/fa";
import ApplicationChoosePop from "../components/dashboardComp/ApplicationChoosePop";
import { shortlistAdd } from "../features/agentApi";
import { toast } from "react-toastify";
import { CiStar } from "react-icons/ci";
import { shortlistedData } from "../features/agentSlice";
import { MdInfoOutline } from "react-icons/md";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { BiBookBookmark } from "react-icons/bi";
import { GiGraduateCap } from "react-icons/gi";
import { FaBuildingFlag } from "react-icons/fa6";
import Loader from "../components/Loader";
import Dnf from "../components/Dnf";
import { RiPriceTag2Fill } from "react-icons/ri";

const InstituteView = () => {
  const { instituteById } = useSelector((state) => state.admin);
  const shortlistedUniversities = useSelector(
    (state) => state.agent.shortlisted?.institutes
  );

  const location = useLocation();
  console.log(location);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [isOpenOpt, setIsOpenOpt] = useState(false);
  const id = location?.state?.id;
  const role = localStorage.getItem("role");

  useEffect(() => {
    dispatch(getSingleInstitute(id));
    dispatch(shortlistedData());
  }, [id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const closeOpt = () => {
    setIsOpenOpt(false);
  };

  const handleOpenOpt = () => {
    setIsOpenOpt(true);
  };

  const shortlistInstitute = async (instituteId) => {
    try {
      const res = await shortlistAdd(instituteId);
      toast.success(res.message || "University shortlisted");
      dispatch(getSingleInstitute(id));
      dispatch(shortlistedData());
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Something went wrong");
    }
  };

  const status = shortlistedUniversities?.find(
    (university) => university?.instituteId?._id === instituteById?.data?._id
  )
    ? "added"
    : "removed";

  const formattedUrl =
    instituteById?.data?.websiteUrl &&
    !/^https?:\/\//i.test(instituteById?.data?.websiteUrl)
      ? `http://${instituteById?.data?.websiteUrl}`
      : instituteById?.data?.websiteUrl;
  return (
    <>
      <Header customLink="/agent/shortlist" />
      <div className="font-poppins text-sidebar">
        <span className="fixed overflow-y-scroll scrollbar-hide bg-white">
          {role === "3" ? (
            <Sidebar />
          ) : role === "2" ? (
            <AgentSidebar />
          ) : role === "0" || role === "1" || role ==="4" || role === "5" ? (
            <AdminSidebar />
          ) : null}
        </span>

        {/* Conditional Rendering for Loading and No Data */}

        <>
          <img
            src={instituteById?.data.instituteImg || noImage}
            loading="lazy"
            className=" md:ml-60 sm:ml-20  h-96 pt-16 w-[85%]  object-cover"
          />
          <div className="md:ml-[17%] sm:ml-[22%] pt-6 pb-8 bg-white border-b-2 border-[#E8E8E8]">
            <span className="flex items-start gap-6">
              <img
                loading="lazy"
                src={instituteById?.data?.instituteImg || noImage}
                className="w-16 h-16 object-fill ml-8 rounded-md"
              />

              <span>
                <p className="font-semibold text-[25px]">
                  {instituteById?.data?.instituteName || "NA"}
                </p>
                <p className="font-normal text-[16px]">
                  {instituteById?.data?.country || "NA"}
                </p>
              </span>
            </span>
            <div className="mt-3 flex items-center justify-between gap-4 ml-8 md:mr-[65%] sm:mr-[50%]">
              {(role === "3" || role === "2") && (
                <span
                  onClick={() => {
                    shortlistInstitute(instituteById?.data?._id);
                  }}
                  className="bg-white border border-[#464255] gap-2 md:w-1/2 sm:px-6 justify-center py-1.5 text-[14px] cursor-pointer flex items-center"
                >
                  <span className="md:text-[19px] sm:text-[14px]">
                    {status === "added" ? (
                      <span className="text-[#464255]">
                        <FaStar />
                      </span>
                    ) : (
                      <CiStar />
                    )}
                  </span>{" "}
                  <span>Shortlist</span>
                </span>
              )}

              {role !== "0" &&
                role !== "1" &&
                (role === "3" ? (
                  <span
                    onClick={handleOpenOpt}
                    className="bg-primary px-6 py-2 cursor-pointer w-[60%] text-center text-white text-[14px]"
                  >
                    Apply Now
                  </span>
                ) : (
                  <Link
                    to="/agent/student-lists"
                    state={{
                      country: instituteById?.data?.country,
                      institute: instituteById?.data?.instituteName,
                    }}
                    className="bg-primary px-6 py-2 cursor-pointer w-[60%] text-center text-white text-[14px]"
                  >
                    Apply Now
                  </Link>
                ))}
            </div>
          </div>
          {!instituteById && !loading ? (
            <div
              className={`w-full  mt-12 
            ml-[53%]`}
            >
              <Loader />
            </div>
          ) : !instituteById?.data?.aboutCollegeOrInstitute &&
            !instituteById?.data?.popularCourses &&
            !instituteById?.data?.keyHighlights &&
            !instituteById?.data?.admissionAndFacilities ? (
            <div className="ml-52 pt-12">
              <Dnf
                dnfImg={nodata}
                customClass={"px-36 -mt-12"}
                headingText="No Information Available!"
                bodyText="The information for this section is currently not available, Please check back later or contact the support team for more details."
              />
            </div>
          ) : (
            <>
              <div className="md:ml-[19%] sm:ml-[26%] mr-6 mt-6 pl-[2%] rounded-md pt-6 pb-8 bg-white border-b-2 border-[#E8E8E8]">
                <span className="flex items-center gap-2">
                  <span className="text-[20px]">
                    <MdInfoOutline />
                  </span>
                  <span className="font-medium ">
                    About {instituteById?.data?.instituteName || "NA"}
                  </span>
                </span>
                <span className="font-normal text-[14px] ml-7">
                  {instituteById?.data?.aboutCollegeOrInstitute ? (
                    <ul>
                      {instituteById.data.aboutCollegeOrInstitute
                        .split("&")
                        .map(
                          (item, index) =>
                            item.trim() && <li key={index}>{item.trim()}</li>
                        )}
                    </ul>
                  ) : (
                    "NA"
                  )}
                </span>
              </div>
              {instituteById?.data?.websiteUrl && (
              <div className="md:ml-[19%] sm:ml-[26%] mr-6 mt-6 pl-[2%] rounded-md pt-6 pb-8 bg-white border-b-2 border-[#E8E8E8]">
                <span className="flex items-center gap-2">
                  <span className="text-[20px]">
                    <MdInfoOutline />
                  </span>
                  
                  <p className="font-medium">University / College Website</p>
                </span>
               
                  <a
                    href={formattedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-normal text-[14px] text-blue-500 cursor-pointer underline"
                  >
                    Website Link
                  </a>
              </div>
            )}

              <div className="md:ml-[19%] sm:ml-[26%] mr-6 mt-6 pl-[2%] rounded-md pt-6 pb-8 bg-white border-b-2 border-[#E8E8E8]">
                <span className="flex items-center gap-2">
                  <span className="text-[20px]">
                    <AiOutlineCheckCircle />
                  </span>
                  <span className="font-medium">
                    Key Highlights/ Requirements
                  </span>
                </span>
                <span className="font-normal text-[14px] ml-7">
                  <span className="font-normal text-[14px] ml-7">
                    {instituteById?.data?.keyHighlights ? (
                      <ul>
                        {instituteById.data.keyHighlights
                          .split("&")
                          .map(
                            (item, index) =>
                              item.trim() && <li key={index}>{item.trim()}</li>
                          )}
                      </ul>
                    ) : (
                      "NA"
                    )}
                  </span>
                </span>
              </div>
              <div className="md:ml-[19%] sm:ml-[26%] mr-6 mt-6 pl-[2%] rounded-md pt-6 pb-8 bg-white border-b-2 border-[#E8E8E8]">
                <span className="flex items-center gap-2">
                  <span className="text-[20px]">
                    <BiBookBookmark />
                  </span>
                  <span className="font-medium">Popular Courses/ Programs</span>
                </span>
                <span className="font-normal text-[14px] ml-7">
                  <span className="font-normal text-[14px] ml-7">
                    {instituteById?.data?.popularCourses ? (
                      <ul>
                        {instituteById.data.popularCourses
                          .split("&")
                          .map(
                            (item, index) =>
                              item.trim() && <li key={index}>{item.trim()}</li>
                          )}
                      </ul>
                    ) : (
                      "NA"
                    )}
                  </span>
                </span>
              </div>

              <div className="md:ml-[19%] sm:ml-[26%] mb-20 mr-6 mt-6 pl-[2%] rounded-md pt-6 pb-8 bg-white border-b-2 border-[#E8E8E8]">
                <span className="flex items-center gap-2">
                  <span className="text-[20px]">
                    <FaBuildingFlag />
                  </span>
                  <span className="font-medium">
                    Admissions, Facilitities and Charges
                  </span>
                </span>
                <span className="font-normal text-[14px]">
                  <span className="font-normal text-[14px] ml-7">
                    {instituteById?.data?.admissionAndFacilities ? (
                      <ul>
                        {instituteById.data.admissionAndFacilities
                          .split("&")
                          .map(
                            (item, index) =>
                              item.trim() && <li key={index}>{item.trim()}</li>
                          )}
                      </ul>
                    ) : (
                      "NA"
                    )}
                  </span>
                </span>
              </div>
            </>
          )}
        </>
      </div>

      <ApplicationChoosePop
        isOpenOpt={isOpenOpt}
        closeOpt={closeOpt}
        state={{
          country: instituteById?.data?.country,
          institute: instituteById?.data?.instituteName,
        }}
      />
    </>
  );
};

export default InstituteView;

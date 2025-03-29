import React, { useState } from "react";
import { CiStar } from "react-icons/ci";
import {
  FaExclamation,
  FaCheck,
  FaStar,
  FaGraduationCap,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import ApplicationChoosePop from "./ApplicationChoosePop";
import { AiOutlineBulb } from "react-icons/ai";
import { cardLogo } from "../../assets";
import { emptyData } from "../../features/generalSlice";
import { useDispatch } from "react-redux";
import { IoIosInformationCircleOutline } from "react-icons/io";

const InstituteCard = ({
  institutename,
  country,
  shortlistInstitute,
  instituteId,
  customState,
  data,
}) => {
  const dispatch = useDispatch();
  const role = localStorage.getItem("role");
  const [isHovered, setIsHovered] = useState(false);
  const [isOpenOpt, setIsOpenOpt] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  // const availableApplications =  studentApplicationData?.applications?.filter(

  // )

  const items = data?.admissionAndFacilities
    ? data.admissionAndFacilities
        ?.split("&")
        ?.map((item, index) => item.trim() && { text: item.trim(), key: index })
        .filter(Boolean)
    : [];
  const displayedItems = showMore ? items : items.slice(0, 3);


  const closeOpt = () => {
    setIsOpenOpt(false);
  };

  const handleOpenOpt = () => {
    setIsOpenOpt(true);
  };
  const formattedUrl =
    data?.websiteUrl && !/^https?:\/\//i.test(data?.websiteUrl)
      ? `http://${data?.websiteUrl}`
      : data?.websiteUrl;
  return (
    <>
      <div className="bg-[#FFF7F7] rounded-md  font-poppins border border-[#E8E8E8] flex flex-col h-full ">
        <span className="flex-grow flex flex-col pt-6 px-4 pb-3 bg-white">
          <span className="flex flex-row items-start justify-between ">
            <span>
              <span className="bg-[#FFEFA0] rounded-md flex items-center  justify-center mb-3 w-[32px] h-[32px]">
                <img src={cardLogo} alt="" className="w-[16px] h-[16px]" />
              </span>
            </span>
            <span
              className={`px-3 py-[1px] rounded-xl text-[13px]  ${
                data?.instituteStatus === "open" || "Open"
                  ? "text-[#459F49] bg-[#BDFFCB] border border-[#459F49]"
                  : "text-primary bg-[#FFBEBB] border border-primary"
              }`}
            >
              {data?.instituteStatus === "open" || "Open"
                ? "Open"
                : data?.instituteStatus === "close" || "Close"
                ? "Close"
                : data?.instituteStatus || "NA"}
            </span>
          </span>
          <p
            className={`font-semibold text-[16px] text-sidebar leading-snug"
            }`} // Apply different style when hovered
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {institutename?.length > 55
              ? `${institutename.slice(0, 55)}...`
              : institutename}
          </p>
          {isHovered && (
            <div className="text-start absolute  text-[13px] w-auto px-3 py-1 bg-white border  rounded-lg">
              <p> {institutename}</p>
            </div>
          )}
          <p className="font-normal text-[14px] text-body">{country}</p>
          {data?.websiteUrl && (
            <a
              href={formattedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-normal text-[14px] text-blue-500 cursor-pointer underline"
            >
              Website Link
            </a>
          )}
        </span>
        <div>
          <span className="flex items-center text-[#6E7170] gap-3 px-4 pt-3">
            <FaGraduationCap />
            <span>Course/ Programs</span>
          </span>
          <div className="text-black pl-4 text-[14px] font-normal">
          {data?.popularCourses ? (
                      <ul>
                        {data?.popularCourses
                          .split("&")
                          .map(
                            (item, index) =>
                              item.trim() && <li key={index}>{item.trim()}</li>
                          )}
                      </ul>
                    ) : (
                      "NA"
                    )}
          </div>

          <p className="text-[#6E7170] pl-4 text-[16px] pt-2">
          Intakes
          </p>
          <span className="flex flex-row items-center px-4 pt-2 gap-3">
            {Array.isArray(data?.inTake) && data?.inTake.length > 0
              ? data.inTake.slice(0, 3).map((item, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-md text-[13px] border ${
                      index === 0
                        ? "bg-[#EFFFEC] border-[#389527] text-[#389527]"
                        : index === 1
                        ? "bg-[#ECFEFF] border-[#007C83] text-[#007C83]"
                        : "bg-[#F5ECFF] border-[#5F2F95] text-[#5F2F95]"
                    }`}
                  >
                    {item || "NA"}
                  </span>
                ))
              : "NA"}
          </span>

          <span className="flex items-center text-[#6E7170] gap-3 px-4 pt-3 text-[16px]">
            <AiOutlineBulb />
            <span>Key Requirements</span>
          </span>
          <p className="text-black pl-4 text-[14px] font-normal">
            {data?.keyHighlights ? (
              <ul>
                {data.keyHighlights
                  ?.split("&")
                  ?.map(
                    (item, index) =>
                      item.trim() && { text: item.trim(), key: index }
                  )
                  .filter(Boolean)
                  .slice(0, 4)
                  .map((item) => (
                    <p key={item.key}>{item.text}</p>
                  ))}
              </ul>
            ) : (
              "NA"
            )}
          </p>

          <span className="flex items-center text-[#6E7170] gap-3 px-4 pt-3 text-[16px]">
            <IoIosInformationCircleOutline />
            <span>   Admissions, Facilitities and Charges</span>
          </span>
          <p className="text-black pl-4 text-[14px] font-normal">
          {items.length ? (
        <div>
          <ul className={showMore ? "" : "line-clamp-3"}>
            {displayedItems.map((item) => (
              <li key={item.key}>{item.text}</li>
            ))}
          </ul>
          {items.length > 3 && (
            <button
              className="text-blue-500 mt-2 underline"
              onClick={() => setShowMore(!showMore)}
            >
              {showMore ? "Show Less" : "Show More"}
            </button>
          )}
        </div>
      ) : (
        "NA"
      )}
          </p>
          
{/* 
          <div className="bg-[#DFF6FF] text-[#014D6E] mx-4 px-3 text-[15px] mt-3 py-2 rounded-md">
            <span className="flex items-center justify-between">
              <span>Offer Letter Fee</span>
              <span>${data?.offerLetterPrice || "NA"}</span>
            </span>
          </div> */}


        </div>
        <div className="mt-7 flex items-center justify-between gap-4 w-full px-4 pb-6">
          <span
            onClick={() => {
              shortlistInstitute(instituteId);
            }}
            className="bg-white border border-[#464255]   gap-2 w-1/2 justify-center py-1.5 text-[14px] cursor-pointer flex items-center"
          >
            <span className="md:text-[19px] sm:text-[14px] ">
              {data?.status === "added" ? (
                <span className="text-[#464255]">
                  <FaStar />
                </span>
              ) : (
                <CiStar />
              )}
            </span>{" "}
            <span>Shortlist</span>
          </span>
          {role === "3" ? (
            <Link
              to="/institute-view"
              state={{ id: instituteId }}
              className="bg-primary  px-6 py-2 cursor-pointer w-1/2 text-center text-white text-[14px]"
            >
              See Details
            </Link>
          ) : (
            <Link
              to="/institute-view"
              onClick={()=>dispatch(emptyData())}
              state={{ id: instituteId }}
              className="bg-primary  px-6 py-2 cursor-pointer w-1/2 text-center text-white text-[14px]"
            >
              See details
            </Link>
          )}
        </div>
      </div>
      <ApplicationChoosePop
        isOpenOpt={isOpenOpt}
        closeOpt={closeOpt}
        state={customState}
      />
    </>
  );
};

const StatusComp = ({
  statusOne,
  statusTwo,
  statusThree,
  statusFour,
  statusFive,
  statusSix,
}) => {
  const statusList = [
    statusOne,
    statusTwo,
    "current",
    statusFour,
    statusFive,
    statusSix,
  ];
  //
  const cardLabels = [
    "Profile completed",
    "Offer letter approved",
    "Payment done",
    "Course fee Application",
    "Visa lodgement",
    "Visa outcome",
  ];

  const completeStatusList = [
    ...statusList,
    ...Array(6 - statusList.length).fill("pending"),
  ];

  return (
    <div className="  grid grid-cols-6  gap-2 w-full">
      {completeStatusList.map((status, index) => (
        <div key={index} className="flex flex-col items-center relative">
          <div
            className={`status-card flex items-center justify-center border rounded-md w-[50px] h-[50px] ${
              status === "done"
                ? "bg-[#46A737] text-white"
                : status === "current"
                ? " border border-[#464255] "
                : "bg-[#D83737]"
            }`}
          >
            {status === "current" ? (
              <span className="text-lg font-bold ">{index + 1}</span>
            ) : status === "done" ? (
              <FaCheck className="text-white text-xl" />
            ) : (
              <FaExclamation className="text-white text-xl" />
            )}
          </div>
          <p className="mt-2 text-center text-body text-sm font-normal">
            {cardLabels[index]}
          </p>

          {index < completeStatusList.length - 1 && (
            <div className="border border-gray-300 absolute top-1/2 left-[140px]  transform -translate-y-1/2 w-[50%] h-[1px] mx-auto" />
          )}
        </div>
      ))}
    </div>
  );
};

export { InstituteCard, StatusComp };

export default InstituteCard;

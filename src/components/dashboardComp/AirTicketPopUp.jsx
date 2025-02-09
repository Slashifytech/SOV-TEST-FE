import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatDate } from "./../../constant/commonfunction";
import { RxCross2 } from "react-icons/rx";
import { fetchAirTicketById } from "../../features/generalSlice";
import { BiSolidUserDetail } from "react-icons/bi";
import { RiFileUploadLine } from "react-icons/ri";
import { FaRegEye } from "react-icons/fa";
import { fetchAirTicketByIdAdmin } from "../../features/adminSlice";

const AirTicketPopUp = ({ isOpen, closePopUp, id }) => {
  const role = localStorage.getItem("role");
  const { airTicketById } = useSelector((state) => state.general);
  const { getAirTicketById } = useSelector((state) => state.admin);
  const airTicketData =
    role === "0" || role === "1" ? getAirTicketById : airTicketById;
  const dispatch = useDispatch();

  useEffect(() => {
    if (role === "0" || role === "1") {
      dispatch(fetchAirTicketByIdAdmin(id));
    } else dispatch(fetchAirTicketById(id));
  }, [id]);
  return (
    <>
      {isOpen && (
        <div
          className={`fixed inset-0 flex items-center justify-center popup-backdrop z-50  sm:px-52  px-6 ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <div className="bg-white pb-9  rounded-lg md:w-[70%] w-full  relative p-9  font-poppins app-open-animation ">
            <span
              onClick={closePopUp}
              className="absolute right-9 text-[28px] cursor-pointer"
            >
              {" "}
              <RxCross2 />
            </span>
            <span className="flex flex-col justify-start">
              <span
                className={`rounded-2xl px-3 py-1 text-start text-secondary text-[23px] `}
              >
                Air-Ticket Details
              </span>
              <hr />
              <span className="flex flex-row items-center gap-3 mt-6">
                <span className="text-[32px]">
                  <BiSolidUserDetail />
                </span>
                <p className="text-sidebar text-[16px]  font-semibold">
                  User Information
                </p>
              </span>
              <div className="flex flex-row justify-between    items-start w-full">
                <span>
                  <span className="flex flex-col ">
                    <span className="text-[14px] text-sidebar mt-6 font-medium">
                      Full Name
                    </span>
                    <span className="text-[13px] mt-1 text-sidebar  font-normal">
                      {airTicketData?.personName}
                    </span>
                  </span>
                  <span className="flex flex-col ">
                    <span className="text-[14px] text-sidebar mt-6 font-medium">
                      Destination Location
                    </span>
                    <span className="text-[13px] mt-1 text-sidebar  font-normal">
                      {airTicketData?.destinationLocation}
                    </span>
                    <span className=" flex flex-col">
                      <span className="text-[14px] text-sidebar mt-6 font-medium">
                        Travel Date
                      </span>
                      <span className="text-[13px] mt-1 text-sidebar  font-normal">
                        {formatDate(airTicketData?.travelDate) || "NA"}
                      </span>
                    </span>
                  </span>
                </span>
                <span className=" flex flex-col">
                  <span className="text-[14px] text-sidebar mt-6 font-medium">
                    Source Location
                  </span>
                  <span className="text-[13px] mt-1 text-sidebar  font-normal">
                    {airTicketData?.sourceLocation}
                  </span>
                  <span className=" flex flex-col">
                    <span className="text-[14px] text-sidebar mt-6 font-medium">
                      Flight Preferences
                    </span>
                    <span className="text-[13px] mt-1 text-sidebar  font-normal capitalize">
                      {airTicketData?.flightPreference}
                    </span>
                  </span>
                </span>
                <span></span>
              </div>
            </span>

            <span className="flex flex-col justify-start mb-9">
              <span className="flex flex-row items-center gap-3 mt-6 text-sidebar">
                <span className="text-[28px]">
                  <RiFileUploadLine />
                </span>
                <p className=" text-[16px]  font-semibold">
                  Uploaded Documents
                </p>
              </span>
              <div className="flex flex-row justify-between    items-start w-full">
                <span>
                  <span className="flex flex-col ">
                    <span className="text-[14px] text-sidebar mt-6 font-medium">
                      Passport
                    </span>

                    <span className="font-medium">
                      {airTicketData?.passportDetails ? (
                        <a
                          className="flex items-center gap-3 text-primary font-medium"
                          href={airTicketData?.passportDetails}
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
                    </span>
                  </span>
                </span>
                <span className=" flex flex-col">
                  <span className="text-[14px] text-sidebar mt-6 font-medium">
                    PPR/Visa Stamp
                  </span>
                  <span className="font-medium">
                    {Array.isArray(airTicketData?.pprOrVisaStamp) &&
                    airTicketData?.pprOrVisaStamp.some((url) =>
                      url.startsWith("https")
                    ) ? (
                      <a
                        className="flex items-center gap-3 text-primary font-medium"
                        href={airTicketData?.pprOrVisaStamp.find((url) =>
                          url.startsWith("https")
                        )}
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
                  </span>
                </span>
                <span></span>
              </div>
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default AirTicketPopUp;

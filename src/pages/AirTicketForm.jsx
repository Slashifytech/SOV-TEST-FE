import React, { useEffect, useState } from "react";
import Header from "../components/dashboardComp/Header";
import { FaStar } from "react-icons/fa";
import AgentSidebar from "../components/dashboardComp/AgentSidebar";
import Sidebar from "../components/dashboardComp/Sidebar";
import Register from "../components/reusable/Register";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import FileUpload from "../components/reusable/DragAndDrop";
import { v4 as uuidv4 } from "uuid";
import { storage } from "../utils/fireBase";
import { toast } from "react-toastify";
import { addAirTicket, updateAirTicket } from "../features/generalApi";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchAirTicketById } from "../features/generalSlice";
import { useDispatch, useSelector } from "react-redux";
import { airTicketOption } from "../constant/data";
import { SelectComponent } from "../components/reusable/Input";
import socketServiceInstance from "../services/socket";

const AirTicketForm = () => {
  const role = localStorage.getItem("role");
  const { airTicketById } = useSelector((state) => state.general);
  const { agentData } = useSelector((state) => state.agent);
  const { studentInfoData } = useSelector((state) => state.student);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const id = location?.state?.id;
  console.log(location);
  const [resetppr, setresetPpr] = useState(false);
  const [resetPassport, setResetPassport] = useState(false);
  const [airTicketData, setAirTicketData] = useState({
    sourceLocation: "",
    destinationLocation: "",
    passportDetails: "",
    pprOrVisaStamp: "",
    travelDate: "",
    flightPreference: "",
    personName: "",
  });
  const [errors, setErrors] = useState({});

  const handleInput = (e) => {
    const { name, value } = e.target;

    setAirTicketData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  useEffect(() => {
    dispatch(fetchAirTicketById(id));
  }, [id]);
  useEffect(() => {
    if (airTicketById) {
      setAirTicketData((prev) => ({
        ...prev,
        ...airTicketById,
        travelDate: airTicketById.travelDate
          ? new Date(airTicketById.travelDate).toISOString().split("T")[0] // Convert to "YYYY-MM-DD"
          : "",
      }));
    }
  }, [airTicketById]);

  // Validation function
  const validateFields = () => {
    let validationErrors = {};
    if (!airTicketData.sourceLocation.trim()) {
      validationErrors.sourceLocation = "Source location is required.";
    }
    if (!airTicketData.destinationLocation.trim()) {
      validationErrors.destinationLocation =
        "Destination location is required.";
    }

    if (!airTicketData.travelDate.trim()) {
      validationErrors.travelDate = "Travel date is required.";
    }
    if (!airTicketData.flightPreference.trim()) {
      validationErrors.flightPreference = "Flight preference is required.";
    }
    if (!airTicketData.personName.trim()) {
      validationErrors.personName = "Person name is required.";
    }

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const handleFileUpload = async (files, uploadType) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    const uniqueFileName = `${uuidv4()}-${file.name}`;
    const storageRef = ref(storage, `uploads/airTicket/${uniqueFileName}`);

    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      toast.success(`${file.name} uploaded successfully!`);

      if (uploadType === "passport") {
        setAirTicketData((prevData) => ({
          ...prevData,
          passportDetails: downloadURL,
        }));
      } else if (uploadType === "pprOrVisaStamp") {
        setAirTicketData((prevData) => ({
          ...prevData,
          pprOrVisaStamp: downloadURL,
        }));
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error(`Error uploading ${file.name}. Please try again.`);
    }
  };

  //delete image and file from firebase

  const deleteFile = async (fileUrl, uploadType) => {
    if (!fileUrl) return;

    const storageRef = ref(storage, fileUrl);

    try {
      await deleteObject(storageRef);
      toast.success("File deleted successfully!");
      setResetPassport(true);
      setresetPpr(true);

      setAirTicketData((prevData) => {
        const updatedData = { ...prevData };

        if (uploadType === "passport") {
          updatedData.passportDetails = "";
        } else if (uploadType === "pprOrVisaStamp") {
          updatedData.pprOrVisaStamp = "";
        }

        setResetPassport(true);
        setresetPpr(true);

        return updatedData;
      });

    //   console.log("Updated visaComplete after delete");
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Error deleting file. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      //   console.log("Form data submitted:", airTicketData);
      toast.error(`Please fill all required fields`);
      return;
    }
    try {
      let res;
      res = id
        ? await updateAirTicket(airTicketData, id)
        : await addAirTicket(airTicketData);
      toast.success(res?.message || "Air ticket added successfully");
      if (role === "2") {
        if (socketServiceInstance.isConnected()) {
          //from agent to admin
          const notificationData = {
            title: " AIR_TICKET_REQUEST_AGENT",
            message: `${agentData?.companyDetails?.businessName} ${agentData?.agId} has submitted the air ticket request ${res?.data?.airId} `,
            path: "/admin/air-ticket-lists",
            recieverId: "",
          };
          socketServiceInstance.socket.emit(
            "NOTIFICATION_AGENT_TO_ADMIN",
            notificationData
          );
        } else {
          console.error("Socket connection failed, cannot emit notification.");
        }
      }
      if (role === "3") {
        if (socketServiceInstance.isConnected()) {
          //from student to admin

          const notificationData = {
            title: "  AIR_TICKET_REQUEST_STUDENT",
            message: `${
              studentInfoData?.data?.studentInformation?.personalInformation
                ?.firstName +
              " " +
              studentInfoData?.data?.studentInformation?.personalInformation
                ?.lastName
            } ${
              studentInfoData?.data?.studentInformation?.stId
            }  has submitted the air ticket request ${res?.data?.airId}.  `,

            path: "/admin/air-ticket-lists",
            recieverId: agentData?._id,
          };

          socketServiceInstance.socket.emit(
            "NOTIFICATION_STUDENT_TO_ADMIN",
            notificationData
          );
        } else {
          console.error("Socket connection failed, cannot emit notification.");
        }
      }
      navigate("/air-ticket/lists");
    } catch (error) {
      console.log("Something Went Werong:", error);
      toast.error(error?.message || `Something Went Wrong`);
    }
  };

  return (
    <>
      <Header
        icon={location?.pathname === "/student/shortlist" ? <FaStar /> : null}
      />
      <div>
        <span className="fixed overflow-y-scroll scrollbar-hide  bg-white ">
          {role === "3" ? <Sidebar /> : role === "2" ? <AgentSidebar /> : null}
        </span>
        <div className="ml-[17%] pt-16 pb-8 bg-white border-b-2 border-[#E8E8E8]">
          <span className="flex  items-center">
            <p className="text-[28px] font-bold text-sidebar mt-6 md:ml-9 sm:ml-20">
              Air - Ticket Form
            </p>
          </span>
        </div>
        <div className="ml-[30%] mr-[15%]">
          <div className="bg-white rounded-xl px-8 py-4 pb-12 mt-8">
            <span className="font-bold text-[25px] text-secondary">
              User Information
            </span>
            <Register
              label="Full Name"
              imp="*"
              name="personName"
              value={airTicketData.personName}
              handleInput={handleInput}
              placeHolder="Full Name"
              errors={errors.personName}
            />
            <div className="flex flex-row items-center gap-6 w-[100%] ">
              <span className="w-[50%]">
                <Register
                  label="Source Location"
                  imp="*"
                  name="sourceLocation"
                  value={airTicketData.sourceLocation}
                  handleInput={handleInput}
                  placeHolder="Enter the departure city or airport"
                  errors={errors.sourceLocation}
                />
                <Register
                  label="Travel Date"
                  imp="*"
                  name="travelDate"
                  type="date"
                  value={airTicketData.travelDate}
                  handleInput={handleInput}
                  placeHolder="Travel Date"
                  errors={errors.travelDate}
                />
              </span>
              <span className="w-[50%]">
                <Register
                  label="Destination Location"
                  imp="*"
                  name="destinationLocation"
                  value={airTicketData.destinationLocation}
                  handleInput={handleInput}
                  placeHolder="Enter the arrival city or airport"
                  errors={errors.destinationLocation}
                />

                <SelectComponent
                  name="flightPreference"
                  label="Flight Preferences"
                  options={airTicketOption}
                  value={airTicketData.flightPreference}
                  handleChange={handleInput}
                />
                {errors.flightPreference && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors.flightPreference}
                  </p>
                )}
              </span>
            </div>
          </div>
          <div className="bg-white rounded-xl px-8 py-4 pb-12 mt-8">
            <span className="font-bold text-[25px] text-secondary">
              Upload Documents
            </span>

            <FileUpload
              label="Passport"
              acceptedFormats={{
                "application/pdf": [".pdf"],
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                  [".docx"],
                "application/msword": [".doc"],
              }}
              reset={resetPassport}
              setReset={setResetPassport}
              onFilesUploaded={(files) => handleFileUpload(files, "passport")}
              customClass="border-dashed"
              value={airTicketData.passportDetails}
            />
            {errors.passportDetails && (
              <p className="text-red-500 mt-1 text-sm">
                {errors.passportDetails}
              </p>
            )}
            {airTicketData.passportDetails && (
              <div className="mt-4">
                <p className="text-secondary font-semibold">
                  Uploaded Document:
                </p>
                <div className="flex items-center mt-2">
                  <a
                    href={airTicketData.passportDetails}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary rounded-sm px-6 py-2 border border-greyish "
                  >
                    Uploaded Passport
                  </a>
                  <button
                    onClick={() =>
                      deleteFile(airTicketData.passportDetails, "passport")
                    }
                    className="ml-4 text-red-500 text-[21px]"
                  >
                    <RiDeleteBin6Line />
                  </button>
                </div>
              </div>
            )}

            <FileUpload
              label="Upload PPR/Visa Stamp"
              acceptedFormats={{
                "application/pdf": [".pdf"],
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                  [".docx"],
                "application/msword": [".doc"],
              }}
              reset={resetppr}
              setReset={setresetPpr}
              onFilesUploaded={(files) =>
                handleFileUpload(files, "pprOrVisaStamp")
              }
              customClass="border-dashed"
              value={airTicketData.pprOrVisaStamp}
            />
            {errors.pprOrVisaStamp && (
              <p className="text-red-500 mt-1 text-sm">
                {errors.pprOrVisaStamp}
              </p>
            )}
            {airTicketData.pprOrVisaStamp && (
              <div className="mt-4">
                <p className="text-secondary font-semibold">
                  Uploaded Document:
                </p>
                <div className="flex items-center mt-2">
                  <a
                    href={airTicketData.pprOrVisaStamp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary rounded-sm px-6 py-2 border border-greyish"
                  >
                    Uploaded PPR or Visa Stamp
                  </a>
                  <button
                    onClick={() =>
                      deleteFile(airTicketData.pprOrVisaStamp, "pprOrVisaStamp")
                    }
                    className="ml-4 text-red-500 text-[21px]"
                  >
                    <RiDeleteBin6Line />
                  </button>
                </div>
              </div>
            )}
          </div>
          <span className="flex items-cente justify-end">
            <span
              onClick={handleSubmit}
              className="bg-primary px-6 py-2 text-white  rounded-md mt-9 mb-20 cursor-pointer"
            >
              Submit
            </span>
          </span>
        </div>
      </div>
    </>
  );
};

export default AirTicketForm;

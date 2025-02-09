import { Card, Typography } from "@material-tailwind/react";
import { Link, useLocation } from "react-router-dom";
import TicketResolvePop from "./adminComps/TicketResolvePop";
import { useEffect, useState } from "react";
import { removeDocument } from "../features/generalApi";
import { toast } from "react-toastify";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage } from "../utils/fireBase";
import { getDocumentAll } from "../features/generalSlice";
import { useDispatch, useSelector } from "react-redux";
import { FiDownloadCloud } from "react-icons/fi";
import ViewTicketPop from "./dashboardComp/ViewTicketPop";
import ApplicationChoosePop from "./dashboardComp/ApplicationChoosePop";
import {
  deleteApplication,
  deleteInstitute,
  removeAgentorStudent,
  ticketResolve,
  uploadApplications,
} from "../features/adminApi";
import socketServiceInstance from "../services/socket";
import { v4 as uuidv4 } from "uuid";
import { MdOutlineUploadFile } from "react-icons/md";
import RemovePopUp from "./adminComps/RemovePopUp";
import {
  adminUrlData,
  getAllAgentList,
  getAllStudentList,
  getAllTickets,
  getInstitutes,
} from "../features/adminSlice";
import { RiDeleteBin6Line } from "react-icons/ri";
import { extractFileName, extractFileNames } from "../constant/commonfunction";
import { FaRegEye } from "react-icons/fa";
import { studentApplications } from "../features/agentSlice";
import DocDeletePop from "./DocDeletePop";
import DeletePop from "./reusable/DeletePop";
import { formatDate } from "./../constant/commonfunction";
import { FaPencil } from "react-icons/fa6";
import AirTicketPopUp from "./dashboardComp/AirTicketPopUp";

export function CustomTable({
  tableHead = [],
  tableRows = [],
  action,
  icon,
  link,
  customClass,
  SecondLink,
  SecondAction,
}) {
  const [isOpenOpt, setIsOpenOpt] = useState(false);
  const [isId, setIsId] = useState(false);
  const closeOpt = () => {
    setIsOpenOpt(false);
  };

  const handleOpenOpt = (id) => {
    setIsOpenOpt(true);
    setIsId(id);
  };
  return (
    <>
      <Card className="h-full w-full overflow-scroll scrollbar-hide font-poppins">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {tableHead.map((head) => (
                <th
                  key={head}
                  className="border-b border-blue-gray-100 bg-input p-4"
                >
                  <Typography
                    variant="small"
                    color="sidebar"
                    className="font-medium leading-none opacity-70 "
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row, index) => (
              <tr key={index} className="even:bg-blue-gray-50/50">
                {Object.entries(row).map(([key, value], idx) =>
                  key !== "customLinkState" ? ( // Exclude customLinkState from visible cells
                    <td key={idx} className="p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {value}
                      </Typography>
                    </td>
                  ) : null
                )}
                <td className="p-4">
                  <Typography
                    as="a"
                    href="#"
                    variant="small"
                    color="blue-gray"
                    className="font-medium"
                  >
                    <Link
                      to={link}
                      state={row.customLinkState}
                      className="flex flex-row items-center gap-2"
                    >
                      {" "}
                      <span className="text-primary">{icon}</span>{" "}
                      <span className="font-body">{action}</span>
                    </Link>
                  </Typography>
                </td>

                <td className="p-4">
                  <Typography
                    as="a"
                    href="#"
                    variant="small"
                    color="blue-gray"
                    className="font-medium"
                  >
                    <span
                      onClick={() => handleOpenOpt(row.customLinkState)}
                      className={`${customClass}`}
                    >
                      {" "}
                      <span className="font-body">{SecondAction}</span>
                    </span>
                  </Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <ApplicationChoosePop
        isOpenOpt={isOpenOpt}
        closeOpt={closeOpt}
        state={isId}
      />
    </>
  );
}

export function CustomTableTwo({
  tableHead = [],
  tableRows = [],
  action,
  icon,
  link,
  customClass,
  SecondLink,
  secondCustomState,
  SecondAction,
  customData,
  customDataTwo,
  customDataThree,
}) {
  const location = useLocation();
  const dispatch = useDispatch();
  const nullval = null;
  const [uploadingState, setUploadingState] = useState({});
  const { getStudentDataById } = useSelector((state) => state.admin);

  const handleFileUpload = async (e, studentId, type, rowId) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingState((prev) => ({ ...prev, [rowId]: true }));

    const uniqueFileName = `${uuidv4()}-${file.name}`;
    const storageRef = ref(
      storage,
      `uploads/adminApplications/test${uniqueFileName}`
    );

    try {
      // Upload file to Firebase
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Call backend API to save file info
      const uploadData = {
        document: [downloadURL],
        documentName: file.name,
        documentType: type,
        studentId: studentId,
        applicationId: rowId,
      };
      await uploadApplications(uploadData); // Update with your API call
      dispatch(
        studentApplications({ nullval, nullval, studentId, nullval, nullval })
      );

      if (getStudentDataById.studentInformation.agentId) {
        if (socketServiceInstance.isConnected()) {
          //from agent to admin
          const notificationData = {
            title: " RECEIVED_OFFER_LETTER_AGENT",
            message: `Received the document from admin  ${
              getStudentDataById?.studentInformation?.personalInformation
                .firstName +
              " " +
              getStudentDataById?.studentInformation?.personalInformation
                .lastName
            } ${getStudentDataById?.studentInformation?.stId} `,
            path: "/student-profile",
            pathData: {
              studentId: getStudentDataById?.studentInformation?._id,
            },
            recieverId: getStudentDataById.studentInformation.agentId,
          };

          socketServiceInstance.socket.emit(
            "NOTIFICATION_ADMIN_TO_AGENT",
            notificationData
          );
        } else {
          console.error("Socket connection failed, cannot emit notification.");
        }
      }
      if (getStudentDataById.studentInformation.studentId) {
        if (socketServiceInstance.isConnected()) {
          //from student to admin
          const notificationData = {
            title: " RECEIVED_OFFER_LETTER_STUDENT",
            message: `Received the document from admin  ${
              getStudentDataById?.studentInformation?.personalInformation
                .firstName +
              " " +
              getStudentDataById?.studentInformation?.personalInformation
                .lastName
            } ${getStudentDataById?.studentInformation?.stId} `,
            path: "/student/document",
            pathData: {
              studentId: getStudentDataById?.studentInformation?._id,
            },
            recieverId: getStudentDataById.studentInformation.studentId,
          };
          socketServiceInstance.socket.emit(
            "NOTIFICATION_ADMIN_TO_STUDENT",
            notificationData
          );
        } else {
          console.error("Socket connection failed, cannot emit notification.");
        }
      }

      toast.success(`${file.name} uploaded successfully!`);

      // Fetch the updated application data
      // dispatch(fetchApplications());
      setUploadingState((prev) => ({ ...prev, [rowId]: false }));
    } catch (error) {
      toast.error("Error uploading file. Please try again.");
      console.log(error);
    } finally {
      setUploadingState((prev) => ({ ...prev, [rowId]: false }));
    }
  };

  const handleFileDelete = async (fileUrl, studentId) => {
    const storageRef = ref(storage, fileUrl);

    try {
      // Delete file from Firebase
      await deleteObject(storageRef);

      await deleteApplication({ fileUrl: fileUrl });
      dispatch(
        studentApplications({ nullval, nullval, studentId, nullval, nullval })
      );

      toast.success("File deleted successfully!");
    } catch (error) {
      toast.error("Error deleting file. Please try again.");
    }
  };
  // useEffect(() => {
  //   customDataThree?.forEach((item) => {
  //     dispatch(adminUrlData(item));
  //   });
  // }, [dispatch]);

  // console.log(customDataThree, "test");

  return (
    <Card className="h-full w-full overflow-scroll scrollbar-hide font-poppins">
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            {tableHead.map((head) => (
              <th
                key={head}
                className="border-b border-blue-gray-100 bg-input p-4 "
              >
                <Typography
                  variant="small"
                  color="sidebar"
                  className="font-medium leading-none opacity-70 "
                >
                  {head}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableRows.map((row, index) => (
            <tr key={index} className="even:bg-blue-gray-50/50">
              {/* Render only the values you want to display */}
              <td className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {row.sno}
                </Typography>
              </td>
              <td className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {row?.id}
                </Typography>
              </td>
              <td className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {row.type?.offerLetter
                    ? row.type?.offerLetter?.preferences?.country
                    : row.type?.visa
                    ? row.type?.visa?.country
                    : "_"}
                </Typography>
              </td>
              <td className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {row.type?.offerLetter
                    ? "Offer Letter"
                    : row.type?.visa
                    ? "Visa Lodgement"
                    : row.type?.courseFeeApplication
                    ? "Course Fee"
                    : "NA"}
                </Typography>
              </td>
              <td className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className={`font-light text-[13px] text-white rounded-xl px-2 py-[3px] text-center ${
                    (row.type?.offerLetter?.status ||
                      row.type?.visa?.status ||
                      row.type?.courseFeeApplication?.status) === "underreview"
                      ? "bg-[#096D98]"
                      : (row.type?.offerLetter?.status ||
                          row.type?.visa?.status ||
                          row.type?.courseFeeApplication?.status) ===
                          "approved" ||
                        (row.type?.offerLetter?.status ||
                          row.type?.visa?.status ||
                          row.type?.courseFeeApplication?.status) ===
                          "withdrawalrequest" ||
                        (row.type?.offerLetter?.status ||
                          row.type?.visa?.status ||
                          row.type?.courseFeeApplication?.status) ===
                          "approvedbyembassy" ||
                        (row.type?.offerLetter?.status ||
                          row.type?.visa?.status ||
                          row.type?.courseFeeApplication?.status) ===
                          "withdrawalcomplete" ||
                        (row.type?.offerLetter?.status ||
                          row.type?.visa?.status ||
                          row.type?.courseFeeApplication?.status) ===
                          "visagranted" ||
                        (row.type?.offerLetter?.status ||
                          row.type?.visa?.status ||
                          row.type?.courseFeeApplication?.status) ===
                          "deferment"
                      ? "bg-[#09985C]"
                      : (row.type?.offerLetter?.status ||
                          row.type?.visa?.status ||
                          row.type?.courseFeeApplication?.status) ===
                          "rejected" ||
                        (row.type?.offerLetter?.status ||
                          row.type?.visa?.status ||
                          row.type?.courseFeeApplication?.status) ===
                          "rejectedbyembassy"
                      ? "bg-[#D33131]"
                      : (row.type?.offerLetter?.status ||
                          row.type?.visa?.status ||
                          row.type?.courseFeeApplication?.status) ===
                        "withdrawalcomplete"
                      ? "bg-[#D33131]"
                      : "bg-primary"
                  }`}
                >
                  {(row.type?.offerLetter?.status ||
                    row.type?.visa?.status ||
                    row.type?.courseFeeApplication?.status) === "underreview"
                    ? "Under Review"
                    : (row.type?.offerLetter?.status ||
                        row.type?.visa?.status ||
                        row.type?.courseFeeApplication?.status) === "rejected"
                    ? "Rejected"
                    : (row.type?.offerLetter?.status ||
                        row.type?.visa?.status ||
                        row.type?.courseFeeApplication?.status) === "approved"
                    ? "Approved"
                    : row.type?.visa?.status === "approvedbyembassy"
                    ? "Approved By Embassy"
                    : row.type?.visa?.status === "deferment"
                    ? "Deferment"
                    : row.type?.visa?.status === "rejectedbyembassy"
                    ? "Rejected By Embassy"
                    : row.type?.visa?.status === "visagranted"
                    ? "Visa Granted"
                    : row.type?.visa?.status === "withdrawalrequest"
                    ? "Requested for Withdrawal"
                    : row.type?.visa?.status === "withdrawalcomplete"
                    ? "Withdrawal agent"
                    : "NA"}
                </Typography>
              </td>
              {/* {console.log(row?.type?.documents)} */}
              {location.pathname === "/admin/student-applications" && (
                <td className="p-4 ">
                  <span className="flex items-center gap-3">
                    {/* View and Delete Buttons */}
                    {Array.isArray(row?.type?.documents) &&
                    row?.type?.documents.length > 0 ? (
                      <>
                        <a
                          className="flex items-center gap-3 text-primary font-medium"
                          href={row?.type?.documents[0]}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View
                        </a>
                        <button
                          className="px-4 py-1 text-primary text-[20px] rounded-md"
                          onClick={() =>
                            handleFileDelete(
                              row?.type?.documents[0],
                              row?.studentId
                            )
                          }
                        >
                          <RiDeleteBin6Line />
                        </button>
                      </>
                    ) : (
                      <div className="mt-4">
                        <Typography
                          as="label"
                          htmlFor={`pdf-upload-${row?.appId}`}
                          variant="small"
                          color="blue-gray"
                          className="font-medium cursor-pointer"
                        >
                          <span className="flex items-center gap-3 justify-center">
                            {uploadingState[row?.appId] ? (
                              "Uploading..."
                            ) : (
                              <>
                                <span className="font-normal text-sidebar">
                                  Upload
                                </span>
                                <span className="font-body text-primary text-[22px]">
                                  <MdOutlineUploadFile />
                                </span>
                              </>
                            )}
                          </span>
                        </Typography>

                        {/* Hidden File Input */}
                        <input
                          type="file"
                          id={`pdf-upload-${row?.appId}`}
                          accept="application/pdf"
                          className="hidden"
                          onChange={(e) =>
                            handleFileUpload(
                              e,
                              row?.studentId,
                              row?.type?.offerLetter
                                ? "offerletter"
                                : row?.type?.visa
                                ? "visa"
                                : row?.type?.courseFeeApplication
                                ? "coursefeeApplication"
                                : "NA",
                              row?.appId
                            )
                          }
                        />
                      </div>
                    )}
                  </span>

                  {/* Upload Section */}
                </td>
              )}

              <td className="p-4">
                <Typography
                  as="a"
                  href="#"
                  variant="small"
                  color="blue-gray"
                  className="font-medium"
                >
                  <Link
                    to={
                      row.type?.offerLetter
                        ? "/offerLetter/edit"
                        : row.type?.visa
                        ? "/visa/edit"
                        : row.type?.courseFeeApplication
                        ? "/course-fee/edit"
                        : null
                    }
                    state={row.appId}
                    className="flex flex-row items-center gap-2"
                  >
                    <span className="text-primary">{icon}</span>
                    <span className="font-body">{action}</span>
                  </Link>
                </Typography>
              </td>
              <td className="p-4">
                <Typography
                  as="a"
                  href="#"
                  variant="small"
                  color="blue-gray"
                  className="font-medium"
                >
                  <Link
                    to={SecondLink}
                    state={secondCustomState}
                    className={customClass}
                  >
                    <span className="font-body">{SecondAction}</span>
                  </Link>
                </Typography>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
export function CustomTableThree({
  tableHead = [],
  tableRows = [],
  action,
  icon,
  link,
  customClass,
  SecondLink,
  secondCustomState,
  SecondAction,
  customLinkState,
}) {
  return (
    <Card className="h-full w-full overflow-scroll scrollbar-hide font-poppins">
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            {tableHead.map((head) => (
              <th
                key={head}
                className="border-b border-blue-gray-100 bg-input p-4"
              >
                <Typography
                  variant="small"
                  color="sidebar"
                  className="font-medium leading-none opacity-70 "
                >
                  {head}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableRows.map((row, index) => (
            <tr key={index} className="even:bg-blue-gray-50/50">
              {/* Render only the values you want to display */}
              <td className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {index + 1 || "NA"}
                </Typography>
              </td>
              <td className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {row.id}
                </Typography>
              </td>

              <td className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {row.type === "offerLetter" ? "Offer Letter" : ""}
                </Typography>
              </td>

              <td className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className={`font-light text-[13px] text-white rounded-xl w-28 px-2 py-[3px] text-center ${
                    row.status === "underreview"
                      ? "bg-[#096D98] "
                      : row.status === "approved"
                      ? "bg-[#09985C]"
                      : row.status === "rejected"
                      ? "bg-[#D33131]"
                      : "bg-primary"
                  }`}
                >
                  {row.status === "underreview"
                    ? "Under Review"
                    : row.status === "rejected"
                    ? "Rejected"
                    : row.status === "approved"
                    ? "Approved"
                    : "NA"}
                </Typography>
              </td>
              <td className="p-4">
                <Typography
                  as="a"
                  href="#"
                  variant="small"
                  color="blue-gray"
                  className="font-medium"
                >
                  <Link
                    to={link}
                    state={row.appId}
                    className="flex flex-row items-center gap-2"
                  >
                    <span className="text-primary">{icon}</span>
                    <span className="font-body">{action}</span>
                  </Link>
                </Typography>
              </td>
              <td className="p-4">
                <Typography
                  as="a"
                  href="#"
                  variant="small"
                  color="blue-gray"
                  className="font-medium"
                >
                  <Link
                    to={SecondLink}
                    state={secondCustomState}
                    className={customClass}
                  >
                    <span className="font-body">{SecondAction}</span>
                  </Link>
                </Typography>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
export function CustomTableFour({
  tableHead = [],
  tableRows = [],
  action,
  icon,
  link,
  customClass,
  SecondLink,
  secondCustomState,
  SecondAction,
  customLinkState,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isticketId, setTicketId] = useState();
  const handleOpen = (id) => {
    setIsOpen(true);
    setTicketId(id);
  };
  const closePopUp = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Card className="h-full w-full overflow-scroll scrollbar-hide font-poppins">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {tableHead.map((head) => (
                <th
                  key={head}
                  className="border-b border-blue-gray-100 bg-input p-4"
                >
                  <Typography
                    variant="small"
                    color="sidebar"
                    className="font-medium leading-none opacity-70 "
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row, index) => (
              <tr key={index} className="even:bg-blue-gray-50/50">
                {/* Render only the values you want to display */}
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.sno || "NA"}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.ticketNo}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.type}
                  </Typography>
                </td>

                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.date}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className={`font-medium ${
                      row?.priority === "Urgent"
                        ? "text-red-500"
                        : "text-green-500"
                    } `}
                  >
                    {row?.priority}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className={`font-light text-[13px] text-white rounded-xl   py-[3px] text-center ${
                      row.status === "underreview"
                        ? "bg-[#096D98] "
                        : row.status === "resolved"
                        ? "bg-[#09985C]"
                        : "bg-primary"
                    }`}
                  >
                    {row.status === "underreview"
                      ? "Under Review"
                      : row.status === "resolved"
                      ? "Resolved"
                      : "NA"}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    as="a"
                    href="#"
                    variant="small"
                    color="blue-gray"
                    className="font-medium"
                  >
                    <span
                      onClick={() => handleOpen(row.Id)}
                      className="flex flex-row items-center gap-2"
                    >
                      <span className="text-primary">{icon}</span>
                      <span className="font-body">{action}</span>
                    </span>
                  </Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <ViewTicketPop
        isOpen={isOpen}
        closePopUp={closePopUp}
        isticketId={isticketId}
      />
    </>
  );
}

export function CustomTableFive({
  tableHead = [],
  tableRows = [],
  action,
  icon,
}) {
  const dispatch = useDispatch();
  const { updateTicketTab } = useSelector((state) => state.admin);

  const [isOpen, setIsOpen] = useState(false);
  const ticketData = useSelector((state) => state.admin.ticketById);
  const test = null;

  console.log(ticketData);
  const [isticketId, setTicketId] = useState();
  const role = localStorage.getItem("role");
  const handleOpen = (id) => {
    setIsOpen(true);
    setTicketId(id);
  };
  const closePopUp = () => {
    setIsOpen(false);
  };
  const updatedStatus = "pending";
  const ticketStatusChange = async (
    status,
    isSolution,
    resolvedText,
    ticketId
  ) => {
    try {
      const path =
        role === "0"
          ? "/ticket/ticket"
          : role === "1"
          ? "/ticket/ticket-subadmin"
          : null;
      const res = await ticketResolve(
        path,
        status,
        isSolution,
        resolvedText,
        ticketId
      );
      dispatch(
        getAllTickets({ test, test, test, test, test, updateTicketTab, test })
      );
      toast.success(res?.message || "Status Updated Successfully");
      if (ticketData.createdById.startsWith("AG")) {
        if (socketServiceInstance.isConnected()) {
          //from agent to admin
          const notificationData = {
            title: " TICKET_RESOLVED_AGENT",
            message: `Ticket Raised ${ticketData.ticketId} has been resolved`,
            path: "/help-support",
            recieverId: `${ticketData.createdBy}`,
          };

          socketServiceInstance.socket.emit(
            "NOTIFICATION_ADMIN_TO_AGENT",
            notificationData
          );
        } else {
          console.error("Socket connection failed, cannot emit notification.");
        }
      }
      if (ticketData.createdById.startsWith("ST")) {
        if (socketServiceInstance.isConnected()) {
          //from student to admin
          const notificationData = {
            title: " TICKET_RESOLVED_STUDENT",
            message: `Ticket Raised ${ticketData.ticketId} has been resolved`,
            path: "/help-support",
            recieverId: `${ticketData.createdBy}`,
          };
          socketServiceInstance.socket.emit(
            "NOTIFICATION_ADMIN_TO_STUDENT",
            notificationData
          );
        } else {
          console.error("Socket connection failed, cannot emit notification.");
        }
      }
      closePopUp();
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Something went wrong");
    }
  };

  return (
    <>
      <Card className="h-full w-full overflow-scroll scrollbar-hide font-poppins">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {tableHead.map((head) => (
                <th
                  key={head}
                  className="border-b border-blue-gray-100 bg-input p-4"
                >
                  <Typography
                    variant="small"
                    color="sidebar"
                    className="font-medium leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row, index) => (
              <tr key={index} className="even:bg-blue-gray-50/50">
                {/* Render only the values you want to display */}
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.sno}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.ticketNo}
                  </Typography>
                </td>

                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.name}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.userId}
                  </Typography>
                </td>

                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className={`font-normal text-white text-center rounded-xl text-[13px] py-1 ${
                      row.type === "agent" ? "bg-[#0F67A7]" : "bg-[#640FA7]"
                    } `}
                  >
                    {row.type === "agent" ? "Agent" : "Student"}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.date}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className={`font-medium ${
                      row?.priority === "Urgent"
                        ? "text-red-500"
                        : "text-green-500"
                    } `}
                  >
                    {row?.priority}
                  </Typography>
                </td>
                {console.log(row)}
                <td className="p-4">
                  <Typography
                    as="a"
                    href="#"
                    variant="small"
                    color="blue-gray"
                    className="font-medium"
                  >
                    <span
                      onClick={() => handleOpen(row.Id)}
                      className="flex flex-row items-center gap-2"
                    >
                      <span className="text-primary">{icon}</span>
                      <span className="font-body">{action}</span>
                    </span>
                  </Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <TicketResolvePop
        isOpen={isOpen}
        closePopUp={closePopUp}
        isticketId={isticketId}
        handleStatus={ticketStatusChange}
      />
    </>
  );
}

export function CustomTableSix({
  tableHead = [],
  tableRows = [],
  action,
  icon,
}) {
  return (
    <>
      <Card className="h-full w-full overflow-scroll scrollbar-hide font-poppins">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {tableHead.map((head) => (
                <th
                  key={head}
                  className="border-b border-blue-gray-100 bg-input p-4"
                >
                  <Typography
                    variant="small"
                    color="sidebar"
                    className="font-medium leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row, index) => (
              <tr key={index} className="even:bg-blue-gray-50/50">
                {/* Render only the values you want to display */}
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.sno}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.ticketNo}
                  </Typography>
                </td>

                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.name}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.userId}
                  </Typography>
                </td>

                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className={`font-normal text-white text-center rounded-xl text-[13px] py-1 ${
                      row.type === "agent" ? "bg-[#0F67A7]" : "bg-[#640FA7]"
                    } `}
                  >
                    {row.type === "agent" ? "Agent" : "Student"}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.date}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className={`font-medium ${
                      row?.priority === "Urgent"
                        ? "text-red-500"
                        : "text-green-500"
                    } `}
                  >
                    {row?.priority}
                  </Typography>
                </td>

                <td className="p-4">
                  <Typography
                    as="a"
                    href="#"
                    variant="small"
                    color="blue-gray"
                    className="font-medium"
                  >
                    <span
                      onClick={() => handleOpen(row.Id)}
                      className="flex flex-row items-center gap-2"
                    >
                      <span className="text-primary">{icon}</span>
                      <span className="font-body">{action}</span>
                    </span>
                  </Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

export function CustomTableSeven({
  tableHead = [],
  tableRows = [],
  action,
  actionTwo,
  tableType,
  icon,
  studentId,
}) {
  const dispatch = useDispatch();
  const role = localStorage.getItem("role");
  const [isOpenPop, setIsOpenPop] = useState(false);
  const [isDocId, setIsDocId] = useState(false);
  const [isUrl, setIsUrl] = useState(false);
  const path =
    role === "0"
      ? `/document/all-admin/${studentId}`
      : role === "2" || role === "3"
      ? `/document/all/${studentId}`
      : null;
  const openDeletePopup = (docId, url) => {
    setIsUrl(url);
    setIsDocId(docId);
    setIsOpenPop(true);
  };

  const closePop = () => {
    setIsOpenPop(false);
  };
  const handleRemoveFile = async (id, fileUrl) => {
    try {
      if (!fileUrl) {
        toast.error("File URL is missing.");
        return;
      }
      const fileRef = ref(storage, fileUrl);
      await deleteObject(fileRef);
      const res = await removeDocument(id);
      dispatch(getDocumentAll({ path }));

      toast.success(res.message || "Document removed successfully");
    } catch (error) {
      console.error("Error removing file:", error);
      toast.error(error.message || "Failed to remove the document");
    }
  };

  return (
    <>
      <Card className="h-full w-full overflow-scroll scrollbar-hide font-poppins">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {tableHead
                .filter((head) => !(head === "Action" && role === "0")) // Filter out "Action" when role is 0
                .map((head) => (
                  <th
                    key={head}
                    className="border-b border-blue-gray-100 bg-input p-4"
                  >
                    <Typography
                      variant="small"
                      color="sidebar"
                      className="font-medium leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row, index) => (
              <tr key={index} className="even:bg-blue-gray-50/50">
                {/* Render only the values you want to display */}
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.sno}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {extractFileNames(row?.docName)}
                  </Typography>
                </td>
                {tableType === "recieve" && (
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {row.docType}
                    </Typography>
                  </td>
                )}
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.date}
                  </Typography>
                </td>

                <td className="p-4">
                  <Typography
                    as="a"
                    variant="small"
                    color="blue-gray"
                    className="font-medium"
                  >
                    <a
                      href={row.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-row items-center gap-2"
                    >
                      <span className="text-primary">{icon}</span>
                      <span className="font-body">{action}</span>
                    </a>
                  </Typography>
                </td>
                {(tableType === "upload" && role === "2") ||
                  (role === "3" && (
                    <td className="">
                      <Typography
                        as="a"
                        variant="small"
                        color="blue-gray"
                        className="font-medium"
                      >
                        <span
                          onClick={() => openDeletePopup(row.docId, row.url)}
                          className="flex flex-row items-center gap-2"
                        >
                          <span className="font-body border rounded-md border-primary cursor-pointer px-6 py-1">
                            {actionTwo}
                          </span>
                        </span>
                      </Typography>
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <DocDeletePop
        closePop={closePop}
        isOpenPop={isOpenPop}
        handleFunc={handleRemoveFile}
        isUrl={isUrl}
        isDocId={isDocId}
      />
    </>
  );
}
export function CustomTableEight({
  tableHead = [],
  tableRows = [],
  action,
  actionTwo,
  linkOne,
  iconTwo,
  actionThree,
  linkTwo,
  icon,
}) {
  const dispatch = useDispatch();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isId, setIsId] = useState();
  const [isStudentId, setIsStudentId] = useState();
  const role = localStorage.getItem("role");

  const handleOpen = (id, studentId) => {
    setIsId(id);
    setIsStudentId(studentId);
    setIsOpen(true);
  };
  const closePopUp = () => {
    setIsOpen(false);
  };
  const handleRemove = async (id) => {
    try {
      const path =
        location.pathname === "/admin/agent-student"
          ? `/studentInformation/agent-student-admin`
          : "/admin/student-directory";
      const pathData =
        location.pathname === `/admin/agent-directory`
          ? `/admin/delete-agent/${id}`
          : `/admin/delete-student/${id}`;

      const res = await removeAgentorStudent(pathData);
      // navigate("/removed-user")
      location.pathname === `/admin/agent-directory`
        ? dispatch(getAllAgentList({}))
        : dispatch(getAllStudentList({ path }));

      toast.success(res.message || "Removed successfully");
      if (socketServiceInstance.isConnected()) {
        //from agent to admin
        const data = { userId: isStudentId, reason: "Removed by admin" };
        console.log("fired", data);

        socketServiceInstance.socket.emit("DELETE_AUTH_TOKEN", data);
      } else {
        console.error("Socket connection failed, cannot emit notification.");
      }
    } catch (error) {
      console.error("Error while removing ", error);
      toast.error(error.message || "Failed to remove");
    }
  };

  return (
    <>
      <Card className="h-full w-full overflow-scroll scrollbar-hide font-poppins">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {tableHead.map((head) => {
                if (head === "Action" && role === "1") {
                  return null;
                }
                return (
                  <th
                    key={head}
                    className="border-b border-blue-gray-100 bg-input p-4"
                  >
                    <Typography
                      variant="small"
                      color="sidebar"
                      className="font-medium leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                );
              })}
            </tr>
          </thead>
          {console.log(tableRows)}
          <tbody>
            {tableRows.map((row, index) => (
              <tr key={index} className="even:bg-blue-gray-50/50">
                {/* Render only the values you want to display */}
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.sno}
                  </Typography>
                </td>
                {console.log(row)}

                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.name}
                  </Typography>
                </td>

                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.stId}
                  </Typography>
                </td>

                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.email}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.phone}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    as="a"
                    variant="small"
                    color="blue-gray"
                    className="font-medium"
                  >
                    <Link
                      to={linkOne}
                      state={{
                        adminState: location.pathname,
                        id: row.data?.id || row?.data._id,
                      }}
                      className="flex flex-row items-center gap-2"
                    >
                      <span className="text-primary">{icon}</span>
                      <span className="font-body">{action}</span>
                    </Link>
                  </Typography>
                </td>
                {console.log(row?.studentId)}

                {row.viewList && (
                  <td className="p-4">
                    <Typography
                      as="a"
                      variant="small"
                      color="blue-gray"
                      className="font-medium"
                    >
                      <Link
                        to={linkTwo}
                        state={{
                          adminState: location.pathname,
                          id: row.data?.id || row?.data._id,
                        }}
                        className="flex flex-row items-center gap-2"
                      >
                        <span className="text-primary">{iconTwo}</span>
                        <span className="font-body">{actionThree}</span>
                      </Link>
                    </Typography>
                  </td>
                )}
                {role !== "1" && (
                  <td className="">
                    <Typography
                      as="a"
                      variant="small"
                      color="blue-gray"
                      className="font-medium"
                    >
                      <span
                        onClick={() =>
                          handleOpen(
                            row.data?._id || row.data?.id,
                            row?.data?.studentId || row?.data?.id
                          )
                        }
                        className="flex flex-row items-center gap-2"
                      >
                        <span className="font-body border rounded-md border-primary cursor-pointer px-6 py-1">
                          {actionTwo}
                        </span>
                      </span>
                    </Typography>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <RemovePopUp
        closePopUp={closePopUp}
        isOpen={isOpen}
        handleFunc={handleRemove}
        isId={isId}
      />
    </>
  );
}
export function CustomTableNine({
  tableHead = [],
  tableRows = [],
  action,
  actionTwo,
  linkOne,
  iconTwo,
  actionThree,
  linkTwo,
  icon,
}) {
  return (
    <>
      <Card className="h-full w-full overflow-scroll scrollbar-hide font-poppins">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {tableHead.map((head) => (
                <th
                  key={head}
                  className="border-b border-blue-gray-100 bg-input p-4"
                >
                  <Typography
                    variant="small"
                    color="sidebar"
                    className="font-medium leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row, index) => (
              <tr key={index} className="even:bg-blue-gray-50/50">
                {/* Render only the values you want to display */}
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.sno}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.name}
                  </Typography>
                </td>

                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.stId}
                  </Typography>
                </td>

                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.submittedby === "student"
                      ? "Student"
                      : `Agent(${row.submittedby}) `}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.total}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.underreview}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.approved}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    as="a"
                    href="#"
                    variant="small"
                    color="blue-gray"
                    className="font-medium"
                  >
                    <Link
                      to={linkOne}
                      state={{
                        adminState: location.pathname,
                        id: row.data?._id,
                      }}
                      className="flex flex-row items-center gap-2"
                    >
                      <span className="text-primary">{icon}</span>
                      <span className="font-body">{action}</span>
                    </Link>
                  </Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

export function CustomTableTen({
  tableHead = [],
  tableRows = [],
  linkOne,
  icon,
  iconTwo,
  iconThree,
  action,
}) {
  const [isOpenPop, setIsOpenPop] = useState(false);
  const [isId, setIsId] = useState(false);
  const dispatch = useDispatch();

  const openDeletePopup = (id) => {
    setIsOpenPop(true);
    setIsId(id);
  };
  // console.log(isOpenPop)
  const closePop = () => {
    setIsOpenPop(false);
  };
  const deleteInstituteById = async () => {
    try {
      const res = await deleteInstitute(isId);
      dispatch(getInstitutes({}));

      toast.success(res.message || "Account Deleted Successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <>
      <Card className="h-full w-full overflow-scroll scrollbar-hide font-poppins">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {tableHead.map((head) => (
                <th
                  key={head}
                  className="border-b border-blue-gray-100 bg-input p-4 "
                >
                  <Typography
                    variant="small"
                    color="sidebar"
                    className="font-medium leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row, index) => (
              <tr key={index} className="even:bg-blue-gray-50/50">
                {/* Render only the values you want to display */}
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.sno}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.name}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.data?.popularCourses || "__"}
                  </Typography>
                </td>
                {console.log(row?.data?.popularCourses)}
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.data?.country}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    as="a"
                    variant="small"
                    color="blue-gray"
                    className="font-medium"
                  >
                    <Link
                      to={linkOne}
                      state={{
                        adminState: location.pathname,
                        id: row.data?._id,
                      }}
                      className="flex flex-row items-center gap-2"
                    >
                      <span className="text-primary">{icon}</span>
                      <span className="font-body">{action}</span>
                    </Link>
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    as="a"
                    variant="small"
                    color="blue-gray"
                    className="font-medium"
                  >
                    <span className="flex flex-row items-center gap-5 text-[18px]">
                      <Link
                        to={"/add-institute"}
                        state={{
                          id: row.data?._id,
                          edit: "edit",
                        }}
                        className="text-primary"
                      >
                        {iconTwo}
                      </Link>
                      <span
                        onClick={() => openDeletePopup(row.data?._id)}
                        className="text-primary cursor-pointer"
                      >
                        {iconThree}
                      </span>
                    </span>
                  </Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <DeletePop
        closePop={closePop}
        isOpenPop={isOpenPop}
        handleFunc={deleteInstituteById}
      />
    </>
  );
}

export function CustomTableEleven({ tableHead = [], tableRows = [] }) {
  return (
    <>
      <Card className="h-full w-full overflow-scroll scrollbar-hide font-poppins">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {tableHead.map((head) => (
                <th
                  key={head}
                  className="border-b border-blue-gray-100 bg-input p-4 "
                >
                  <Typography
                    variant="small"
                    color="sidebar"
                    className="font-medium leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row, index) => (
              <tr key={index} className="even:bg-blue-gray-50/50">
                {/* Render only the values you want to display */}
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.sno}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.ticketNo}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.name}
                  </Typography>
                </td>

                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.id}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.date}
                  </Typography>
                </td>

                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className={`font-medium ${
                      row?.priority === "Urgent"
                        ? "text-red-500"
                        : "text-green-500"
                    } `}
                  >
                    {row.priority}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-light bg-[#09985C] px-3 font-poppins  text-white text-center py-1 rounded-xl"
                  >
                    {row.status === "resolved" ? "Resolved" : row?.status}
                  </Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

export function CustomTableTwelve({ tableHead = [], tableRows = [] }) {
  return (
    <>
      <Card className="h-full w-full overflow-scroll scrollbar-hide font-poppins">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {tableHead.map((head) => (
                <th
                  key={head}
                  className="border-b border-blue-gray-100 bg-input p-4 "
                >
                  <Typography
                    variant="small"
                    color="sidebar"
                    className="font-medium leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row, index) => (
              <tr key={index} className="even:bg-blue-gray-50/50">
                {/* Render only the values you want to display */}
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.sno}
                  </Typography>
                </td>

                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.studentName}
                  </Typography>
                </td>

                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.id}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.name}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.type === "offerLetter"
                      ? "Offer Letter"
                      : row.type === "visa"
                      ? "Visa Lodgement"
                      : row.type === "courseFeeApplication"
                      ? "Course Fee"
                      : "NA"}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.date}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className={`font-light px-3 font-poppins text-white text-center py-1 w-52 rounded-xl ${
                      row.status === "underreview"
                        ? "bg-[#096D98]"
                        : [
                            "approved",
                            "withdrawalrequest",
                            "approved by embassy",
                            "withdrawalcomplete",
                            "visagranted",
                          ].includes(row.status)
                        ? "bg-[#09985C]"
                        : ["rejected", "rejectedbyembassy"].includes(row.status)
                        ? "bg-[#D33131]"
                        : "bg-primary"
                    }`}
                  >
                    {row.status === "approved"
                      ? "Approved"
                      : row.status === "rejected"
                      ? "Rejected"
                      : row.status === "approved by embassy"
                      ? "Approved By Embassy"
                      : row.status === "visagranted"
                      ? "Visa Granted"
                      : row.status === "withdrawalcomplete"
                      ? "Withdrawal Complete"
                      : row.status === "withdrawalrequest"
                      ? "Withdrawal Requested"
                        : row.status === "rejectedbyembassy"
                      ? "Rejected By Embassy"
                      : row.status}
                  </Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

export function CustomTableThirteen({ tableHead = [], tableRows = [] }) {
  return (
    <>
      <Card className="h-full w-full overflow-scroll scrollbar-hide font-poppins">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {tableHead.map((head) => (
                <th
                  key={head}
                  className="border-b border-blue-gray-100 bg-input p-4 "
                >
                  <Typography
                    variant="small"
                    color="sidebar"
                    className="font-medium leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row, index) => (
              <tr key={index} className="even:bg-blue-gray-50/50">
                {/* Render only the values you want to display */}
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.sno}
                  </Typography>
                </td>

                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.name}
                  </Typography>
                </td>

                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.id}
                  </Typography>
                </td>

                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.type === "agent"
                      ? "Agent"
                      : row.type === "student"
                      ? "Student"
                      : null}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.date}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className={`font-light text-white text-center rounded-xl py-1 ${
                      row.status === "completed"
                        ? "bg-[#09985C]"
                        : row.status === "rejected"
                        ? "bg-[#D33131]"
                        : "bg-primary"
                    }`}
                  >
                    {row.status === "completed"
                      ? "Approved"
                      : row.status === "rejected"
                      ? "Rejected"
                      : "NA"}
                  </Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

export function CustomTableFourteen({ tableHead = [], tableRows = [] }) {
  const role = localStorage.getItem("role");
  const [isOpen, setIsOpen] = useState(false);
  const [isId, setIsId] = useState();
  const handleOpen = (id) => {
    setIsOpen(true);
    setIsId(id);
  };
  const closePopUp = () => {
    setIsOpen(false);
  };
  return (
    <>
      <Card className="h-full w-full overflow-scroll scrollbar-hide font-poppins">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {tableHead.map((head) => (
                <th
                  key={head}
                  className="border-b border-blue-gray-100 bg-input p-4 "
                >
                  <Typography
                    variant="small"
                    color="sidebar"
                    className="font-medium leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row, index) => (
              <tr key={index} className="even:bg-blue-gray-50/50">
                {/* Render only the values you want to display */}
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.sno}
                  </Typography>
                </td>

                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row?.data?.airId}
                  </Typography>
                </td>
                {(role === "0" ||
                  role === "1") && (
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row?.data?.userName}
                  </Typography>
                </td>
              )}
              {(role === "2" ||
                role === "3") && (
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row?.data?.personName}
                  </Typography>
                </td>
              )}
                {(role === "0" ||
                  role === "1") && (
                    <td className="p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {row?.data?.customId}
                      </Typography>
                    </td>
                  )}
                  {(role === "0" ||
                  role === "1") && (
                    <td className="p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className={`font-normal  rounded-xl text-white text-center px-3 py-1 ${
                     row?.data?.userType === "agent"
                        ? "bg-[#0F67A7]"
                        : row?.data?.userType === "student"
                        ? "bg-[#640FA7]"
                        : "bg-primary"
                    }`}
                      >
                        {row?.data?.userType === "agent" ? "Agent" : row?.data?.userType === "student" ? "Student" : null}
                      </Typography>
                    </td>
                  )}
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {formatDate(row?.data?.createdAt)}
                  </Typography>
                </td>
                {(role === "2" ||
                  role === "3") && (
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    <Link
                      to="/air-ticket/add"
                      state={{ id: row?.data?._id }}
                      className="flex flex-row items-center gap-3 cursor-pointer"
                    >
                      <span className="text-primary text-[20px]">
                        <FaPencil />
                      </span>
                      <span>Edit</span>
                    </Link>
                  </Typography>
                </td>
              )}
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    <span
                      onClick={() => handleOpen(row?.data?._id)}
                      className="flex flex-row items-center gap-3 cursor-pointer"
                    >
                      <span className="text-primary text-[20px]">
                        <FaRegEye />
                      </span>
                      <span>View</span>
                    </span>
                  </Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <AirTicketPopUp isOpen={isOpen} closePopUp={closePopUp} id={isId} />
    </>
  );
}


export function CustomTableFifteen({ tableHead = [], tableRows = [], icon, action}) {
  return (
    <>
      <Card className="h-full w-full overflow-scroll scrollbar-hide font-poppins">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {tableHead.map((head) => (
                <th
                  key={head}
                  className="border-b border-blue-gray-100 bg-input p-4 "
                >
                  <Typography
                    variant="small"
                    color="sidebar"
                    className="font-medium leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row, index) => (
              <tr key={index} className="even:bg-blue-gray-50/50">
                {/* Render only the values you want to display */}
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.sno}
                  </Typography>
                </td>


                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.id}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.data?.visa?.country}
                  </Typography>
                </td>
                
                <td className="p-4">
                <Typography
                    variant="small"
                    color="blue-gray"
                    className={`font-light px-3 font-poppins text-white text-center capitalize py-1 w-44 rounded-xl ${
                      row?.data?.visa?.status === "underreview"
                        ? "bg-[#096D98]"
                        : [
                            "approved",
                            "withdrawalrequest",
                            "approved by embassy",
                            "withdrawalcomplete",
                            "visagranted",
                          ].includes(row?.data?.visa?.status)
                        ? "bg-[#09985C]"
                        : ["rejected", "rejectedbyembassy"].includes(row?.data?.visa?.status)
                        ? "bg-[#D33131]"
                        : "bg-primary"
                    }`}
                  >
                    {row.data?.visa?.status === "approved"
                      ? "Approved"
                      : row.data?.visa?.status === "rejected"
                      ? "Rejected"
                      : row.data?.visa?.status === "approved by embassy"
                      ? "Approved By Embassy"
                      : row.data?.visa?.status === "visagranted"
                      ? "Visa Granted"
                      : row.data?.visa?.status === "withdrawalcomplete"
                      ? "Withdrawal Complete"
                      : row.data?.visa?.status === "withdrawalrequest"
                      ? "Withdrawal Requested"
                       : row.data?.visa?.status === "rejectedbyembassy"
                      ? "Rejected By Embassy"
                      
                      : row.data?.visa?.status}
                  </Typography>
                </td>

                <td className="p-4">
                  <Typography
                    as="a"
                    variant="small"
                    color="blue-gray"
                    className="font-medium"
                  >
                  {console.log(row?.data?._id)}
                    <Link
                      to="/visa/edit"
                      state={row?.data?._id}
                   
                      className="flex flex-row items-center gap-2"
                    >
                      <span className="text-primary">{icon}</span>
                      <span className="font-body">{action}</span>
                    </Link>
                  </Typography>
                </td>
              
               
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

export function CustomTableSixteen({ tableHead = [], tableRows = [], icon, action}) {
  return (
    <>
      <Card className="h-full w-full overflow-scroll scrollbar-hide font-poppins">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {tableHead.map((head) => (
                <th
                  key={head}
                  className="border-b border-blue-gray-100 bg-input p-4 "
                >
                  <Typography
                    variant="small"
                    color="sidebar"
                    className="font-medium leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row, index) => (
              <tr key={index} className="even:bg-blue-gray-50/50">
                {/* Render only the values you want to display */}
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.sno}
                  </Typography>
                </td>

                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.data.firstName +" "+ row.data.lastName}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.data?.teamId}
                  </Typography>
                </td>
                
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.data?.email}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.data?.phone}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    as="a"
                    variant="small"
                    color="blue-gray"
                    className="font-medium"
                  >
                    <Link
                      to="/admin/partner-employee-details"
                      state={{id:row?.data?._id}}
                   
                      className="flex flex-row items-center gap-2"
                    >
                      <span className="text-primary">{icon}</span>
                      <span className="font-body">{action}</span>
                    </Link>
                  </Typography>
                </td>
            
              
               
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
import React, { useEffect, useState } from "react";
import OfferLetterPop from "../OfferLetterPop";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiUpload } from "react-icons/fi";
import { FaRegEye, FaRegIdCard } from "react-icons/fa6";
import { TbPencilMinus } from "react-icons/tb";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage } from "../../../utils/fireBase";
import { useDispatch, useSelector } from "react-redux";
import { allApplication } from "../../../features/agentSlice";
import {
  deleteDocument,
  updateVisaDocument,
  uploadDocument,
} from "../../../features/generalApi";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { getDocumentAll } from "../../../features/generalSlice";
const initialStudentDocument = {
  loa: "",
  offerLetter: "",
  gicLetter: "",
  medical: "",
  pcc: "",
  pal: "",
  certificate: "",
  lor: "",
  sop: "",
  blockedaccount: "",
};
const VisaUploadEdit = ({ appId, updatedData, profileViewPath, userId }) => {
  const { applicationDataById } = useSelector((state) => state.agent);
  const [isOne, setIsOne] = useState(false);
  const [visaLetter, setVisaLetter] = useState({
    studentDocument: { ...initialStudentDocument },
  });
  const [newFiles, setNewFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletedFiles, setDeletedFiles] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(allApplication());
    dispatch(getDocumentAll());
  }, [dispatch]);
  const [isPopUp, setIsPopUp] = useState(false);

  const [errors, setErrors] = useState({});
  const [isFileType, setFileType] = useState();
  const [resetDoc, setResetDoc] = useState(false);

  const handleOneToggle = () => {
    setIsOne((prev) => !prev); // Toggle the form visibility
  };

  const handleCancelOne = () => {
    setIsOne(false);
  };

  const handleFilePopupOpen = (fileType) => {
    setFileType(fileType);
    setIsPopUp(true);
  };
  const handleFileUpload = (files) => {
    if (!files || files.length === 0 || !isFileType) return;

    const fileOrUrl = files[0];

    if (fileOrUrl instanceof File) {
      // Handle File objects
      const blobUrl = URL.createObjectURL(fileOrUrl);

      setNewFiles((prevFiles) => [
        ...prevFiles.filter((f) => f.fileType !== isFileType),
        { file: fileOrUrl, fileType: isFileType, blobUrl },
      ]);

      // Update state with blob URL for preview
      setVisaLetter((prevState) => ({
        ...prevState,
        studentDocument: {
          ...prevState.studentDocument,
          [isFileType]: blobUrl, // Set blob URL temporarily
        },
      }));

      // toast.success(`${fileOrUrl.name} has been selected.`);
    } else if (typeof fileOrUrl === "string") {
      // Handle URL strings: directly set in the VisaLetter state
      setVisaLetter((prevState) => ({
        ...prevState,
        studentDocument: {
          ...prevState.studentDocument,
          [isFileType]: fileOrUrl, // Set the URL directly
        },
      }));

      // toast.success("Document URL has been set.");
    }
  };

  const deleteFile = async (fileType) => {
    const fileUrl = visaLetter.studentDocument[fileType];
    if (!fileUrl) return;
    // await deleteDocument(fileUrl);

    const fileUrls = Array.isArray(fileUrl) ? fileUrl : [fileUrl];

    fileUrls.forEach((url) => {
      if (typeof url === "string" && url.startsWith("http")) {
        setDeletedFiles((prevFiles) => [
          ...prevFiles.filter((f) => f.fileType !== fileType),
          { fileUrl: url, fileType },
        ]);
      }
    });

    setVisaLetter((prevState) => ({
      ...prevState,
      studentDocument: {
        ...prevState.studentDocument,
        [fileType]: "",
      },
    }));

    setNewFiles((prevFiles) =>
      prevFiles.filter((file) => file.fileType !== fileType)
    );

    // toast.info("File marked for deletion.");
  };

  // const validateFields = () => {
  //   const errors = {};

  //   Object.keys(initialStudentDocument).forEach((docType) => {
  //     // Documents specific to Germany
  //     const germanyRequiredDocs = ["blockedaccount", "pal"];
  //     const skipValidationDocs = ["sop", "lor"]; // Documents to skip validation

  //     // Skip validation for specific documents
  //     if (skipValidationDocs.includes(docType)) {
  //       return;
  //     }

  //     // Require these documents only for Germany
  //     if (germanyRequiredDocs.includes(docType)) {
  //       if (applicationDataById?.visa?.country === "Germany" && !visaLetter?.studentDocument[docType]) {
  //         errors[docType] = `${docType.replace(
  //           /([A-Z])/g,
  //           " $1"
  //         )} is required for Germany.`;
  //       }
  //     } else {
  //       // General validation for other documents
  //       if (!visaLetter?.studentDocument[docType]) {
  //         errors[docType] = `${docType.replace(
  //           /([A-Z])/g,
  //           " $1"
  //         )} is required.`;
  //       }
  //     }
  //   });

  //   return errors;
  // };
  const handleSubmit = async () => {
    // const validationErrors = validateFields();

    // if (Object.keys(validationErrors).length > 0) {
    //   setErrors(validationErrors);
    //   toast.error("Please fill all required fields");
    //   return;
    // }

    try {
      setIsSubmitting(true);

      const certificateArray = Array.isArray(
        visaLetter.studentDocument.certificate
      )
        ? visaLetter.studentDocument.certificate.filter(
            (url) => !url.startsWith("blob:")
          ) // Exclude blob URLs
        : visaLetter.studentDocument.certificate
        ? [visaLetter.studentDocument.certificate].filter(
            (url) => !url.startsWith("blob:")
          ) // Convert string to array and exclude blob URLs
        : [];

      // Initialize updatedStudentDocument with current data
      const updatedStudentDocument = {
        offerLetter: visaLetter.studentDocument.offerLetter,
        gicLetter: visaLetter.studentDocument.gicLetter,
        medical: visaLetter.studentDocument.medical,
        pcc: visaLetter.studentDocument.pcc,
        pal: visaLetter.studentDocument.pal,
        loa: visaLetter.studentDocument.loa,
        lor: visaLetter.studentDocument.lor,
        sop: visaLetter.studentDocument.sop,
        blockedaccount: visaLetter.studentDocument.blockedaccount,
        certificate: certificateArray, // Start with existing array
      };

      for (const { file, fileType, blobUrl } of newFiles) {
        const uniqueFileName = `${uuidv4()}-${file.name}`;
        const storageRef = ref(storage, `uploads/visa/${uniqueFileName}`);
        try {
          const snapshot = await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(snapshot.ref);

          // Replace blobUrl for specific fields or append to certificate
          if (fileType === "certificate") {
            updatedStudentDocument.certificate.push(downloadURL);
          } else if (visaLetter.studentDocument[fileType] === blobUrl) {
            updatedStudentDocument[fileType] = downloadURL;
          }

          // Upload metadata to backend
          const uploadData = {
            viewUrl: downloadURL,
            documentName: file.name,
            userId: userId,
          };
          await uploadDocument(uploadData);

          // Update local state
          setVisaLetter((prevState) => ({
            ...prevState,
            studentDocument: {
              ...prevState.studentDocument,
              certificate:
                fileType === "certificate"
                  ? [
                      ...(prevState.studentDocument.certificate || []),
                      downloadURL,
                    ]
                  : prevState.studentDocument[fileType] === blobUrl
                  ? downloadURL
                  : prevState.studentDocument[fileType],
            },
          }));
        } catch (error) {
          console.log(error);
          toast.error(`Error uploading ${file.name}.`);
        }
      }

      // Submit the updated data to the backend
      const res = await updateVisaDocument(appId, updatedStudentDocument);

      toast.success("Data added successfully.");
      updatedData();
      handleCancelOne();
      setIsSubmitting(false);

      // Clear temporary states
      setNewFiles([]);
      setDeletedFiles([]);
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
      console.error("Error during submission:", error);
    }
  };

  useEffect(() => {
    if (applicationDataById) {
      setVisaLetter((prevState) => ({
        ...prevState,
        studentDocument: {
          loa: applicationDataById?.visa?.loa || "",
          offerLetter: applicationDataById?.visa?.offerLetter || "",
          gicLetter: applicationDataById?.visa?.gicLetter || "",
          pcc: applicationDataById?.visa?.pcc || "",
          pal: applicationDataById?.visa?.pal || "",
          certificate: applicationDataById?.visa?.certificate || "",
          medical: applicationDataById?.visa?.medical || "",
          blockedaccount: applicationDataById?.visa?.blockedaccount || "",
          sop: applicationDataById?.visa?.sop || "",
          lor: applicationDataById?.visa?.lor || "",
        },
      }));
    }
  }, [applicationDataById]);
  return (
    <>
      <div className="bg-white rounded-md px-6 py-4 font-poppins mb-20">
        <div className="flex flex-row text-sidebar items-center justify-between border-b border-greyish">
          <span className="flex flex-row gap-4 items-center pb-3">
            <span className="text-[24px]">
              <FaRegIdCard />
            </span>
            <span className="font-semibold text-[22px]">Upload Documents</span>
          </span>
          {/* Pencil icon visible only when the form is hidden */}
          {profileViewPath
            ? ""
            : !isOne && (
                <span
                  className="text-[24px] cursor-pointer transition-opacity duration-300 ease-in-out"
                  onClick={handleOneToggle}
                  style={{ opacity: !isOne ? 1 : 0 }}
                >
                  <TbPencilMinus />
                </span>
              )}
        </div>

        <div className="flex flex-row w-full justify-between mt-6">
          <span className="w-1/2 flex flex-col text-[15px]">
            <span className="font-light">LOA/Fee Reciept</span>
            <span className="font-medium">
              {applicationDataById?.visa?.loa ? (
                <a
                  className="flex items-center gap-3 text-primary font-medium"
                  href={applicationDataById?.visa?.loa}
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
            <span className="font-light mt-4">GIC Letter</span>
            <span className="font-medium">
              {applicationDataById?.visa?.gicLetter ? (
                <a
                  className="flex items-center gap-3 text-primary font-medium"
                  href={applicationDataById?.visa?.gicLetter}
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
            <span className="font-light mt-4">PCC</span>
            <span className="font-medium">
              {applicationDataById?.visa?.pcc ? (
                <a
                  className="flex items-center gap-3 text-primary font-medium"
                  href={applicationDataById?.visa?.pcc}
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
            <span className="font-light mt-4">IELTS/PTE/TOFEL/Certificate</span>
            <span className="font-medium">
              {applicationDataById?.visa?.loa ? (
                <a
                  className="flex items-center gap-3 text-primary font-medium"
                  href={applicationDataById?.visa?.certificate}
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
            <span className="font-light mt-4">SOP</span>
            <span className="font-medium">
              {applicationDataById?.visa?.sop ? (
                <a
                  className="flex items-center gap-3 text-primary font-medium"
                  href={applicationDataById?.visa?.sop}
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
            <span className="font-light mt-4">Blocked Account</span>
            <span className="font-medium">
              {applicationDataById?.visa?.blockedaccount ? (
                <a
                  className="flex items-center gap-3 text-primary font-medium"
                  href={applicationDataById?.visa?.blockedaccount}
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
          <span className="w-1/2 flex flex-col text-[15px]">
            <span className="font-light mt-4">Offer Letter</span>
            <span className="font-medium">
              {applicationDataById?.visa?.offerLetter ? (
                <a
                  className="flex items-center gap-3 text-primary font-medium"
                  href={applicationDataById?.visa?.offerLetter}
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
            <span className="font-light mt-4">Medical</span>
            <span className="font-medium">
              {applicationDataById?.visa?.medical ? (
                <a
                  className="flex items-center gap-3 text-primary font-medium"
                  href={applicationDataById?.visa?.medical}
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
            <span className="font-light mt-4">PAL</span>
            <span className="font-medium">
              {applicationDataById?.visa?.pal ? (
                <a
                  className="flex items-center gap-3 text-primary font-medium"
                  href={applicationDataById?.visa?.pal}
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

            <span className="font-light mt-4">LOR</span>
            <span className="font-medium">
              {applicationDataById?.visa?.lor ? (
                <a
                  className="flex items-center gap-3 text-primary font-medium"
                  href={applicationDataById?.visa?.lor}
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
        </div>
        <div
          className={`transition-all duration-500 ease-in-out transform ${
            isOne
              ? "min-h-[100vh] translate-y-0 opacity-100"
              : "max-h-0 -translate-y-10 opacity-0 overflow-hidden"
          }`}
        >
          {isOne && (
            <>
              {Object.keys(visaLetter?.studentDocument)?.map((docType) => (
                <div
                  className="bg-white rounded-xl px-8 py-4 pb- "
                  key={docType}
                >
                  <p className="text-[15px] text-sidebar">
                    Upload{" "}
                    {(() => {
                      // Define a mapping for docType values
                      const typeMapping = {
                        certificate: "IELTS/PTE/TOEFL/MOI/Certificate",
                        loa: "LOA/Fee Receipt",
                      };

                      // Check if the docType is in the mapping, else apply the original transformation
                      return (
                        typeMapping[docType] ||
                        (docType === "blockedaccount"
                          ? "Blocked Account"
                          : docType
                              .replace(/([A-Z])/g, " $1")
                              .trim()
                              .replace(/^./, (str) => str.toUpperCase()))
                      );
                    })()}
                    {/* {applicationDataById?.visa?.country === "Germany" &&
                    ["pal", "blockedaccount"].includes(
                      docType
                    ) ? (
                      <span className="text-primary">*</span>
                    ) : !["pal", "sop", "blockedaccount", "lor"].includes(
                        docType
                      ) ? (
                      <span className="text-primary">*</span>
                    ) : null} */}
                  </p>

                  <div className="flex flex-col justify-center items-center border-2 border-dashed border-body rounded-md py-9 mt-2 mb-4">
                    <button
                      className="text-black flex items-center"
                      onClick={() => handleFilePopupOpen(docType)}
                    >
                      <FiUpload className="mr-2 text-primary text-[29px]" />
                    </button>
                    <p>
                      Upload{" "}
                      {(() => {
                        // Define a mapping for docType values
                        const typeMapping = {
                          certificate: "IELTS/PTE/TOEFL/Certificate",
                          loa: "LOA/Fee Receipt",
                        };

                        // Check if the docType is in the mapping, else apply the original transformation
                        return (
                          typeMapping[docType] ||
                          (docType === "blockedaccount"
                            ? "Blocked Account"
                            : docType
                                .replace(/([A-Z])/g, " $1")
                                .trim()
                                .replace(/^./, (str) => str.toUpperCase()))
                        );
                      })()}
                    </p>
                  </div>
                  {((Array.isArray(visaLetter?.studentDocument[docType]) &&
                    visaLetter?.studentDocument[docType].length > 0) ||
                    (typeof visaLetter?.studentDocument[docType] === "string" &&
                      visaLetter?.studentDocument[docType].trim() !== "")) && (
                    <div className="mt-2 flex items-center">
                      <a
                        href={visaLetter?.studentDocument[docType]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary"
                      >
                        View Uploaded Document
                      </a>
                      <button
                        onClick={() => deleteFile(docType)}
                        className="ml-4 text-red-500"
                      >
                        <RiDeleteBin6Line />
                      </button>
                    </div>
                  )}

                  {errors[docType] && (
                    <p className="text-red-500 mt-2 text-sm">
                      {errors[docType]}
                    </p>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
        <OfferLetterPop
          isPopUp={isPopUp}
          docLabel="Upload Documents"
          PopUpClose={() => setIsPopUp(false)}
          handleFileUpload={handleFileUpload}
          errors={errors}
          onSubmit={() => console.log("Form Submitted")}
          resetDoc={resetDoc}
          setResetDoc={setResetDoc}
          studentId={userId}
        />
        {/* Action Buttons */}
        {isOne && (
          <div className="flex justify-end  gap-4">
            <button
              className="border border-greyish text-black px-4 py-2 rounded"
              onClick={handleCancelOne}
            >
              Cancel
            </button>
            <button
              className="bg-primary text-white px-6 py-2 rounded"
              onClick={handleSubmit}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default VisaUploadEdit;

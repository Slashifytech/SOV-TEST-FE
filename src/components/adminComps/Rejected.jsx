import React, { useEffect, useState } from "react";
import AdminCard from "./AdminCard";
import { toast } from "react-toastify";

import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setTabType } from "../../features/adminSlice";
import { DataNotFound } from "../Dnf";
import Loader from "../Loader";

const Rejected = ({ data }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    dispatch(setTabType("rejected"));
  }, [dispatch]);

  const applications = data?.applications;


  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  if (loading) {
    return (
      <div
      className={`w-full  mt-12 ${
     "ml-[42%]"
      }`}
    >
      <Loader />
    </div>
    );
  }
  return (
    <div className="mt-4">
      {location.pathname === "/admin/applications-review" ? (
        applications?.length > 0 ? (
          applications.map((application, index) => (
            <div key={index}>
              <AdminCard
                apId={application?.applicationId}
                isApproval={false}
                newStatus="approved"
                name={application.fullName}
                agentId={application?.institutionId}

                userId={application?.customUserId}
                applicationType={application?.type}
                currentStatus="rejected"
                rejectionMessage={application?.message}
                linkTwo={application?.type === "offerLetter" ? "/application-view" : application?.type === "visa" ? "/visa-view" : application?.type === "courseFeeApplication" ? "/coursefee-view" : null}
                id={application?.institutionId}
                // agentId={null}
                userType={
                  application?.customUserId?.startsWith("AG-")
                    ? "Agent"
                    : "Student"
                }
                description={
                  application?.customUserId?.startsWith("AG-")
                    ? `${application?.agentName} has filed ${application?.type === "courseFeeApplication"? "course fee application": application?.type === "offerLetter" ? "offer letter" : application?.type === "visa" ? "visa" : null } for his/her student ${application?.fullName}`
                    : application?.customUserId?.startsWith("ST-")
                    ? `${application?.fullName} has filed ${application?.type === "courseFeeApplication"? "course fee application": application?.type === "offerLetter" ? "offer letter" : application?.type === "visa" ? "visa" : null }`
                    : "Unknown type"
                }
              pageType="application"
              refferedBy={application?.referredBy}
              />
            </div>
          ))
        ) : (
          <DataNotFound
            className="flex flex-col items-center  mt-16 "
            message="No Data Available"
            linkText="Back to Dashboard"
            linkDestination="/admin/dashboard"
          />
        )
      ) : data?.length > 0 ? (
        data.map((item, index) => (
          <div key={index}>
            <AdminCard
              userType={item?.type === "agent" ? "Agent" : "Student"}
              userId={item?.agId ? item?.agId : item?.stId}
              isApproval={true}
              newStatus="completed"
              id={item?._id}
              agentId={item?.agentId || item?._id}
              linkTwo="/agent-profile"
              linkOne="/student-profile"
              rejectStatus="rejected"
              name={`${item?.firstName} ${item?.lastName}` || "Unknown User"}
              description={
                `${item?.firstName} ${item?.lastName} ${
                  item?.status === "requestedForReapproval"
                    ? `${
                        item?.type === "agent" ? "agent" : "student"
                      } has requested for reapproval of the profile as`
                    : "has requested to register as "
                } ${
                  item?.type === "agent" ? "an agent" : "a student"
                } on SOV portal` || "Unknown User"
              }
              currentStatus="rejected"
              rejectionMessage={item?.message}
              pageType="offerLetter"

            />
          </div>
        ))
      ) : (
        <DataNotFound
          className="flex flex-col items-center  mt-16 "
          message="No Data Available"
          linkText="Back to Dashboard"
          linkDestination="/admin/dashboard"
        />
      )}
    </div>
  );
};

export default Rejected;

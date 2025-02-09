import { RouterProvider, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  fetchCountryState,
  getCountryOption,
  getCourses,
  getPopularCourses,
  getPrefCountryOption,
} from "./features/generalSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { router } from "./routes/Route";
import { agentInformation } from "./features/agentSlice";
import { studentInfo } from "./features/studentSlice";
import {
  getAdminConnectionDetails,
  getConnectionDetails,
} from "./features/getConnectionDetails";
import socketServiceInstance from "./services/socket";
import { io } from "socket.io-client";
import { adminProfileData, getMemberProfile } from "./features/adminSlice";
import { startTokenHeartbeat } from "./services/tokenCheck";

function App() {
  const role = localStorage.getItem("role");
  const studentId = localStorage.getItem("student");
  const dispatch = useDispatch();

  const { prefCountryOption, courses, countryOption, countryState } =
    useSelector((state) => state.general);
  useEffect(() => {
    let socket;

    const initializeSocketConnection = async () => {
      try {
        let data;
        if (role === "0" || role === "1" || role === "4" || role === "5") {
          data = await getAdminConnectionDetails();
        } else if (role === "2" || role === "3") {
          data = await getConnectionDetails();
        }

        await socketServiceInstance.connectToSocket(
          "http://localhost:8080/",
          // "http://localhost:5173/",

          data
        );
      } catch (error) {
        console.error("Error initializing socket connection:", error);
      }
    };

    initializeSocketConnection();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [role, socketServiceInstance]);
  useEffect(() => {
    let countryInterval,
      prefCountryInterval,
      coursesInterval,
      countryStateInterval;

    if (countryOption.length === 0) {
      countryInterval = setInterval(() => {
        dispatch(getCountryOption());
      }, 2000);
    }
    if (Array.isArray(countryState) && countryState.length === 0) {
      countryStateInterval = setInterval(() => {
        dispatch(fetchCountryState());
      }, 2000);
    }
    if (prefCountryOption.length === 0) {
      prefCountryInterval = setInterval(() => {
        dispatch(getPrefCountryOption());
      }, 2000);
    }

    if (Array.isArray(courses) && courses.length === 0) {
      coursesInterval = setInterval(() => {
        dispatch(getCourses());
        dispatch(getPopularCourses());
      }, 2000);
    }

    return () => {
      if (countryInterval) clearInterval(countryInterval);
      if (prefCountryInterval) clearInterval(prefCountryInterval);
      if (coursesInterval) clearInterval(coursesInterval);
      if (countryStateInterval) clearInterval(countryStateInterval);
    };
  }, [dispatch, countryOption, prefCountryOption, courses, role, countryState]);

  useEffect(() => {
    if (role === "2") {
      dispatch(agentInformation());
    }
    if (role === "3") {
      dispatch(studentInfo(studentId));
    }
    if (role === "0" || role === "1" || role === "4" || role === "5") {
      dispatch(adminProfileData());
    }
    if (role === "1") {
      dispatch(getMemberProfile());
    }
  }, [dispatch]);

  useEffect(() => {
    const stopHeartbeat = startTokenHeartbeat();

    return () => {
      stopHeartbeat();
    };
  }, []);
  return (
    <>
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar />
      <div className="overflow-hidden">
        <RouterProvider router={router} />
      </div>
    </>
  );
}

export default App;

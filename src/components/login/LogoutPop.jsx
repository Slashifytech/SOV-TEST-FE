import React, { useEffect } from "react";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../features/authSlice";
import socketServiceInstance from "../../services/socket";
import { resetStore } from "../../features/action";

const LogoutPop = ({ isLogoutOpen, closeLogout }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetStore());
    localStorage.removeItem("student");
    localStorage.removeItem("userAuthToken");
    localStorage.removeItem("form");
    localStorage.removeItem("role");

      socketServiceInstance.disconnectSocket();
      console.log("disconnected")
    

    if (role === "0" || role === "1") {
      navigate("/admin/role/auth/login");
    } else if( role ==="4" || role === "5" ){
      navigate("/province/login")
    } else {
      navigate("/login");
    }
    closeLogout();
  };



  useEffect(() => {
    if (isLogoutOpen) {
      Swal.fire({
        title: "Do you want to logout?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#d33",
        confirmButtonColor: "#98090B",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        backdrop: true,
        customClass: {
          popup: "font-poppins text-sm",
          title: "swal-title",
          confirmButton: "swal-confirm",
          cancelButton: "swal-cancel",
          actions: "swal-actions", // Add custom class for action buttons
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.isConfirmed) {
          handleLogout();
        } else {
          closeLogout();
        }
      });
    }
  }, [isLogoutOpen]);

  return null;
};

export default LogoutPop;

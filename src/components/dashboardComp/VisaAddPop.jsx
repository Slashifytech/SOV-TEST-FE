import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CountrySelect } from "../reusable/Input";
import { useSelector } from "react-redux";
import { RxCross2 } from "react-icons/rx";

const VisaAddPop = ({ closeOpt, isOpenOpt, state }) => {
  const { prefCountryOption } = useSelector((state) => state.general);
  const [preferredCountry, setPreferredCountry] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const navigate = useNavigate();

  // Handle radio button change
  const handleRadioChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedOption(selectedValue);

    // Redirect based on the selected value
    if (selectedValue === "offerLetter") {
      navigate("/offerLetter-apply", { state: state });
      closeOpt();
    } else if (selectedValue === "courseFee") {
      navigate("/course-fee", { state: state });
      closeOpt();
    }
  };

  // Handle country selection change
  const handleCountryChange = (e) => {
    const { value } = e.target;
    setPreferredCountry(value);

    // Redirect when a country is selected
    if (value) {
      navigate("/visa-apply", { state: { state, preferredCountry: value } });
      closeOpt();
    }
  };

  return (
    <>
      {isOpenOpt && (
        <div
          className={`fixed inset-0 font-poppins flex items-center justify-center popup-backdrop z-50 sm:px-52 px-6 ${
            isOpenOpt ? "block" : "hidden"
          }`}
        >
          <div className="bg-white pb-9 rounded-lg md:w-[54%] w-full relative p-9 flex flex-col items-center justify-center  app-open-animation">
          <span onClick={closeOpt} className="absolute top-2 right-3 text-[25px] cursor-pointer text-primary"><RxCross2 /></span>
            <p className="text-sidebar font-medium mt-6 md:text-[16px] sm:text-[13px]  text-center">
            Before applying for visa lodgement, choose a student from the student directory for whom you are applying.
            </p>

            {/* Radio buttons */}
            <Link to="/agent/student-lists" className="text-center px-6 py-2 rounded-md cursor-pointer bg-primary text-white mt-6 md:text-[16px] sm:text-[13px]">Go to Student Directory</Link>
          </div>
        </div>
      )}
    </>
  );
};

export default VisaAddPop;

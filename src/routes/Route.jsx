import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../components/ErrorPage";
import AgentReg from "../pages/AgentReg";
import Login from "../pages/Login";
import NewAccount from "../pages/NewAccount";
import StudentReg from "../pages/StudentReg";
import SignUp from "../student/SignUp";
import AgentSignUp from "./../agent/AgentSignUp";
import Home from "./../pages/Home";
import ProtectedAgent from "./ProtectedAgent";
import ProtectedStudent from "./ProtectedStudent";
import ForgotPassword from "../pages/ForgotPassword";
import OtpVerification from "../pages/OtpVerification";
import ChangePassword from "../pages/ChangePassword";
import SuccessPage from "../pages/SuccessPage";
import Dashboard from "../student/Dashboard";
import ApplyOfferLater from "../student/ApplyOfferLater";
import WaitingPage from "../pages/WaitingPage";
import AgentDashboard from "../agent/AgentDashboard";
import StudentsList from "../agent/StudentsList";
import AgentShortlist from "../agent/AgentShortlist";
import Institution from "../agent/Institution";
import StudentAgentProtected from "./StudentAgentProtected";
import StudentProfile from "../agent/StudentProfile";
import Applications from "../agent/Applications";
import ProfileEdit from "../agent/ProfileEdit";
import ApplicationView from "../agent/ApplicationView";
import OfferLetterEdit from "../agent/OfferLetterEdit";
import Approval from "../admin/Approval";
import ApplicationReview from "../admin/ApplicationReview";
import AdminLogin from "../admin/AdminLogin";
import ProtectedAdmin from "./ProtectedAdmin";
import AllApplication from "../student/AllApplication";
import CommonRoleProtected from "./CommonRoleProtected";
import AgentRoleProtected from "./AgentRoleProtected";
import HelpNSupport from "../pages/HelpNSupport";
import CourseFeeApplication from "../pages/CourseFeeApplication";
import ChangeDashboardPassword from "../pages/ChangeDashboardPassword";
import ChangeDashboardEmail from "../components/dashboardComp/ChangedashboardEmail";
import DashboardEmailOtp from "../components/dashboardComp/DashboardEmailOtp";
import VisaApply from "../pages/VisaApply";
import TicketSuppport from "./../admin/TicketSuppport";
import ChangeEmail from "../admin/ChangeEmail";
import ChangeAdminPassword from "../admin/ChangePassword";
import StudentDirectory from "../admin/StudentDirectory";
import AgentDirectory from "../admin/AgentDirectory";
import VisaEdit from "../agent/VisaEdit";
import CourseFeeEdit from "../agent/CourseFeeEdit";
import AdminDashboard from "../admin/AdminDashboard";
import VisaStatusComponent from "../components/dashboardComp/VisaStatusComponent";
import Documents from "./../student/Documents";
import AdminProfileEdit from "../admin/AdminProfileEdit";
import ReApproval_Request from "../pages/ReApproval_Request";
import NotificatonPage from "../pages/NotificatonPage";
import ApplicationList from "../admin/ApplicationList";
import StudentApplicationView from "../admin/StudentApplicationView";
import NoAccess from "./../components/NoAccess";
import DeleteAccount from "../pages/DeleteAccount";
import AdminInstitute from "../admin/AdminInstitute";
import AddInstitute from "../admin/AddInstitute";
import InstituteView from "../pages/InstituteView";
import TeamList from "../admin/TeamList";
import AddMember from "../admin/AddMember";
import TeamActivity from "../admin/TeamActivity";
import StrictAdmin from "./StrictAdmin";
import AirTicketForm from "../pages/AirTicketForm";
import AirTickets from "../pages/AirTickets";
import AirTicketLists from "../admin/AirTicketLists";
import AllVisa from "../agent/AllVisa";
import PartnerList from "../admin/PartnerLists";
import StrictPartner from "./StrictPartner";
import PartnerEmployee from "../admin/PartnerEmployee";
import PartnerEmployeeDetail from "../admin/PartnerEmployeeDetail";
import PartnerLogin from "../partner/PartnerLogin"
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home></Home>,
  },
  {
    path: "/login",
    element: <Login></Login>,
  },
  {
    path: "/province/login",
    element: <PartnerLogin></PartnerLogin>,
  },
  {
    path: "/change-Pass",
    element: <ChangePassword></ChangePassword>,
  },
  {
    path: "/change-success",
    element: <SuccessPage></SuccessPage>,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword></ForgotPassword>,
  },
  {
    path: "/otp-verify",
    element: <OtpVerification></OtpVerification>,
  },
  {
    path: "/new-account",
    element: <NewAccount></NewAccount>,
  },
  {
    path: "/student-signup",
    element: <SignUp></SignUp>,
  },

  {
    path: "/agent-signup",
    element: <AgentSignUp></AgentSignUp>,
  },
  {
    path: "/agent/account-deleted",
    element: <ReApproval_Request></ReApproval_Request>,
  },
  {
    path: "/student/account-deleted",
    element: <ReApproval_Request></ReApproval_Request>,
  },
  {
    path: "/notifications",
    element: (
      <CommonRoleProtected>
        <NotificatonPage></NotificatonPage>
      </CommonRoleProtected>
    ),
  },
  {
    path: "/removed-user",
    element: <NoAccess></NoAccess>,
  },
  {
    path: "/student-form/:page",
    element: (
      <StudentAgentProtected>
        <StudentReg></StudentReg>
      </StudentAgentProtected>
    ),
  },
  {
    path: "/agent-form/:page",
    element: (
      <AgentRoleProtected>
        <AgentReg></AgentReg>
      </AgentRoleProtected>
    ),
  },
  {
    path: "/waiting",
    element: (
      // <ProtectedStudent>
      <WaitingPage></WaitingPage>
      // </ProtectedStudent>
    ),
  },

  {
    path: "/course-fee",
    element: (
      <CommonRoleProtected>
        <CourseFeeApplication></CourseFeeApplication>
      </CommonRoleProtected>
    ),
  },
  {
    path: "/settings/change-password",
    element: (
      <StudentAgentProtected>
        <ChangeDashboardPassword></ChangeDashboardPassword>
      </StudentAgentProtected>
    ),
  },
  {
    path: "/settings/change-email",
    element: (
      <StudentAgentProtected>
        <ChangeDashboardEmail></ChangeDashboardEmail>
      </StudentAgentProtected>
    ),
  },
  {
    path: "/settings/otp-confirm",
    element: (
      <CommonRoleProtected>
        <DashboardEmailOtp></DashboardEmailOtp>
      </CommonRoleProtected>
    ),
  },

  {
    path: "/visa-apply",
    element: (
      <StudentAgentProtected>
        <VisaApply></VisaApply>
      </StudentAgentProtected>
    ),
  },
  //student routes
  {
    path: "/student/dashboard",
    element: (
      <ProtectedStudent>
        <Dashboard></Dashboard>
      </ProtectedStudent>
    ),
  },
  {
    path: "/student/application",
    element: (
      <ProtectedStudent>
        <AllApplication></AllApplication>
      </ProtectedStudent>
    ),
  },
  {
    path: "/student/visa-update",
    element: (
      <ProtectedStudent>
        <VisaStatusComponent></VisaStatusComponent>
      </ProtectedStudent>
    ),
  },
  {
    path: "/student/document",
    element: (
      <ProtectedStudent>
        <Documents></Documents>
      </ProtectedStudent>
    ),
  },
  {
    path: "/account/profile-edit",
    element: (
      <CommonRoleProtected>
        <StudentProfile></StudentProfile>
      </CommonRoleProtected>
    ),
  },
  {
    path: "/student/shortlist",
    element: (
      <StudentAgentProtected>
        <AgentShortlist></AgentShortlist>
      </StudentAgentProtected>
    ),
  },
  {
    path: "/help-support",
    element: (
      <StudentAgentProtected>
        <HelpNSupport></HelpNSupport>
      </StudentAgentProtected>
    ),
  },
  {
    path: "/offerLetter-apply",
    element: (
      <StudentAgentProtected>
        <ApplyOfferLater></ApplyOfferLater>
      </StudentAgentProtected>
    ),
  },

  {
    path: "/agent/dashboard",
    element: (
      <ProtectedAgent>
        <AgentDashboard></AgentDashboard>
      </ProtectedAgent>
    ),
  },
  {
    path: "/agent/student-lists",
    element: (
      <ProtectedAgent>
        <StudentsList></StudentsList>
      </ProtectedAgent>
    ),
  },

  {
    path: "/student-profile",
    element: (
      <CommonRoleProtected>
        <StudentProfile></StudentProfile>
      </CommonRoleProtected>
    ),
  },
  {
    path: "/agent-profile",
    element: (
      <CommonRoleProtected>
        <ProfileEdit></ProfileEdit>
      </CommonRoleProtected>
    ),
  },
  {
    path: "/application-view",
    element: (
      <CommonRoleProtected>
        <OfferLetterEdit></OfferLetterEdit>
      </CommonRoleProtected>
    ),
  },
  {
    path: "/coursefee-view",
    element: (
      <CommonRoleProtected>
        <CourseFeeEdit></CourseFeeEdit>
      </CommonRoleProtected>
    ),
  },
  {
    path: "/visa-view",
    element: (
      <CommonRoleProtected>
        <VisaEdit></VisaEdit>
      </CommonRoleProtected>
    ),
  },
  {
    path: "/agent/applications",
    element: (
      <ProtectedAgent>
        <Applications></Applications>
      </ProtectedAgent>
    ),
  },
  {
    path: "/air-ticket/add",
    element: (
      <CommonRoleProtected>
        <AirTicketForm></AirTicketForm>
      </CommonRoleProtected>
    ),
  },

  {
    path: "/air-ticket/lists",
    element: (
      <CommonRoleProtected>
        <AirTickets></AirTickets>
      </CommonRoleProtected>
    ),
  },
  {
    path: "/agent/application/lists",
    element: <ApplicationView></ApplicationView>,
  },
  {
    path: "/settings/delete-account",
    element: (
      <StudentAgentProtected>
        <DeleteAccount></DeleteAccount>
      </StudentAgentProtected>
    ),
  },
  {
    path: "/offerLetter/edit",
    element: (
      <CommonRoleProtected>
        <OfferLetterEdit></OfferLetterEdit>
      </CommonRoleProtected>
    ),
  },
  {
    path: "/visa/edit",
    element: (
      <CommonRoleProtected>
        <VisaEdit></VisaEdit>
      </CommonRoleProtected>
    ),
  },
  {
    path: "/course-fee/edit",
    element: (
      <CommonRoleProtected>
        <CourseFeeEdit></CourseFeeEdit>
      </CommonRoleProtected>
    ),
  },
  {
    path: "/account-settings/profile-edit",
    element: (
      <CommonRoleProtected>
        <ProfileEdit></ProfileEdit>
      </CommonRoleProtected>
    ),
  },
  {
    path: "/agent-profile",
    element: (
      <ProtectedAdmin>
        <ProfileEdit></ProfileEdit>
      </ProtectedAdmin>
    ),
  },
  {
    path: "/agent/shortlist",
    element: (
      <StudentAgentProtected>
        <AgentShortlist></AgentShortlist>
      </StudentAgentProtected>
    ),
  },
  {
    path: "/agent/institution",
    element: (
      <ProtectedAgent>
        <Institution></Institution>
      </ProtectedAgent>
    ),
  },
  {
    path: "/agent/visa-lodgement",
    element: (
      <ProtectedAgent>
        <AllVisa></AllVisa>
      </ProtectedAgent>
    ),
  },
  {
    path: "/admin/approvals",
    element: (
      <ProtectedAdmin>
        <Approval></Approval>
      </ProtectedAdmin>
    ),
  },
  {
    path: "/admin/applications-review",
    element: (
      <ProtectedAdmin>
        <ApplicationReview></ApplicationReview>
      </ProtectedAdmin>
    ),
  },
  {
    path: "/admin/applications-review",
    element: (
      <ProtectedAdmin>
        <ApplicationReview></ApplicationReview>
      </ProtectedAdmin>
    ),
  },
  //admin routes
  {
    path: "/admin/role/auth/login",
    element: <AdminLogin></AdminLogin>,
  },
  {
    path: "/admin/dashboard",
    element: (
      <CommonRoleProtected>
        <AdminDashboard></AdminDashboard>
      </CommonRoleProtected>
    ),
  },
  {
    path: "/admin/ticket",
    element: (
      <ProtectedAdmin>
        <TicketSuppport></TicketSuppport>
      </ProtectedAdmin>
    ),
  },
  {
    path: "/admin/application-list",

    element: (
      <CommonRoleProtected>
        <ApplicationList></ApplicationList>{" "}
      </CommonRoleProtected>
    ),
  },
  {
    path: "/admin/student-applications",
    element: (
      <CommonRoleProtected>
        <StudentApplicationView></StudentApplicationView>{" "}
      </CommonRoleProtected>
    ),
  },
  {
    path: "/admin/change-email",
    element: (
      <StrictAdmin>
        <ChangeEmail></ChangeEmail>{" "}
      </StrictAdmin>
    ),
  },
  {
    path: "/admin/profile",
    element: (
      <StrictAdmin>
        <AdminProfileEdit></AdminProfileEdit>{" "}
      </StrictAdmin>
    ),
  },
  {
    path: "/admin/change-password",
    element: (
      <StrictAdmin>
        <ChangeAdminPassword></ChangeAdminPassword>{" "}
      </StrictAdmin>
    ),
  },
  {
    path: "/admin/agent-directory",
    element: (
      <CommonRoleProtected>
        {" "}
        <AgentDirectory></AgentDirectory>{" "}
      </CommonRoleProtected>
    ),
  },
  {
    path: "/admin/agent-student",
    element: (
      <CommonRoleProtected>
        <StudentDirectory></StudentDirectory>{" "}
      </CommonRoleProtected>
    ),
  },
  {
    path: "/admin/institute",
    element: (
      <ProtectedAdmin>
        <AdminInstitute></AdminInstitute>{" "}
      </ProtectedAdmin>
    ),
  },
  {
    path: "/add-institute",
    element: (
      <ProtectedAdmin>
        <AddInstitute></AddInstitute>{" "}
      </ProtectedAdmin>
    ),
  },
  {
    path: "/institute-view",
    element: (
      <CommonRoleProtected>
        <InstituteView></InstituteView>{" "}
      </CommonRoleProtected>
    ),
  },
  {
    path: "/admin/student-directory",
    element: (
      <CommonRoleProtected>
        <StudentDirectory></StudentDirectory>{" "}
      </CommonRoleProtected>
    ),
  },
  {
    path: "/admin/team-members",
    element: (
      <StrictAdmin>
        <TeamList></TeamList>{" "}
      </StrictAdmin>
    ),
  },
  {
    path: "/admin/province/employee-lists",
    element: (
      <StrictPartner>
        <TeamList></TeamList>{" "}
      </StrictPartner>
    ),
  },
  {
    path: "/admin/add-member",
    element: (
      <StrictAdmin>
        <AddMember></AddMember>{" "}
      </StrictAdmin>
    ),
  },
  {
    path: "/admin/province/add-employee",
    element: (
      <StrictPartner>
        <AddMember></AddMember>{" "}
      </StrictPartner>
    ),
  },
  {
    path: "/admin/team-activity",
    element: (
      <StrictAdmin>
        <TeamActivity></TeamActivity>{" "}
      </StrictAdmin>
    ),
  },
  {
    path: "/admin/air-ticket-lists",
    element: (
      <ProtectedAdmin>
        <AirTicketLists></AirTicketLists>{" "}
      </ProtectedAdmin>
    ),
  },
  {
    path: "/admin/add-partner",
    element: (
      <StrictAdmin>
        <AddMember></AddMember>{" "}
      </StrictAdmin>
    ),
  },
  {
    path: "/admin/edit-employee",
    element: (
      <StrictPartner>
        <AddMember></AddMember>{" "}
      </StrictPartner>
    ),
  },
  {
    path: "/admin/partner-directory",
    element: (
      <StrictAdmin>
        <PartnerList></PartnerList>{" "}
      </StrictAdmin>
    ),
  },
  {
    path: "/admin/partner-employee",
    element: (
      <StrictAdmin>
        <PartnerEmployee></PartnerEmployee>{" "}
      </StrictAdmin>
    ),
  },
  {
    path: "/admin/partner-employee-details",
    element: (
      <StrictAdmin>
        <PartnerEmployeeDetail></PartnerEmployeeDetail>{" "}
      </StrictAdmin>
    ),
  },
  {
    path: "/*",
    element: <ErrorPage></ErrorPage>,
  },
]);

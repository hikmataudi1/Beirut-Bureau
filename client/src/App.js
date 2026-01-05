import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import MainLayout from "./layouts/MainLayout";
import "./App.css";

// Pages
import Login from "./pages/login/login";
import CitizenRegistration from "./pages/CitizenRegistration/CitizenRegistration";
import CertificateRequestsPage from "./pages/CertificateRequestsPage/CertificateRequestsPage";
import NewRequest from "./pages/NewRequest/NewRequest";
import EmployeeList from "./pages/EmployeeList/EmployeeList";
import AddEmployee from "./pages/AddEmployee/AddEmployee";
import EditEmployee from "./pages/EditEmployee/EditEmployee";
import EmployeeDetails from "./pages/EmployeeDetails/EmployeeDetails";
import { PermitRequestReview } from "./pages/CitizenPermitsRequestReview/CitizenRequestReview";
import { CitizenPermitRequest } from "./pages/CitizenPermitRequest/CitizenPermitRequest";
import { PaymentReview } from "./pages/PaymentReview/PaymentReview";
import { PaymentRequest } from "./pages/PaymentRequest/PaymentRequest";
import AttendancesDashboard from "./pages/AttendancesPage/AttendancesDashboard";
import AttendacesEdit from "./pages/AttendancesEdit/AttendacesEdit";

import PayrollDashboard from "./pages/PayrollDashboard/PayrollDashboard";
import PerformanceOverviewDashboard from "./pages/PerformanceOverviewDashboard/PerformanceOverviewDashboard";

function App() {
  return (
    <BrowserRouter>
      <Toaster />

      <Routes>
        {/* 🔓 Public routes (NO sidebar) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<CitizenRegistration />} />

        {/* 🔒 App routes (WITH sidebar) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<CertificateRequestsPage />} />
          <Route path="/request" element={<CertificateRequestsPage />} />
          <Route path="/newRequest" element={<NewRequest />} />
          

          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/employees/add" element={<AddEmployee />} />
          <Route path="/employees/edit/:id" element={<EditEmployee />} />
          <Route path="/employees/:id" element={<EmployeeDetails />} />

          <Route path="/permitreview" element={<PermitRequestReview />} />
          <Route path="/permitrequest" element={<CitizenPermitRequest />} />
          <Route path="/paymentreview" element={<PaymentReview />} />
          <Route path="/paymentrequest" element={<PaymentRequest />} />

          <Route path="/attendances" element={<AttendancesDashboard />} />
          <Route path="/attendances/edit" element={<AttendacesEdit />} />
          <Route path="/payroll" element={<PayrollDashboard />} />
          <Route path="/performance" element={<PerformanceOverviewDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

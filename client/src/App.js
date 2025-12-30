import logo from './logo.svg';
import CitizenRegistration from './pages/CitizenRegistration/CitizenRegistration';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import CertificateRequestsPage from './pages/CertificateRequestsPage/CertificateRequestsPage';
import NewRequest from './pages/NewRequest/NewRequest'
import Login from './pages/login/login'
import EmployeeList from './pages/EmployeeList/EmployeeList';
import AddEmployee from './pages/AddEmployee/AddEmployee';
import EditEmployee from './pages/EditEmployee/EditEmployee';
import EmployeeDetails from './pages/EmployeeDetails/EmployeeDetails';
import "./styles/employee.css";
  

function App() {
  return (

    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<CitizenRegistration />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/Request" element={<CertificateRequestsPage/>}/>
        <Route path="/newRequest" element={<NewRequest/>}/>
       <Route path="/employees" element={<EmployeeList />} />
      <Route path="/employees/add" element={<AddEmployee />} />
      <Route path="/employees/edit/:id" element={<EditEmployee />} />
      <Route path="/employees/:id" element={<EmployeeDetails />} />

  
      </Routes>
    </BrowserRouter>

  );
}

export default App;

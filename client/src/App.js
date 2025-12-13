// import CitizenRegistration from './pages/CitizenRegistration';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
// import Profile from './pages/Profile';
import CertificateRequestsPage from './pages/CertificateRequestsPage';
import NewRequest from './pages/newRequest'
// import Viewrequest from './pages/Viewrequest'
import RequestsDashboard from "./citizens/RequestsDashboard";
import ServiceRequestForm from "./citizens/ServiceRequestForm";




function App() {
  return (

    <BrowserRouter>
      <Toaster />
      <Routes>
        {/* <Route path="/" element={<CitizenRegistration />} /> */}
        {/* <Route path="/login" element={<LoginPage />} /> */}
        {/* <Route path="/profile" element={<Profile />} /> */}
        <Route path="/Request" element={<CertificateRequestsPage/>}/>
        <Route path='/newRequest'element={<NewRequest/>}/>
        {/* <Route path='/Viewrequest/:id'element={<Viewrequest/>}/> */}
        <Route path="/" element={<RequestsDashboard />} />
        <Route path="/new" element={<ServiceRequestForm />} />

      </Routes>
    </BrowserRouter>

  );
}

export default App;

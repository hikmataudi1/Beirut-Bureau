import logo from './logo.svg';
import CitizenRegistration from './pages/CitizenRegistration/CitizenRegistration';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import CertificateRequestsPage from './pages/CertificateRequestsPage/CertificateRequestsPage';
import NewRequest from './pages/newRequest/newRequest'
import Viewrequest from './pages/Viewrequest/Viewrequest'
import Login from './pages/login/login'
import Sidebar from './components/Sidebar';
import './App.css';



function App() {
  return (
    <>
    
    <BrowserRouter>
    <Sidebar />
    <div className="app-content">
      <Toaster />
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/register" element={<CitizenRegistration />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/Request" element={<CertificateRequestsPage/>}/>
        <Route path='/newRequest'element={<NewRequest/>}/>
        <Route path='/Viewrequest/:id'element={<Viewrequest/>}/>
      </Routes>
      </div>
    </BrowserRouter>
    </>

  );
}

export default App;

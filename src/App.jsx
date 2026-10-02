import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BookingForm from './pages/BookingForm';
import Login from './pages/Login';
import MyRides from './pages/MyRides';
import DriverApplication from './pages/DriverApplication';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminTrips from './pages/admin/AdminTrips';
import AdminMessages from './pages/admin/AdminMessages';
import AdminDrivers from './pages/admin/AdminDrivers';
import AdminUsers from './pages/admin/AdminUsers';
import AdminVehicles from './pages/admin/AdminVehicles';
import AdminPayments from './pages/admin/AdminPayments';
import AdminReports from './pages/admin/AdminReports';
import SiteLayout from './components/site/SiteLayout';
import Services from './pages/Services';
import About from './pages/About';
import Safety from './pages/Safety';
import Faq from './pages/Faq';
import Contact from './pages/Contact';
import Pay from './pages/Pay';
import RequireAuth from './components/RequireAuth';
import './styles/theme.css';
import './styles/site.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/safety" element={<Safety />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/pay" element={<Pay />} />
          <Route path="/book" element={<BookingForm />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/my-rides" element={<MyRides />} />
        <Route path="/drivers/apply" element={<DriverApplication />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route path="trips" element={<AdminTrips />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="drivers" element={<AdminDrivers />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="vehicles" element={<AdminVehicles />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="reports" element={<AdminReports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

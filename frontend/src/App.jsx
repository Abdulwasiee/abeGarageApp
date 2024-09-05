import React from "react";
import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./Markup/pages/Root/Home/Home";
import Login from "./Markup/pages/Login/Login";
import AddEmployee from "./Markup/pages/Admin/AddEmployee/AddEmployee";
import Header from "./Markup/components/mainHeader/Header";
import Footer from "./Markup/components/footer/Footer";
import ContactUs from "./Markup/pages/Root/ContactUs/ContactUs";
import AboutUs from "./Markup/pages/Root/AboutUs/AboutUs";
import Services from "./Markup/pages/Root/Services/Services";
import { UserProvider } from "./context/UserContext";
import Dashboard from "./Markup/pages/Admin/AdminDashboard/Dashboard";
import AllEmployees from "./Markup/pages/Admin/AllEmployees/AllEmployees";
import UnAuthorized from "./Markup/pages/UnAuthorized/UnAuthorized";
import EditEmployee from "./Markup/pages/Admin/EditEployee/EditEmployee";
import ProtectedRoute from "./routes/protectedRoutes/ProtectedRoutes";
import { ROLES } from "./constants/roles";
import Orders from "./Markup/pages/Admin/Orders/Orders";
import AddCustomer from "./Markup/pages/Admin/AddCustomer/AddCustomer";
import Customers from "./Markup/pages/Admin/Custmers/Customers";
import EditCustomer from "./Markup/pages/Admin/EditCustomer/EditCustomerPage";
import CustomerProfileWrapper from "./Markup/components/Admin/CustomerProfileWrapper/CustomerProfileWrapper";
import CustomerService from "./Markup/pages/Admin/CustomerService/CustomerService";
import EditVehicle from "./Markup/pages/Admin/EditVehicle/EditVehicle";
import OurServices from "./Markup/pages/Admin/OurServices/OurServices";
import EditServicePage from "./Markup/pages/Admin/EditService/EditService";
import EditOrders from "./Markup/pages/Admin/EditOrders/EditOrders";
import OrderDetailPage from "./Markup/pages/Admin/OrderDetailPage/OrderDetailPage";
import AddOrders from "./Markup/pages/Admin/AddOrders/AddOrders";

function App() {
  return (
    <UserProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
              <AddEmployee />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees/:employee_id"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
              <EditEmployee />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute
              allowedRoles={[ROLES.EMPLOYEE, ROLES.ADMIN, ROLES.MANAGER]}
            >
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders/edit/:orderId"
          element={
            <ProtectedRoute
              allowedRoles={[ROLES.EMPLOYEE, ROLES.ADMIN, ROLES.MANAGER]}
            >
              <EditOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders/view/:orderId"
          element={
            <ProtectedRoute
              allowedRoles={[ROLES.EMPLOYEE, ROLES.ADMIN, ROLES.MANAGER]}
            >
              <OrderDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
              <AllEmployees />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-customer"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
              <AddCustomer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/customers"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
              <Customers />
            </ProtectedRoute>
          }
        />
        <Route
          path="customers/edit-customer/:customer_id"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
              <EditCustomer />
            </ProtectedRoute>
          }
        />
        <Route
          path="vehicles/edit-vehicle/:vehicle_id"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
              <EditVehicle />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers/customer-profile/:customer_id/"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
              <CustomerProfileWrapper />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/services"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
              <OurServices />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/services/edit-services/:service_id"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
              <EditServicePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-order"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
              <AddOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vehicles/:vehicle_id"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
              <CustomerService />
            </ProtectedRoute>
          }
        />

        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/services" element={<Services />} />
        <Route path="/unauthorized" element={<UnAuthorized />} />
      </Routes>
      <Footer />
    </UserProvider>
  );
}

export default App;

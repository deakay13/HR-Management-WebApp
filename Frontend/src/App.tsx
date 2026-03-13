import { BrowserRouter, Routes, Route } from "react-router";
import { Toaster } from "sonner";
//import auth
import SignInPage from "./pages/SignInPage";

//import mainpages
import PortalPage from "./pages/PortalPage";

//import workspaces
import DashBoard from "./components/workspaces/DashBoardComponents";
import Contract from "./components/workspaces/ContractComponents";
import Employee from "./components/workspaces/EmployeeComponents";
import Department from "./components/workspaces/DepartmentComponents";
import WorkingHours from "./components/workspaces/WorkingHours";
import Payroll from "./components/workspaces/PayrollComponents";
import BasicSalary from "./components/workspaces/BasicSalaryComponents";
import Allowances from "./components/workspaces/AllowancesComponents";
import Deductions from "./components/workspaces/DeductrionsComponents";

//importmanagements
import Accounts from "./components/managements/AccountsComponents";
import Roles from "./components/managements/RolesComponents";
import Permissions from "./components/managements/PermissionsComponents";

//import systems
import GetHelp from "./components/systems/GetHelpComponents";
import Settings from "./components/systems/SettingsComponents";
// import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignInPage />} />
          <Route path="/signin" element={<SignInPage />} />
          {/* <Route element={<ProtectedRoute />}>
          </Route> */}
          <Route path="/PortalPage" element={<PortalPage />}>
            //import workspaces
            <Route path="DashBoard" element={<DashBoard />} />
            <Route path="Contract" element={<Contract />} />
            <Route path="Employee" element={<Employee />} />
            <Route path="Department" element={<Department />} />
            <Route path="WorkingHours" element={<WorkingHours />} />
            <Route path="Payroll" element={<Payroll />} />
            <Route path="BasicSalary" element={<BasicSalary />} />
            <Route path="Allowances" element={<Allowances />} />
            <Route path="Deductions" element={<Deductions />} />
            //NavManagements routes
            <Route path="Accounts" element={<Accounts />} />
            <Route path="Roles" element={<Roles />} />
            <Route path="Permissions" element={<Permissions />} />
            //systems routes
            <Route path="Settings" element={<Settings />} />
            <Route path="GetHelp" element={<GetHelp />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

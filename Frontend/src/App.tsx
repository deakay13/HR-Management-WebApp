import { BrowserRouter, Routes, Route } from "react-router";
import { Toaster } from "sonner";
//import auth
import SignInPage from "./pages/SignInPage";

//import manages
import PortalPage from "./pages/PortalPage";

//import workspaces
import DashBoard from "./components/workspaces/DashboardComponents";
import Contract from "./components/workspaces/ContractsComponents";
import Employee from "./components/workspaces/EmployeesComponents";
import Department from "./components/workspaces/DepartmentsComponents";
import WorkingHours from "./components/workspaces/WorkingHoursComponents";
import Payroll from "./components/workspaces/PayRollComponents";
import BasicSalary from "./components/workspaces/BasicSalaryComponents";
import Allowances from "./components/workspaces/AllowancesComponents";
import Deductions from "./components/workspaces/DeductionsComponents";

{/*import managements*/}
import Accounts from "./components/managements/AccountsComponents";
import Roles from "./components/managements/RolesComponents";
import Permissions from "./components/managements/PermissionsComponents";

{/*import systems*/}
import GetHelp from "./components/systems/GetHelpComponents";
import Settings from "./components/systems/SettingsComponents";
import Profile from "./components/systems/profile/proFileComponent";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <>
      <Toaster 
        richColors 
        toastOptions={{
          classNames: {
            error: 'bg-[#cd3536] text-white border-[#cd3536]',
            success: 'bg-[#42c584] text-white border-[#42c584]',
          }
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/Signin" element={<SignInPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<PortalPage />} />
            <Route path="/PortalPage" element={<PortalPage />}>
              {/* Workspace routes */}
              <Route path="DashBoard" element={<DashBoard />} />
              <Route path="Contract" element={<Contract />} />
              <Route path="Employee" element={<Employee />} />
              <Route path="Department" element={<Department />} />
              <Route path="WorkingHours" element={<WorkingHours />} />
              <Route path="Payroll" element={<Payroll />} />
              <Route path="BasicSalary" element={<BasicSalary />} />
              <Route path="Allowances" element={<Allowances />} />
              <Route path="Deductions" element={<Deductions />} />
              {/* Management routes */}
              <Route path="Accounts" element={<Accounts />} />
              <Route path="Roles" element={<Roles />} />
              <Route path="Permissions" element={<Permissions />} />
              {/* System routes */}
              <Route path="Settings" element={<Settings />} />
              <Route path="GetHelp" element={<GetHelp />} />
              <Route path="Profile" element={<Profile />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

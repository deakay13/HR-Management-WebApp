import * as React from "react";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
import { useEmployeeStore } from "@/stores/informationStores/employeeStore";
import { useContractStore } from "@/stores/informationStores/contractStore";
import { useDepartmentStore } from "@/stores/informationStores/departmentStore";
import { usePayRollStore } from "@/stores/payRollStores/payRollStore";
import { useHoursStore } from "@/stores/payRollStores/hoursStore";

const DashboardComponents = () => {
  const { getEmployees } = useEmployeeStore();
  const { getContracts } = useContractStore();
  const { getDepartments } = useDepartmentStore();
  const { getPayRolls } = usePayRollStore();
  const { getHours } = useHoursStore();

  // Fetch all data needed for the dashboard on mount
  React.useEffect(() => {
    getEmployees();
    getContracts();
    getDepartments();
    getPayRolls();
    getHours();
  }, [getEmployees, getContracts, getDepartments, getPayRolls, getHours]);

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards />
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive />
        </div>
      </div>
    </div>
  );
};

export default DashboardComponents;

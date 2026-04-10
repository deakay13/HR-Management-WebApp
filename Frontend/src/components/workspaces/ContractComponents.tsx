import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStores/useAuthStore";
import { useContractStore } from "@/stores/informationStores/contractStore"; 
import { ContractTable } from "@/components/Table/informationsTable/ContractTable";

export default function ContractComponents() {
  const { contracts, initializing, getContracts } = useContractStore();
  const { accessToken } = useAuthStore();

  useEffect(() => {
    const init = async () => {
      if (accessToken) {
        await getContracts();
      }
    };
    init();
  }, [accessToken, getContracts]);

  if (initializing) {
    return (
      <div className="flex h-screen items-center justify-center">
        Đang tải trang...
      </div>
    );
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <ContractTable 
          data={contracts} 
          loading={initializing} 
        />
      </div>
    </div>
  );
}
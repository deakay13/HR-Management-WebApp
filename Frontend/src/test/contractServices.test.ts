import { describe, test, expect, vi, beforeEach } from "vitest";
import { ContractServices } from "@/services/informationServices/contractServices";
import api from "@/lib/axios";

vi.mock("@/lib/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("ContractServices", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getContracts", () => {
    test("fetches contracts successfully", async () => {
      const mockData = { data: [{ MaHD: "1" }] };
      (api.get as any).mockResolvedValue({ data: mockData });

      const result = await ContractServices.getContracts({ page: 1 });

      expect(api.get).toHaveBeenCalledWith("/api/information/contracts", {
        params: { page: 1 },
        withCredentials: true,
      });
      expect(result).toEqual(mockData);
    });
  });

  describe("getContract", () => {
    test("fetches single contract successfully", async () => {
      const mockData = { MaHD: "1" };
      (api.get as any).mockResolvedValue({ data: mockData });

      const result = await ContractServices.getContract("1");

      expect(api.get).toHaveBeenCalledWith("/api/information/contracts/1", {
        withCredentials: true,
      });
      expect(result).toEqual(mockData);
    });
  });

  describe("createContract", () => {
    test("creates contract successfully", async () => {
      const formData = new FormData();
      formData.append("name", "Test");
      const mockData = { MaHD: "new" };
      (api.post as any).mockResolvedValue({ data: mockData });

      const result = await ContractServices.createContract(formData);

      expect(api.post).toHaveBeenCalledWith("/api/information/contracts", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      expect(result).toEqual(mockData);
    });
  });

  describe("updateContract", () => {
    test("updates contract successfully", async () => {
      const formData = new FormData();
      formData.append("name", "Updated");
      const mockData = { MaHD: "1", name: "Updated" };
      (api.put as any).mockResolvedValue({ data: mockData });

      const result = await ContractServices.updateContract("1", formData);

      expect(api.put).toHaveBeenCalledWith("/api/information/contracts/1", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      expect(result).toEqual(mockData);
    });
  });

  describe("deleteContract", () => {
    test("deletes contract successfully", async () => {
      const mockData = { success: true };
      (api.delete as any).mockResolvedValue({ data: mockData });

      const result = await ContractServices.deleteContract("1");

      expect(api.delete).toHaveBeenCalledWith("/api/information/contracts/1", {
        withCredentials: true,
      });
      expect(result).toEqual(mockData);
    });
  });

  describe("searchContracts", () => {
    test("searches contracts successfully", async () => {
      const mockData = { data: [{ MaHD: "1" }] };
      (api.get as any).mockResolvedValue({ data: mockData });

      const result = await ContractServices.searchContracts({ query: "test" });

      expect(api.get).toHaveBeenCalledWith("/api/information/contracts/search", {
        params: { query: "test" },
        withCredentials: true,
      });
      expect(result).toEqual(mockData);
    });
  });

  describe("exportContract", () => {
    test("exports contracts successfully", async () => {
      const mockBlob = new Blob(["test"], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      (api.get as any).mockResolvedValue({ data: mockBlob });

      const result = await ContractServices.exportContract();

      expect(api.get).toHaveBeenCalledWith("/api/information/contracts/export", {
        responseType: "blob",
        withCredentials: true,
      });
      expect(result).toEqual(mockBlob);
    });
  });
});

import { describe, test, expect, vi, beforeEach } from "vitest";
import { accountsServices } from "@/services/userServices/accountsServices";
import api from "@/lib/axios";

vi.mock("@/lib/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("accountsServices", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAccounts", () => {
    test("fetches accounts successfully", async () => {
      const mockData = { data: [{ ID: "1" }] };
      (api.get as any).mockResolvedValue({ data: mockData });

      const result = await accountsServices.getAccounts("search_term");

      expect(api.get).toHaveBeenCalledWith("/api/account/Accounts", {
        params: { size: 0, search: "search_term" },
        withCredentials: true,
      });
      expect(result).toEqual(mockData.data);
    });

    test("fetches accounts without search successfully", async () => {
      const mockData = { data: [{ ID: "1" }] };
      (api.get as any).mockResolvedValue({ data: mockData });

      const result = await accountsServices.getAccounts();

      expect(api.get).toHaveBeenCalledWith("/api/account/Accounts", {
        params: { size: 0, search: undefined },
        withCredentials: true,
      });
      expect(result).toEqual(mockData.data);
    });
  });

  describe("createAccount", () => {
    test("creates account successfully", async () => {
      const data = { username: "Test" };
      const mockData = { id: "new" };
      (api.post as any).mockResolvedValue({ data: mockData });

      const result = await accountsServices.createAccount(data as any);

      expect(api.post).toHaveBeenCalledWith("/api/account/Accounts", data, {
        withCredentials: true,
      });
      expect(result).toEqual(mockData);
    });
  });

  describe("updateAccount", () => {
    test("updates account successfully", async () => {
      const data = { username: "Updated" };
      const mockData = { id: "1" };
      (api.put as any).mockResolvedValue({ data: mockData });

      const result = await accountsServices.updateAccount("1", data as any);

      expect(api.put).toHaveBeenCalledWith("/api/account/Accounts/1", data, {
        withCredentials: true,
      });
      expect(result).toEqual(mockData);
    });
  });

  describe("deleteAccount", () => {
    test("deletes account successfully", async () => {
      (api.delete as any).mockResolvedValue({});

      const result = await accountsServices.deleteAccount("1");

      expect(api.delete).toHaveBeenCalledWith("/api/account/Accounts/1", {
        withCredentials: true,
      });
      expect(result).toBe(true);
    });
  });

  describe("searchAccounts", () => {
    test("searches accounts successfully", async () => {
      const mockData = { data: [{ ID: "1" }] };
      (api.get as any).mockResolvedValue({ data: mockData });

      const result = await accountsServices.searchAccounts({ keyword: "test" });

      expect(api.get).toHaveBeenCalledWith("/api/account/Accounts/search", {
        params: { keyword: "test" },
        withCredentials: true,
      });
      expect(result).toEqual(mockData);
    });
  });

  describe("exportAccounts", () => {
    test("exports accounts successfully", async () => {
      const mockBlob = new Blob(["test"]);
      (api.get as any).mockResolvedValue({ data: mockBlob });

      const createObjectURLMock = vi.fn().mockReturnValue("blob:test");
      window.URL.createObjectURL = createObjectURLMock;

      const clickMock = vi.fn();
      const removeMock = vi.fn();
      const createElementMock = vi.spyOn(document, "createElement").mockReturnValue({
        href: "",
        setAttribute: vi.fn(),
        click: clickMock,
        remove: removeMock,
      } as any);

      const appendChildMock = vi.spyOn(document.body, "appendChild").mockImplementation(() => null as any);

      await accountsServices.exportAccounts();

      expect(api.get).toHaveBeenCalledWith("/api/account/Accounts/export", {
        responseType: "blob",
        withCredentials: true,
      });
      expect(createObjectURLMock).toHaveBeenCalled();
      expect(createElementMock).toHaveBeenCalledWith("a");
      expect(appendChildMock).toHaveBeenCalled();
      expect(clickMock).toHaveBeenCalled();
      expect(removeMock).toHaveBeenCalled();
    });
  });
});

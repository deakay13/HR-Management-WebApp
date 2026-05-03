import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { getImageUrl, openBase64InNewTab } from "@/utils/imageUtils";

describe("imageUtils", () => {
  describe("getImageUrl", () => {
    test("returns empty string if imagePath is falsy", () => {
      expect(getImageUrl(null)).toBe("");
      expect(getImageUrl(undefined)).toBe("");
      expect(getImageUrl("")).toBe("");
    });

    test("returns data URL as is", () => {
      const dataUrl = "data:image/png;base64,123";
      expect(getImageUrl(dataUrl)).toBe(dataUrl);
    });

    test("prefixes /uploads/ with base URL from env", () => {
      const oldEnv = import.meta.env.VITE_API_URL;
      import.meta.env.VITE_API_URL = "http://test.com/";
      
      expect(getImageUrl("/uploads/test.png")).toBe("http://test.com/uploads/test.png");
      
      import.meta.env.VITE_API_URL = oldEnv;
    });

    test("prefixes /uploads/ with default base URL if env not set", () => {
      const oldEnv = import.meta.env.VITE_API_URL;
      import.meta.env.VITE_API_URL = "";
      
      expect(getImageUrl("/uploads/test2.png")).toBe("http://localhost:5000/uploads/test2.png");
      
      import.meta.env.VITE_API_URL = oldEnv;
    });

    test("returns original path if not data URL or /uploads/", () => {
      expect(getImageUrl("http://external.com/img.png")).toBe("http://external.com/img.png");
      expect(getImageUrl("other/path.png")).toBe("other/path.png");
    });
  });

  describe("openBase64InNewTab", () => {
    let mockOpen: any;
    let mockFetch: any;

    beforeEach(() => {
      mockOpen = vi.fn().mockReturnValue({ focus: vi.fn() });
      vi.stubGlobal("open", mockOpen);

      mockFetch = vi.fn();
      vi.stubGlobal("fetch", mockFetch);
      
      // Mock URL.createObjectURL
      window.URL.createObjectURL = vi.fn().mockReturnValue("blob:test");
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    test("opens blob URL if fetch succeeds", async () => {
      mockFetch.mockResolvedValue({
        blob: () => Promise.resolve(new Blob()),
      });

      openBase64InNewTab("data:image/png;base64,123");

      // Wait for promises to resolve
      await new Promise(process.nextTick);

      expect(mockFetch).toHaveBeenCalledWith("data:image/png;base64,123");
      expect(window.URL.createObjectURL).toHaveBeenCalled();
      expect(mockOpen).toHaveBeenCalledWith("blob:test", "_blank");
    });

    test("opens blob URL if fetch succeeds and win is null", async () => {
      mockFetch.mockResolvedValue({
        blob: () => Promise.resolve(new Blob()),
      });
      mockOpen.mockReturnValue(null);

      openBase64InNewTab("data:image/png;base64,1234");

      await new Promise(process.nextTick);
      expect(mockOpen).toHaveBeenCalled();
    });

    test("falls back to opening base64 directly if fetch fails", async () => {
      mockFetch.mockRejectedValue(new Error("Fetch failed"));
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      openBase64InNewTab("data:image/png;base64,123");

      await new Promise(process.nextTick);

      expect(consoleSpy).toHaveBeenCalledWith("Failed to open Base64 in new tab:", expect.any(Error));
      expect(mockOpen).toHaveBeenCalledWith("data:image/png;base64,123", "_blank");
      
      consoleSpy.mockRestore();
    });

    test("falls back and handles null window", async () => {
      mockFetch.mockRejectedValue(new Error("Fetch failed"));
      mockOpen.mockReturnValue(null);
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      openBase64InNewTab("data:image/png;base64,12345");

      await new Promise(process.nextTick);
      expect(mockOpen).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });
});

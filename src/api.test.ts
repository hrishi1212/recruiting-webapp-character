import fetchMock from "jest-fetch-mock";
import { fetchCharacterData, saveCharacterData } from "./api";
import { API_URL } from "./consts";

fetchMock.enableMocks();

describe("API Functions", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  describe("fetchCharacterData", () => {
    it("should fetch character data successfully", async () => {
      const mockData = { name: "Test Character" };
      fetchMock.mockResponseOnce(JSON.stringify(mockData));

      const result = await fetchCharacterData();
      expect(result).toEqual(mockData);
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining(API_URL),
        expect.objectContaining({
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })
      );
    });

    it("should handle network errors", async () => {
      fetchMock.mockRejectOnce(new Error("Network error"));

      await expect(fetchCharacterData()).rejects.toThrow("Network error");
    });

    it("should handle non-ok response", async () => {
      fetchMock.mockResponseOnce("", { status: 404 });

      await expect(fetchCharacterData()).rejects.toThrow(
        "Failed to fetch character data"
      );
    });
  });

  describe("saveCharacterData", () => {
    const mockCharacterData = {
      name: "Test Character",
      attributes: { strength: 10 },
    };

    it("should save character data successfully", async () => {
      const mockResponse = { success: true };
      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      const result = await saveCharacterData(mockCharacterData);
      expect(result).toEqual(mockResponse);

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining(API_URL),
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(mockCharacterData),
        })
      );
    });

    it("should handle network errors during save", async () => {
      fetchMock.mockRejectOnce(new Error("Network error"));

      await expect(saveCharacterData(mockCharacterData)).rejects.toThrow(
        "Network error"
      );
    });

    it("should handle non-ok response during save", async () => {
      fetchMock.mockResponseOnce("", { status: 500 });

      await expect(saveCharacterData(mockCharacterData)).rejects.toThrow(
        "Failed to save character data"
      );
    });
  });
});

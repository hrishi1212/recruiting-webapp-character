import { useState, useEffect } from "react";
import { fetchCharacterData, saveCharacterData } from "./api";

const useCharacterAPI = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result = await fetchCharacterData();
      setData(result);
    } catch (error) {
      setError("Error fetching character data.");
    } finally {
      setIsLoading(false);
    }
  };

  const saveData = async (characterData: any) => {
    setIsLoading(true);
    try {
      await saveCharacterData(characterData);
      // Optionally, to fetch the updated data after saving
      fetchData();
    } catch (error) {
      setError("Error saving character data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data when the component mounts
  }, []);

  return { data, isLoading, error, saveData };
};

export default useCharacterAPI;

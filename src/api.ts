// api.ts
const API_URL = `https://recruiting.verylongdomaintotestwith.ca/api/{hrishi1212}/character`;

export const fetchCharacterData = async () => {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Failed to fetch character data");
    }
  } catch (error) {
    console.error("Error fetching character data:", error);
    throw error;
  }
};

export const saveCharacterData = async (characterData: any) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(characterData),
    });

    if (!response.ok) {
      throw new Error("Failed to save character data");
    }

    return await response.json(); //return something useful here if needed
  } catch (error) {
    console.error("Error saving character data:", error);
    throw error;
  }
};

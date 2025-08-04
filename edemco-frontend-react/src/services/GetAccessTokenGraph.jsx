import fetchWithToken from "../utils/fetchWithToken";

/*


*/

const GetAccessTokenGraph = async () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  try {
    const response = await fetchWithToken(`/api/accessTokenGraph`);
    if (!response.success) {
      throw new Error("Network response was not ok");
    }
    return { success: true, data: await response.data };
  } catch (error) {
    console.error("Error sending data to growatt", error);
    return { success: false, error: error.message };
  }
};

export default GetAccessTokenGraph;

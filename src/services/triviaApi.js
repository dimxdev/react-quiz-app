import axios from "axios";

const triviaApi = axios.create({
  baseURL: "https://opentdb.com",
});

export const fetchQuestions = async () => {
  try {
    const response = await triviaApi.get("/api.php?amount=10&type=multiple");

    return response.data.results;
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    // eslint-disable-next-line preserve-caught-error
    throw new Error("Failed to fetch questions");
  }
};

import axios from "axios";

const triviaApi = axios.create({
  baseURL: "https://opentdb.com",
});

export const fetchQuestions = async () => {
  const response = await triviaApi.get(
    "/api.php?amount=10&type=multiple"
  );

  return response.data.results;
};
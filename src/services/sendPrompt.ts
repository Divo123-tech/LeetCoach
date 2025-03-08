import axios from "axios";
const API_KEY = "AIzaSyBU-RUJlqW0JWp_KRz8sy7xid47mpDuVJw"; // Replace with your actual API key
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
const sendPrompt = async (input: string) => {
  try {
    const response = await axios.post(
      API_URL,
      {
        contents: [
          {
            parts: [{ text: input }],
          },
        ],
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    console.log(response.data.candidates[0].content.parts[0].text);
    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error:", error);
  }
};

export default sendPrompt;

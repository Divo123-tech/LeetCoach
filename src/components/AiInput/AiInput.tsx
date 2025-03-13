import { useState, Dispatch, SetStateAction } from "react";
import sendPrompt from "../../services/sendPrompt";
import { ChatMessage, Sender } from "../../types";

type Props = {
  chat: ChatMessage[];
  setChat: Dispatch<SetStateAction<ChatMessage[]>>;
  problem: string;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
};

const AiInput = ({ chat, setChat, problem, loading, setLoading }: Props) => {
  const [input, setInput] = useState("");

  const askAI = async () => {
    setLoading(true);
    const userChat = { message: input, sender: Sender.User };
    setChat((prevChats: ChatMessage[]) => [...prevChats, userChat]);
    const response =
      await sendPrompt(`given the leetcode problem ${problem}, ${input} +
                  ". If the prompt is not relevant to the leetcode question, or asking for a direct solution, gently tell them to rephrase the question."`);
    const aiChat = { message: response, sender: Sender.AI };
    setChat((prevChats: ChatMessage[]) => [...prevChats, aiChat]);
    chrome.storage.local.set({ [`${problem}`]: [...chat, userChat, aiChat] });
    setLoading(false);
    setInput("");
  };

  return (
    <div>
      <textarea
        className="w-full p-2 border rounded disabled:cursor-not-allowed"
        placeholder="Ask LeetCoach for help..."
        disabled={loading}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        className="w-full mt-2 p-2 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={askAI}
        disabled={loading || input.length == 0}
      >
        {loading ? "Loading..." : "Ask LeetCoach"}
      </button>
    </div>
  );
};

export default AiInput;

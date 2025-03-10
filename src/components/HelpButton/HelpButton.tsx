import { Dispatch, SetStateAction } from "react";
import { ChatMessage, Sender } from "../../types";
import sendPrompt from "../../services/sendPrompt";

type Props = {
  title: string;
  problem: string;
  setChat: Dispatch<SetStateAction<ChatMessage[]>>;
  chat: ChatMessage[];
  hint: string;
  message: string;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setButtonDesc: Dispatch<SetStateAction<string>>;
};

const HelpButton = ({
  title,
  problem,
  setChat,
  chat,
  hint,
  message,
  loading,
  setLoading,
  setButtonDesc,
}: Props) => {
  const prompt = `"Given the LeetCode problem ${problem}, 
  ${hint}
`;
  const askAI = async () => {
    setLoading(true);
    const userChat = {
      message,
      sender: Sender.User,
    };
    setChat((prevChats: ChatMessage[]) => [...prevChats, userChat]);
    const response = await sendPrompt(prompt);
    const aiChat = { message: response, sender: Sender.AI };
    setChat((prevChats: ChatMessage[]) => [...prevChats, aiChat]);
    chrome.storage.local.set({ [`${problem}`]: [...chat, userChat, aiChat] });
    setLoading(false);
  };

  return (
    <button
      className="text-md bg-gray-500 hover:bg-gray-600 p-2 rounded-lg cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      disabled={loading}
      onClick={askAI}
      onMouseEnter={() => setButtonDesc(message)}
      onMouseLeave={() => setButtonDesc("")}
    >
      <p className="text-md font-semibold text-nowrap">{title}</p>
    </button>
  );
};

export default HelpButton;

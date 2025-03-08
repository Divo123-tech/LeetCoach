import { ChatMessage, Sender } from "../../types";

type Props = {
  chat: ChatMessage[];
  loading: boolean;
};
const Chat = ({ chat, loading }: Props) => {
  return (
    <div className="space-y-4 p-4 max-h-[250px] overflow-y-auto">
      {chat.map((chatMessage: ChatMessage, index) => (
        <div
          key={index}
          className={`flex ${
            chatMessage.sender === Sender.User ? "justify-end" : ""
          }`}
        >
          {chatMessage.sender === Sender.AI ? (
            // AI Message (Full width, no bubble)
            <div className="w-full text-left text-white">
              <p dangerouslySetInnerHTML={{ __html: chatMessage.message }}></p>
            </div>
          ) : (
            // User Message (Bubble, right-aligned)
            <div className="bg-gray-700 text-left text-white p-3 rounded-lg max-w-xs">
              <p>{chatMessage.message}</p>
            </div>
          )}
        </div>
      ))}
      {loading && <p>loading...</p>}
    </div>
  );
};

export default Chat;

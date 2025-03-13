import { ChatMessage, Sender } from "../../types";
import Logo from "../../assets/Logo.png";
type Props = {
  chat: ChatMessage[];
  loading: boolean;
};
const Chat = ({ chat, loading }: Props) => {
  return (
    <div className="space-y-4  max-h-[250px] overflow-y-auto">
      {chat.map((chatMessage: ChatMessage, index) => (
        <div
          key={index}
          className={`flex ${
            chatMessage.sender === Sender.User ? "justify-end" : ""
          }`}
        >
          {chatMessage.sender === Sender.AI ? (
            // AI Message (Full width, no bubble)
            <div className="flex gap-2">
              <img src={Logo} className="w-8 h-8 rounded-full"></img>
              <div className="w-full text-left text-white px-2">
                <p
                  dangerouslySetInnerHTML={{ __html: chatMessage.message }}
                ></p>
              </div>
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

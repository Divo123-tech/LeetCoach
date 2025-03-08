export enum Sender {
  User = "user",
  AI = "ai",
}

export type ChatMessage = {
  message: string;
  sender: Sender;
};

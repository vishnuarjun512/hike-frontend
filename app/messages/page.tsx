import { MessageForm } from "./(MessageComponent)/MessageForm";
import { MessageList } from "./(MessageComponent)/MessageList";

export default function MessagesPage() {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-bold mb-4">Messages</h2>
      <div className="flex-1 overflow-hidden flex">
        <div className="w-1/3 border-r pr-4 overflow-auto">
          <MessageList />
        </div>
        <div className="flex-1 pl-4 flex flex-col">
          <div className="flex-1 overflow-auto">
            {/* Selected conversation messages will go here */}
          </div>
          <MessageForm />
        </div>
      </div>
    </div>
  );
}

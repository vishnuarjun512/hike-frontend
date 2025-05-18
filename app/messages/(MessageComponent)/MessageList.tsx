import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const conversations = [
  { id: 1, name: "Alice Johnson", lastMessage: "Hey, how are you?" },
  { id: 2, name: "Bob Williams", lastMessage: "Can we meet tomorrow?" },
  { id: 3, name: "Charlie Brown", lastMessage: "Thanks for your help!" },
];

export function MessageList() {
  return (
    <ul className="space-y-4">
      {conversations.map((conversation) => (
        <li
          key={conversation.id}
          className="flex items-center space-x-4 cursor-pointer hover:bg-accent rounded-lg p-2"
        >
          <Avatar>
            <AvatarImage
              src={`/avatars/0${conversation.id}.png`}
              alt={conversation.name}
            />
            <AvatarFallback>{conversation.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{conversation.name}</p>
            <p className="text-sm text-muted-foreground truncate">
              {conversation.lastMessage}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

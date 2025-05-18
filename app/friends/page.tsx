import { FriendList } from "./(FriendsComponents)/FriendList";
import { FriendRequests } from "./(FriendsComponents)/FriendRequest";
import { RecommendedList } from "./(FriendsComponents)/RecommendFriends";

export default function FriendsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Friends</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <FriendList />
        <FriendRequests />
        <RecommendedList />
      </div>
    </div>
  );
}

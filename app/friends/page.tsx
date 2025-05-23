"use client";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { UserPlus, Check, X, UserMinus } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUserStore } from "@/states/user.state";
// Types
interface User {
  _id: string;
  name: string;
  profilePic: string;
}

interface FriendRequest {
  _id: string;
  senderId: User;
  receiverId: User;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}
export default function FriendsPage() {
  const [friends, setFriends] = useState<User[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);

  const [recommendedFriends, setRecommendedFriends] = useState<User[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [loadingRecommended, setLoadingRecommended] = useState(true);
  const { toast } = useToast();
  const { user } = useUserStore();

  // Fetch all data on component mount
  const fetchAllFriends = async (userId: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const res = await axios.get(`${baseUrl}/friend/${userId}`);

      setFriends(res.data.friends);
      setFriendRequests(
        res.data.friendRequests.filter(
          (req: any) => req.receiverId._id === userId
        )
      );
      setRecommendedFriends(res.data.recommendedFriends);
    } catch (error) {
      console.error("Error fetching friends data:", error);
      toast({
        title: "Error",
        description: "Failed to load friends data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingFriends(false);
      setLoadingRequests(false);
      setLoadingRecommended(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchAllFriends(user._id);
    }
  }, [user]);

  // Send a friend request
  const sendFriendRequest = async (recipientId: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

      // Assume you have access to the current user ID from context, state, or cookie
      const senderId = user?._id; // Replace with how you're getting the current user ID

      await axios.post(baseUrl + "/friend/sendFR", {
        senderId,
        receiverId: recipientId,
      });

      setRecommendedFriends((prev) =>
        prev.filter((user) => user._id !== recipientId)
      );

      toast({
        title: "Success",
        description: "Friend request sent successfully!",
      });
      if (user?._id) {
        fetchAllFriends(user?._id);
      }
    } catch (error: any) {
      console.error("Error sending friend request:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to send friend request.",
        variant: "destructive",
      });
    }
  };

  // Accept a friend request
  const acceptFriendRequest = async (requestId: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

      // Use correct method and URL
      await axios.get(`${baseUrl}/friend/accept/${requestId}`);

      // Remove from requests list
      setFriendRequests((prev) =>
        prev.filter((request) => request._id !== requestId)
      );

      // Refresh friends list
      if (user?._id) {
        fetchAllFriends(user._id);
      }

      toast({
        title: "Success",
        description: "Friend request accepted!",
      });
    } catch (error) {
      console.error("Error accepting friend request:", error);
      toast({
        title: "Error",
        description: "Failed to accept friend request.",
        variant: "destructive",
      });
    }
  };

  // Reject a friend request
  const rejectFriendRequest = async (requestId: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      await axios.put(`${baseUrl}/friend/reject/${requestId}`);

      // Remove from requests list
      setFriendRequests((prev) =>
        prev.filter((request) => request._id !== requestId)
      );

      toast({
        title: "Success",
        description: "Friend request rejected.",
      });
      if (user?._id) {
        fetchAllFriends(user?._id);
      }
    } catch (error) {
      console.error("Error rejecting friend request:", error);
      toast({
        title: "Error",
        description: "Failed to reject friend request.",
        variant: "destructive",
      });
    }
  };

  // Remove a friend
  const removeFriend = async (friendId: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const userId = user?._id;

      await axios.delete(`${baseUrl}/friend/remove/${userId}/${friendId}`);

      setFriends((prev) => prev.filter((friend) => friend._id !== friendId));

      toast({
        title: "Success",
        description: "Friend removed successfully.",
      });
      if (user?._id) {
        fetchAllFriends(user?._id);
      }
    } catch (error) {
      console.error("Error removing friend:", error);
      toast({
        title: "Error",
        description: "Failed to remove friend.",
        variant: "destructive",
      });
    }
  };

  // Render loading skeletons for friends
  const renderFriendSkeletons = () => {
    return Array(4)
      .fill(0)
      .map((_, index) => (
        <div
          key={`friend-skeleton-${index}`}
          className="flex items-center space-x-4"
        >
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        </div>
      ));
  };

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 text-white">Friends</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Your Friends */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Your Friends</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingFriends ? (
              <div className="space-y-4">
                <p className="text-gray-400">Loading friends...</p>
                {renderFriendSkeletons()}
              </div>
            ) : friends.length === 0 ? (
              <p className="text-gray-400">You don't have any friends yet.</p>
            ) : (
              friends.map((friend) => (
                <div
                  key={`${friend._id}-${friend.name}`}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage
                        src={friend.profilePic || "/placeholder.svg"}
                      />
                      <AvatarFallback>
                        {(friend?.name?.charAt(0) || "U").toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-white">{friend.name}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFriend(friend._id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <UserMinus className="h-4 w-4 mr-1" />
                    <span>Remove</span>
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Friend Requests */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Friend Requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingRequests ? (
              <div className="space-y-4">
                <p className="text-gray-400">Loading...</p>
                {renderFriendSkeletons().slice(0, 2)}
              </div>
            ) : friendRequests.length === 0 ? (
              <p className="text-gray-400">No pending friend requests.</p>
            ) : (
              friendRequests.map((request) => {
                return (
                  <div
                    key={request._id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage
                          src={
                            request.receiverId.profilePic || "/placeholder.svg"
                          }
                        />
                        <AvatarFallback>
                          {(
                            request?.receiverId?.name?.charAt(0) || "U"
                          ).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-white">
                          {request.receiverId.name}
                        </p>
                        <p className="text-sm text-gray-400">
                          Wants to be your friend
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => acceptFriendRequest(request._id)}
                        className="bg-green-600 hover:bg-green-700 text-white border-0"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        <span>Accept</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => rejectFriendRequest(request._id)}
                        className="bg-red-600 hover:bg-red-700 text-white border-0"
                      >
                        <X className="h-4 w-4 mr-1" />
                        <span>Reject</span>
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recommended Friends */}
      <Card className="mt-6 bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Recommended Friends</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingRecommended ? (
            <div className="space-y-4">
              <p className="text-gray-400">Loading recommendations...</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {renderFriendSkeletons()}
              </div>
            </div>
          ) : recommendedFriends.length === 0 ? (
            <p className="text-gray-400">
              No recommendations available at this time.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedFriends.map((user) => (
                <Card key={user._id} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage
                            src={user.profilePic || "/placeholder.svg"}
                          />
                          <AvatarFallback>
                            {user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-white">{user.name}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => sendFriendRequest(user._id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white border-0"
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        <span>Add</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useUserStore } from "@/states/user.state";
import { SkeletonComponent } from "@/components/skeletonComponent";

// Define Friend Type
interface Friend {
  id: string;
  name: string;
  profilePic?: string; // Optional in case it doesn't exist
}

export function RecommendedList() {
  const { toast } = useToast();
  const { user } = useUserStore();

  const [recommended, setRecommended] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const addFriend = async (id: string) => {
    if (!user || !user.id) {
      toast({
        variant: "destructive",
        title: "Friend Request Failed",
        description: "User data is not loaded. Please refresh and try again.",
      });
      return;
    }

    try {
      const url = process.env.NEXT_PUBLIC_BASE_URL;
      const res = await axios.post(`${url}/friend/send`, {
        senderId: user.id,
        receiverId: id,
      });

      if (res.data.success) {
        toast({
          title: "Friend Request Sent",
          description: `Wait for ${res.data.receiverName} to accept your request.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Friend Request Failed",
          description: res.data.message,
        });
      }
    } catch (error: any) {
      let errorMessage = "Something went wrong!";

      if (error.response) {
        errorMessage = error.response.data?.message || "Server error occurred!";
      } else if (error.request) {
        errorMessage =
          "No response from the server. Please check your network!";
      } else {
        errorMessage = error.message || "Unexpected error occurred!";
      }

      toast({
        variant: "destructive",
        title: "Friend Request Failed",
        description: errorMessage,
      });
    }
  };

  useEffect(() => {
    const fetchRecommended = async () => {
      if (!user?.id) return;

      setLoading(true);
      setError(null);

      try {
        const url = process.env.NEXT_PUBLIC_BASE_URL;
        const res = await axios.get(`${url}/friend/recommendations/${user.id}`);

        if (res.data.error) {
          throw new Error(res.data.message);
        }

        setRecommended(res.data.recommended || []);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommended();
  }, [user?.id]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended Friends</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <>
            <p className="text-gray-500">Loading recommendations...</p>
            <SkeletonComponent times={3} />
          </>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : recommended.length === 0 ? (
          <p className="text-gray-500">No recommendations available.</p>
        ) : (
          <ul className="space-y-4">
            {recommended.map((friend) => (
              <li key={friend.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage
                      src={`${friend.profilePic}` || ""}
                      alt={friend.name}
                    />
                    <AvatarFallback>
                      {friend.name?.charAt(0).toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <span>{friend.name}</span>
                </div>
                <Button
                  onClick={() => addFriend(friend.id)}
                  variant="outline"
                  size="sm"
                >
                  Add Friend
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

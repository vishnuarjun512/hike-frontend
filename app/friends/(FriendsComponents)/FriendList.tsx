"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/states/user.state";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

import { SkeletonComponent } from "@/components/skeletonComponent";

type FriendType = {
  name: string;
  id: string;
  profilePic: string | null;
  email: string;
};

export function FriendList() {
  const [friends, setFriends] = useState<FriendType[] | null>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useUserStore();
  useEffect(() => {
    const fetchFriends = async () => {
      if (!user?.id) return;

      setLoading(true);

      try {
        const url = process.env.NEXT_PUBLIC_BASE_URL;
        const res = await axios.get(`${url}/friend/friends/${user?.id}`);

        if (res.data.error) {
          toast({
            variant: "destructive",
            title: "Friend Request Failed",
            description: res.data.message,
          });
          throw new Error("Failed to fetch friends");
        }

        setFriends(res.data.friends);
      } catch (error) {
        console.error("Error fetching friends:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  const removeFriend = async (id: string) => {
    if (!user?.id) return;

    setLoading(true);

    try {
      const url = process.env.NEXT_PUBLIC_BASE_URL;
      const res = await axios.post(`${url}/friend/unfriend/${user?.id}`, {
        unfriendId: id,
      });

      if (res.data.error) {
        toast({
          variant: "destructive",
          title: "Unfriend Failed",
          description: res.data.message,
        });
        throw new Error("Failed to Unfriend");
      }

      setFriends(res.data.friends);
    } catch (error) {
      console.error("Error Unfriending:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Friends</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <>
            <p>Loading friends...</p>
            <SkeletonComponent times={3} />
          </>
        ) : !friends || friends.length === 0 ? (
          <p>No friends found.</p>
        ) : (
          <ul className="space-y-4">
            {friends.map((friend) => (
              <li key={friend.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage
                      src={friend.profilePic || ""}
                      alt={friend.name}
                    />
                    <AvatarFallback>{friend.name[0]}</AvatarFallback>
                  </Avatar>
                  <span>{friend.name}</span>
                </div>
                <Button
                  onClick={() => {
                    removeFriend(friend.id);
                  }}
                  variant="outline"
                  size="sm"
                >
                  Unfriend
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

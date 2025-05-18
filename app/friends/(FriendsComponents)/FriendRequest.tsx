"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useUserStore } from "@/states/user.state";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { SkeletonComponent } from "@/components/skeletonComponent";

type FriendRequestType = {
  requestId: string;
  userId: string;
  name: string;
  profileImage: string;
};

export function FriendRequests() {
  const [requests, setRequests] = useState<FriendRequestType[]>([]);

  const { user } = useUserStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      if (!user?.id) return;

      setLoading(true);
      setError(null);

      try {
        const url = process.env.NEXT_PUBLIC_BASE_URL;
        const response = await axios.post(`${url}/friend/friendRequests`, {
          userId: user.id,
          status: "pending",
        }); // Adjust the API URL as needed
        setRequests(response.data.requests);
      } catch (err) {
        setError("Failed to fetch friend requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchFriendRequests();
  }, [user?.id]);

  const acceptFriendRequest = async (id: string) => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const url = process.env.NEXT_PUBLIC_BASE_URL;
      const res = await axios.get(`${url}/friend/accept/${id}`);

      console.log(res.data);

      if (res.data.success) {
        toast({
          title: "Friend Request Accepted",
          description: (
            <div className=" w-full flex flex-row items-center justify-between gap-3">
              <p>Congrats! You're friends with {res.data.newFriend.name}!</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  router.push(`/messages/${res.data.newFriend.id}`);
                }}
              >
                Message {res.data.receiverName}
              </Button>
            </div>
          ),
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
        title: "Friend Acceptation Failed",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const declineFriendRequest = async (id: string) => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const url = process.env.NEXT_PUBLIC_BASE_URL;
      const res = await axios.delete(`${url}/friend/decline/${id}`);

      if (res.data.success) {
        toast({
          title: "Friend Request Declined",
          description: `You have declined the friend request.`,
        });

        // Remove the declined request from the list
        setRequests((prevRequests) =>
          prevRequests.filter((request) => request.requestId !== id)
        );
      } else {
        toast({
          variant: "destructive",
          title: "Decline Failed",
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
        title: "Decline Failed",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Friend Requests</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <>
            <p>Loading...</p>
            <SkeletonComponent times={2} />
          </>
        ) : error ? (
          <p className="text-gray-500">{error}</p>
        ) : !requests || requests.length === 0 ? ( // Ensure requests is defined
          <p>No friend requests available.</p>
        ) : (
          <ul className="space-y-4">
            {requests.map((request) => (
              <li
                key={request.requestId}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage
                      src={request.profileImage || `/avatars/default.png`} // Use fallback image if missing
                      alt={request.name}
                    />
                    <AvatarFallback>{request.name?.[0] || "?"}</AvatarFallback>
                  </Avatar>
                  <span>{request.name}</span>
                </div>
                <div className="space-x-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      acceptFriendRequest(request.requestId);
                    }}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => declineFriendRequest(request.requestId)}
                  >
                    Decline
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PostForm from "./(DashboardComponents)/post-form";
import axios from "axios";
import { useEffect, useState } from "react";
import { PostList } from "./(DashboardComponents)/post-list";
import { useUserStore } from "@/states/user.state";

interface Comment {
  author: string;
  content: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  userId: {
    _id: string;
    name: string;
    profilePic: string;
  };
  createdAt?: string;
  images?: string[];
  likes?: number;
  comments?: Comment[];
}

export default function DashboardPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const { user } = useUserStore();
  const [activeTab, setActiveTab] = useState("feed"); // or "create"

  const fetchPosts = async () => {
    setIsLoading(true);
    if (user === null) {
      return;
    }
    try {
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
      const response = await axios.get(`${baseURL}/post/${user._id}`);
      // Ensure we're setting an array of posts
      setPosts(
        Array.isArray(response.data)
          ? response.data
          : response.data?.posts || response.data?.data || []
      );
      setError(null);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load posts. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      return;
    }
    fetchPosts();
  }, [user]);

  const handlePostCreated = () => {
    fetchPosts(); // Refresh posts after creating a new one
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

      // Delete the post from the server
      await axios.delete(`${baseURL}/post/${postId}`);

      setPosts(posts.filter((post) => post._id !== postId));
    } catch (err) {
      console.error("Error deleting post:", err);
      setError("Failed to delete post. Please try again later.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="container mx-auto py-6 max-w-5xl">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          defaultValue="feed"
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="feed">Your Feed</TabsTrigger>
              <TabsTrigger value="create">Create Post</TabsTrigger>
              <TabsTrigger value="myposts">My Posts</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="create" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Create a New Post</CardTitle>
                <CardDescription>
                  Share your thoughts, images, and more with your network
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PostForm onPostCreated={handlePostCreated} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feed" className="space-y-6">
            <PostList
              posts={posts}
              isLoading={isLoading}
              error={error}
              onDeletePost={handleDeletePost}
              onCreateClick={() => setActiveTab("create")}
            />
          </TabsContent>
          <TabsContent value="myposts" className="space-y-6">
            <PostList
              posts={posts.filter((post) => post.userId._id === user?._id)}
              isLoading={isLoading}
              error={error}
              onDeletePost={handleDeletePost}
              onCreateClick={() => setActiveTab("create")}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

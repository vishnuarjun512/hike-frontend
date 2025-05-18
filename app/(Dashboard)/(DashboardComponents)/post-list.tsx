"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageSquare, Trash, Share2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Post } from "@/types/postType";

export function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    // Sample Post Data (Mocked)
    setPosts([
      {
        id: "1",
        author: "johns",
        content: "Enjoying Next.js 14! 🚀",
        images: ["/sample1.jpg"],
        likesCount: 5,
        likes: ["dutch"],
        commentsCount: 2,
        comments: ["Awesome!", "🔥"],
      },
    ]);
  }, []);

  // Delete Post
  const handleDeletePost = (id: string) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  // Handle Like
  const handleLike = (id: string) => {
    setPosts(
      posts.map((post) =>
        post.id === id ? { ...post, likesCount: post.likesCount + 1 } : post
      )
    );
  };

  // Add Comment
  const handleAddComment = (id: string, comment: string) => {
    setPosts(
      posts.map((post) =>
        post.id === id
          ? { ...post, comments: [...post.comments, comment] }
          : post
      )
    );
  };

  // Share Post (Copy Link)
  const handleShare = (id: string) => {
    const postUrl = `${window.location.origin}/post/${id}`;
    navigator.clipboard.writeText(postUrl);
    alert("Post link copied!");
  };

  return (
    <div className="space-y-4">
      {/* Posts Feed */}
      <h2 className="text-2xl font-bold">Your Feed</h2>
      <div className="max-w-4xl mx-auto mt-6 space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="relative flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between gap-4 p-2 mx-4 border-b mt-2">
              <div className="flex flex-row items-center justify-center gap-3">
                <Avatar>
                  <AvatarImage src={`/avatars/0${post.id}.png`} />
                  <AvatarFallback>{post.author[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{post.author}</h3>
                </div>
              </div>
              {/* Delete Post */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeletePost(post.id)}
                className="  text-red-500 size-10 bg-gray-600 hover:bg-red-500 hover:text-white"
              >
                <Trash className="w-5 h-5" />
              </Button>
            </CardHeader>

            <CardContent className="mt-2">
              {/* Post Images */}
              {post && post.images && post.images.length > 0 && (
                <div className="flex gap-2 overflow-x-auto">
                  {post.images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt="Uploaded"
                      className="w-40 h-40 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}

              {/* Post Content */}
              <p className="text-gray-800 mt-2">{post.content}</p>

              {/* Actions: Like, Comment, Share */}
              <div className="flex items-center mt-2">
                <Button
                  onClick={() => handleLike(post.id)}
                  variant="ghost"
                  size="sm"
                >
                  <ThumbsUp className="w-4 h-4" />
                  {post.likes}
                </Button>
                <Button
                  onClick={() => {
                    const comment = prompt("Enter your comment:");
                    if (comment) handleAddComment(post.id, comment);
                  }}
                  variant="ghost"
                  size="sm"
                >
                  <MessageSquare className="w-4 h-4 " />
                  {post.comments.length}
                </Button>
                <Button
                  onClick={() => handleShare(post.id)}
                  variant="ghost"
                  size="sm"
                >
                  <Share2 className="w-5 h-5 mr-1" />
                </Button>
              </div>

              {/* Comments Section */}
              {post.comments.length > 0 && (
                <div className="mt-1 border-t pt-2">
                  {post.comments.map((comment, index) => (
                    <p key={index} className="text-gray-600 text-sm">
                      {comment}
                    </p>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

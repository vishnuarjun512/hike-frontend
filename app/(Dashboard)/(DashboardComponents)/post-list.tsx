"use client";

import { useEffect, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Heart,
  MessageSquare,
  Share2,
  Trash2,
  MoreHorizontal,
  ThumbsUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { Post } from "../page";

interface PostListProps {
  posts?: Post[];
  isLoading: boolean;
  error?: string | null;
  onDeletePost?: (postId: string) => Promise<void>;
  onCreateClick?: () => void;
}

export function PostList({
  posts = [],
  isLoading,
  error,
  onDeletePost,
  onCreateClick,
}: PostListProps) {
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  const handleLike = (postId: string) => {
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const confirmDelete = (postId: string) => {
    setDeletingPostId(postId);
    setShowDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (deletingPostId && onDeletePost) {
      await onDeletePost(deletingPostId);
    }
    setShowDeleteDialog(false);
    setDeletingPostId(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-3 w-[100px]" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-[200px] w-full rounded-md mt-4" />
            </CardContent>
            <CardFooter>
              <div className="flex space-x-4">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 text-center">
        <div className="text-red-500 mb-2">Error loading posts</div>
        <p>{error}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </Card>
    );
  }

  if (posts.length === 0) {
    return (
      <Card className="p-8 text-center">
        <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
        <p className="text-muted-foreground mb-4">
          Create your first post to get started!
        </p>
        <Button variant="outline" onClick={onCreateClick}>
          Create a Post
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card key={`${post?._id!}`} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage
                    src={post?.userId?.profilePic || "/placeholder.svg"}
                  />
                  <AvatarFallback>
                    {post?.userId?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">
                    {post?.userId?.name || "User"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {post.createdAt
                      ? formatDistanceToNow(new Date(post.createdAt), {
                          addSuffix: true,
                        })
                      : "Just now"}
                  </p>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => confirmDelete(post._id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardContent className="pb-2">
            {post.title && (
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            )}
            {post.content && <p className="mb-4">{post.content}</p>}

            {post.images && post.images.length > 0 && (
              <Carousel className="w-full">
                <CarouselContent>
                  {post.images.map((image, index) => (
                    <CarouselItem key={`image-${index}`} className="w-full">
                      <div className="overflow-hidden rounded-md size-4:3 aspect-[4/3]">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Post image ${index + 1}`}
                          className="w-full object-cover h-full"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {post.images.length > 1 && (
                  <>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
                  </>
                )}
              </Carousel>
            )}
          </CardContent>

          <CardFooter className="pt-4 pb-4 flex justify-between">
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center gap-1 ${
                  likedPosts[post._id] ? "text-primary" : ""
                }`}
                onClick={() => handleLike(post._id)}
              >
                {likedPosts[post._id] ? (
                  <ThumbsUp className="h-4 w-4 fill-current" />
                ) : (
                  <Heart className="h-4 w-4" />
                )}
                <span>
                  {post.likes || 0} {likedPosts[post._id] ? "+1" : ""}
                </span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
              >
                <MessageSquare className="h-4 w-4" />
                <span>{post.comments?.length || 0}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </Button>
            </div>
          </CardFooter>

          {post.comments && post.comments.length > 0 && (
            <div className="px-6 pb-4 space-y-2">
              <div className="text-sm font-medium">Comments</div>
              {post.comments.slice(0, 2).map((comment, index) => (
                <div key={index} className="flex items-start space-x-2 text-sm">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>
                      {comment.author?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted p-2 rounded-md flex-1">
                    <span className="font-medium">
                      {comment.author || "User"}:{" "}
                    </span>
                    {comment.content}
                  </div>
                </div>
              ))}
              {post.comments.length > 2 && (
                <Button variant="link" size="sm" className="px-0">
                  View all {post.comments.length} comments
                </Button>
              )}
            </div>
          )}
        </Card>
      ))}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

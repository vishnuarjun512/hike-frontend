"use client";
import PostForm from "./(DashboardComponents)/post-form";
import { PostList } from "./(DashboardComponents)/post-list";

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <PostForm />
      <PostList />
    </div>
  );
}

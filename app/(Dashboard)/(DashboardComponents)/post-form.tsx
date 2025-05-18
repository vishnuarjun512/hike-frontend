"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUserStore } from "@/states/user.state";
import { Post } from "@/types/postType";

export default function PostForm() {
  const [content, setContent] = useState("");

  const { user } = useUserStore();

  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  // Handle Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImages([...images, ...files]);
      setPreviews([
        ...previews,
        ...files.map((file) => URL.createObjectURL(file)),
      ]);
    }
  };

  // Create Post
  const handleCreatePost = () => {
    if (!content.trim() && images.length === 0) return;
    const newPost = {
      author: user?.name,
      content,
      images: previews,
      comments: [],
    };

    setContent("");
    setImages([]);
    setPreviews([]);
  };

  return (
    <div className="">
      {/* Create Post Section */}
      <div className="   shadow rounded-lg border-b py-2 my-4">
        <h2 className="text-lg font-semibold mb-3">Create a Post</h2>
        <Textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full mb-3"
        />
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="mb-3"
        />

        {/* Image Previews */}
        <div className="flex flex-wrap gap-2 mb-3">
          {previews.map((preview, index) => (
            <div key={index} className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-lg"
              />
              <button
                onClick={() => {
                  setImages(images.filter((_, i) => i !== index));
                  setPreviews(previews.filter((_, i) => i !== index));
                }}
                className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="w-full space-x-3 flex justify-end">
          <Button onClick={handleCreatePost} type="submit">
            Post
          </Button>

          <Button variant={"destructive"} type="reset">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

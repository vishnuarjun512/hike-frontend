"use client";
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUserStore } from "@/states/user.state";

interface PostFormProps {
  onPostCreated?: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ onPostCreated }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{ url: string; name: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useUserStore();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) {
      setImages((prevImages) => [...prevImages, ...files]);

      // Create preview URLs
      const newPreviews = files.map((file) => ({
        url: URL.createObjectURL(file),
        name: file.name,
      }));

      setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(previews[index].url);

    setImages(images.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleCreatePost = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    const userId = user?._id;
    if (!userId) return;

    try {
      // Step 1: Create the post WITHOUT images first
      const createPostRes = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/post`,
        {
          userId,
          title,
          content,
          images: [], // no images yet
        }
      );

      if (createPostRes.status !== 200) {
        toast({
          title: "Failed to create post",
          variant: "destructive",
        });
        throw new Error("Failed to create post");
      }

      const postId = createPostRes.data.post._id; // mongoose-generated post id

      // Step 2: Upload images if any
      let uploadedImageUrls: string[] = [];
      if (images.length > 0) {
        uploadedImageUrls = await Promise.all(
          images.map(async (image, index) => {
            // Get pre-signed URL for each image
            // Inside Promise.all for image uploads
            const { data } = await axios.post(
              `${process.env.NEXT_PUBLIC_BASE_URL}/post/getURL`, // <-- this is "/post/getUploadUrl" not "/post/getURL"
              {
                userId,
                postId,
                filename: `hike/${userId}/posts/${postId}/img-${index + 1}`,
                filetype: image.type,
              }
            );

            // Upload to S3
            await axios.put(data.imageUrl, image, {
              headers: { "Content-Type": image.type },
            });

            // return the final URL to be stored in the post
            return data.imageUrl;
          })
        );

        // Step 3: Update the post with uploaded image URLs
        await axios.patch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/post/${postId}`,
          {
            images: uploadedImageUrls,
          }
        );
      }

      toast({ title: "Post created successfully!" });
    } catch (error) {
      console.error("Error creating post:", error);
      toast({ title: "Failed to create post", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleCreatePost} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Add a title for your post"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Description (Optional)</Label>
        <Textarea
          id="content"
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[120px]"
        />
      </div>

      {previews.length > 0 && (
        <div className="space-y-2">
          <Label>Selected Images</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <Card className="overflow-hidden border border-border h-24">
                  <CardContent className="p-0 h-full">
                    <img
                      src={preview.url || "/placeholder.svg"}
                      alt={`Preview ${index}`}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute top-1 right-1 h-6 w-6 opacity-80 hover:opacity-100"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Label
          htmlFor="image-upload"
          className="cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-muted transition-colors"
        >
          <ImagePlus className="h-4 w-4" />
          <span>Add Images</span>
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="hidden"
          />
        </Label>
        <span className="text-sm text-muted-foreground">
          {images.length} {images.length === 1 ? "file" : "files"} selected
        </span>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setTitle("");
            setContent("");
            setImages([]);
            setPreviews([]);
          }}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Posting...
            </>
          ) : (
            "Post"
          )}
        </Button>
      </div>
    </form>
  );
};

export default PostForm;

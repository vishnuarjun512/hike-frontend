import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useUserStore } from "@/states/user.state";
import axios from "axios";
import { useEffect, useState } from "react";
import { set } from "react-hook-form";

interface ProfileChangerDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  setProfilePic: (url: string) => void;
}

const ProfileChangerDialog = ({
  isOpen,
  setIsOpen,
  setProfilePic,
}: ProfileChangerDialogProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [img, setImg] = useState<File | null>(null);
  const { user, setUser } = useUserStore();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (user?._id) {
      setUserId(user._id);
    }
  }, [user]);

  const handleUpload = async () => {
    if (!img || !user) return;

    setIsUploading(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      console.log("User ID:", userId);
      const {
        data: { profilePicUrl },
      } = await axios.post(`${baseUrl}/user/getUploadUrl`, {
        userId,
        filename: img.name,
        filetype: img.type,
      });

      try {
        await axios.put(profilePicUrl, img, {
          headers: {
            "Content-Type": img.type,
          },
        });
      } catch (error) {
        console.error("Error uploading file:", error);
        return;
      }

      // Update the user's profile picture in the database
      const confirmProfilePicRes = await axios.post(
        `${baseUrl}/user/updateProfilePic`,
        {
          userId,
          profilePicUrl,
        }
      );
      console.log(confirmProfilePicRes.data);
      if (confirmProfilePicRes.status !== 200) {
        toast({
          title: "Error",
          description: "Failed to update profile picture.",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Profile picture updated successfully",
        description: "Your profile picture has been updated.",
      });
      setProfilePic(profilePicUrl);
      setUser(confirmProfilePicRes.data.user);
      setIsOpen(false);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Profile Picture</DialogTitle>
        </DialogHeader>

        {img && (
          <img
            src={URL.createObjectURL(img)}
            alt="Preview"
            className="w-32 h-32 rounded-full mx-auto mb-2"
          />
        )}

        <input
          type="file"
          accept="image/*"
          disabled={isUploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setImg(file);
          }}
        />

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={isUploading || !img}>
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileChangerDialog;

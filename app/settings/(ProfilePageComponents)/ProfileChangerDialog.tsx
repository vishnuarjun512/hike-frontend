import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useUserStore } from "@/states/user.state";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const { user } = useUserStore();

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
            className="w-32 h-32 rounded-full"
          />
        )}

        <input type="file" accept="image/*" disabled={isUploading} />

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button disabled={isUploading || !img}>
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileChangerDialog;

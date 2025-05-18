"use client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface EnlargedImageDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  profilePic: string | null;
}

const EnlargedImageDialog = ({
  isOpen,
  setIsOpen,
  profilePic,
}: EnlargedImageDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-fit-content">
        <DialogHeader>
          <DialogTitle>Profile Picture</DialogTitle>
        </DialogHeader>

        {/* Display large image */}
        <div className="flex justify-center">
          {profilePic && (
            <img
              src={profilePic}
              alt="Enlarged Profile Pic"
              className="w-full h-full object-contain"
            />
          )}
        </div>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EnlargedImageDialog;

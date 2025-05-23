"use client";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import ProfileChangerDialog from "./(ProfilePageComponents)/ProfileChangerDialog"; // Import dialog component
import { useUserStore } from "@/states/user.state";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import EnlargedImageDialog from "./(ProfilePageComponents)/EnlargedImageDialog";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [notifications, setNotifications] = useState(true);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false); // State to control large image dialog

  const { user } = useUserStore(); // Fetching user ID

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setProfilePic(user.profilePic || null);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare data for API call
    const updatedData = {
      name,
      email,
    };

    try {
      // Make API call to update the user details
      const url = process.env.NEXT_PUBLIC_BASE_URL;
      const response = await axios.put(`${url}/user/${user?._id}`, {
        updatedData,
      });

      if (!response.data.success) {
        toast({
          variant: "destructive",
          title: "Updated Failed",
          description: response.data.message,
        });
        throw new Error("Failed to update settings");
      }

      toast({
        title: "Settings Updated",
        description: response.data.message,
      });
      console.log("Settings updated:", response.data);

      // Optionally, you can show a success message or handle any other UI updates here
    } catch (error) {
      console.error("Error updating settings:", error);
      // Handle error (maybe show a message to the user)
    }
  };

  // Inside your SettingsPage component:
  const memoizedProfilePic = useMemo(() => {
    return profilePic ? `${profilePic}?t=${new Date().getTime()}` : "";
  }, [profilePic]); // Only recompute the URL when profilePic changes

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      {/* Profile Picture Upload Dialog */}
      <ProfileChangerDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        setProfilePic={setProfilePic}
      />
      {/* Enlarged Profile Picture Dialog */}
      <EnlargedImageDialog
        isOpen={isImageDialogOpen}
        setIsOpen={setIsImageDialogOpen}
        profilePic={profilePic}
      />
      <div className="space-y-4">
        {/* Profile Picture Upload Section */}
        <div className=" flex justify-center items-center flex-col gap-3">
          <Avatar
            onClick={() => setIsImageDialogOpen(true)}
            className=" cursor-pointer font-bold text-black size-[300px] bg-gray-300 flex justify-center items-center"
          >
            <AvatarImage
              alt={user?.name + "'s profile pic"}
              src={memoizedProfilePic || ""}
            />
            <AvatarFallback className="text-4xl">
              {user && user.name && user?.name[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <Button className="w-fit" onClick={() => setIsDialogOpen(true)}>
            Change Profile Picture
          </Button>
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="notifications"
            checked={notifications}
            onCheckedChange={setNotifications}
          />
          <Label htmlFor="notifications">Enable notifications</Label>
        </div>
        <Button onClick={handleSubmit} type="submit">
          Save Changes
        </Button>
      </div>
    </div>
  );
}

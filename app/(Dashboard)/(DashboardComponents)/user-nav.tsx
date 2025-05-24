"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserStore } from "@/states/user.state";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function UserNav() {
  const router = useRouter();
  const { user, clearUser } = useUserStore();

  // Use a local state for profilePic
  const [profilePic, setProfilePic] = useState<string | null>(null);

  // Update the local state when the user profile picture changes
  useEffect(() => {
    if (user?.profilePic) {
      setProfilePic(user.profilePic);
    }
  }, [user?.profilePic]); // This will re-run when user.profilePic changes

  const logout = async () => {
    if (!user) {
      return;
    }
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      await axios.post(`${baseUrl}/auth/logout`, { userId: user?._id });
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              alt={user?.name + "'s profile pic"}
              src={profilePic ? `${profilePic}?t=${new Date().getTime()}` : ""}
            />
            <AvatarFallback>
              {user && user.name && user?.name[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 dark" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            clearUser();
            logout();
            router.push("/login");
          }}
        >
          <Button className="w-full" variant={"destructive"}>
            Log out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

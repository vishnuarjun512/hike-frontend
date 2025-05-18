import Link from "next/link";
import { Home, Users, MessageSquare, Settings } from "lucide-react";

const navItems = [
  { icon: Home, label: "Feed", href: "/" },
  { icon: Users, label: "Friends", href: "/friends" },
  { icon: MessageSquare, label: "Messages", href: "/messages" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function SidebarNav() {
  return (
    <nav className="w-64 bg-card text-card-foreground p-4 space-y-2">
      <h1 className="text-3xl font-bold text-center border-b p-2">Hike</h1>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent hover:text-accent-foreground"
        >
          <item.icon className="w-5 h-5" />
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}

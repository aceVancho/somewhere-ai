import React, { useEffect } from "react";
import { useAuth } from "../../contexts/authContext";
import ModeToggle from "../../components/ModeToggle";
import DropdownAvatar from "../../components/DropdownAvatar";
import { useLogo } from "../../components/Logo";
import {
  BarChart4,
  Folder,
  Gift,
  Hammer,
  LucideNotebookTabs,
  Plus,
  Store,
  Menu,
  Upload
} from "lucide-react";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Separator } from "../../components/ui/separator";
import { useNavigate } from "react-router-dom";

const MobileEntriesGroup = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      <div className="my-1">
        {/* <Separator /> */}
        <p className="text-sm text-muted-foreground pt-2">Entries</p>
      </div>
      <SheetClose className="hover:bg-secondary hover:text-foreground">
        <div
          className="flex items-center gap-4 m-2 text-sm"
          onClick={() => navigate("all-entries")}
        >
          <Folder className="mr-2 h-4 w-4" />
          All Entries
        </div>
      </SheetClose>
      <SheetClose className="hover:bg-secondary hover:text-foreground">
        <div
          className="flex items-center gap-4 m-2 text-sm"
          onClick={() => navigate("new-entry")}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Entry
        </div>
      </SheetClose>
      <SheetClose className="hover:bg-secondary hover:text-foreground">
      <div className="hover:bg-secondary hover:text-foreground">
        <div
          className="flex items-center gap-4 m-2 text-sm"
          onClick={() => navigate("bulk-upload")}
        >
          <Upload className="mr-2 h-4 w-4" />
          Bulk Upload
        </div>
      </div>
      </SheetClose>
    </div>
  );
};

const MobileAIGroup = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      <Separator className="mt-2" />
      <p className="text-sm text-muted-foreground my-2">AI</p>
      <SheetClose className="hover:bg-secondary hover:text-foreground">
        <div
          className="flex items-center gap-4 m-2 text-sm"
          onClick={() => console.log("CHAT")}
        >
          <ChatBubbleIcon className="mr-2 h-4 w-4" />
          Chat
        </div>
      </SheetClose>
      <SheetClose className="hover:bg-secondary hover:text-foreground">
        <div
          className="flex items-center gap-4 m-2 text-sm"
          onClick={() => console.log("STATS")}
        >
          <BarChart4 className="mr-2 h-4 w-4" />
          Stats
        </div>
      </SheetClose>
      <SheetClose className="hover:bg-secondary hover:text-foreground">
        <div
          className="flex items-center gap-4 m-2 text-sm"
          onClick={() => console.log("TOOLS")}
        >
          <Hammer className="mr-2 h-4 w-4" />
          Tools
        </div>
      </SheetClose>
    </div>
  );
};

const MobileLinksGroup = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      <Separator className="my-1" />
      <p className="text-sm text-muted-foreground mb-2">Links</p>
      <SheetClose className="hover:bg-secondary hover:text-foreground">
        <div
          className="flex items-center gap-4 m-2 text-sm"
          onClick={() => console.log("ABOUT")}
        >
          <Store className="mr-2 h-4 w-4" />
          About
        </div>
      </SheetClose>
      <SheetClose className="hover:bg-secondary hover:text-foreground">
        <div
          className="flex items-center gap-4 m-2 text-sm"
          onClick={() => console.log("CONTACT")}
        >
          <LucideNotebookTabs className="mr-2 h-4 w-4" />
          Contact
        </div>
      </SheetClose>
      <SheetClose className="hover:bg-secondary hover:text-foreground">
        <div
          className="flex items-center gap-4 m-2 text-sm"
          onClick={() => console.log("DONATE")}
        >
          <Gift className="mr-2 h-4 w-4" />
          Donate
        </div>
      </SheetClose>
    </div>
  );
};

const DesktopEntriesGroup = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      <div className="my-1">
        {/* <Separator /> */}
        <p className="text-sm text-muted-foreground pt-2">Entries</p>
      </div>
      <div className="hover:bg-secondary hover:text-foreground">
        <div
          className="flex items-center gap-4 m-2 text-sm"
          onClick={() => navigate("all-entries")}
        >
          <Folder className="mr-2 h-4 w-4" />
          All Entries
        </div>
      </div>
      <div className="hover:bg-secondary hover:text-foreground">
        <div
          className="flex items-center gap-4 m-2 text-sm"
          onClick={() => navigate("new-entry")}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Entry
        </div>
      </div>
      <div className="hover:bg-secondary hover:text-foreground">
        <div
          className="flex items-center gap-4 m-2 text-sm"
          onClick={() => navigate("bulk-upload")}
        >
          <Upload className="mr-2 h-4 w-4" />
          Bulk Upload
        </div>
      </div>
    </div>
  );
};

const DesktopAIGroup = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      <Separator className="mt-2" />
      <p className="text-sm text-muted-foreground my-2">AI</p>
      <div className="hover:bg-secondary hover:text-foreground">
        <div
          className="flex items-center gap-4 m-2 text-sm"
          onClick={() => console.log("CHAT")}
        >
          <ChatBubbleIcon className="mr-2 h-4 w-4" />
          Chat
        </div>
      </div>
      <div className="hover:bg-secondary hover:text-foreground">
        <div
          className="flex items-center gap-4 m-2 text-sm"
          onClick={() => console.log("STATS")}
        >
          <BarChart4 className="mr-2 h-4 w-4" />
          Stats
        </div>
      </div>
      <div className="hover:bg-secondary hover:text-foreground">
        <div
          className="flex items-center gap-4 m-2 text-sm"
          onClick={() => console.log("TOOLS")}
        >
          <Hammer className="mr-2 h-4 w-4" />
          Tools
        </div>
      </div>
    </div>
  );
};

const DesktopLinksGroup = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      <Separator className="my-1" />
      <p className="text-sm text-muted-foreground mb-2">Links</p>
      <div className="hover:bg-secondary hover:text-foreground">
        <div
          className="flex items-center gap-4 m-2 text-sm"
          onClick={() => console.log("ABOUT")}
        >
          <Store className="mr-2 h-4 w-4" />
          About
        </div>
      </div>
      <div className="hover:bg-secondary hover:text-foreground">
        <div
          className="flex items-center gap-4 m-2 text-sm"
          onClick={() => console.log("CONTACT")}
        >
          <LucideNotebookTabs className="mr-2 h-4 w-4" />
          Contact
        </div>
      </div>
      <div className="hover:bg-secondary hover:text-foreground">
        <div
          className="flex items-center gap-4 m-2 text-sm"
          onClick={() => console.log("DONATE")}
        >
          <Gift className="mr-2 h-4 w-4" />
          Donate
        </div>
      </div>
    </div>
  );
};

const MobileNav = () => (
  <header className="sticky top-0 flex h-16 items-center gap-4 bg-background px-4 md:px-6 lg:hidden">
    <Sheet>
      <SheetTrigger asChild>
        <div className="w-full flex justify-between items-center p-4 border-b">
          <button className="btn btn-outline btn-icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </button>
          <img className="w-3/12" src={useLogo()} alt="logo" />
        </div>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col justify-between">
        <nav className="flex flex-col pt-5">
          <MobileEntriesGroup />
          <MobileAIGroup />
          <MobileLinksGroup />
        </nav>
        <div className="flex justify-center items-center space-x-4 sticky bottom-4">
          <ModeToggle />
          <DropdownAvatar />
        </div>
      </SheetContent>
    </Sheet>
  </header>
);

const DesktopNav = () => (
  <div className="hidden lg:flex flex-col h-full justify-between">
    <nav className="flex flex-col">
      <DesktopEntriesGroup />
      <DesktopAIGroup />
      <DesktopLinksGroup />
    </nav>
    <div className="flex justify-center items-center space-x-4 mt-8">
      <ModeToggle />
      <DropdownAvatar />
    </div>
  </div>
);

const NavPanel: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || !user) {
        // navigate('/login');
      }
    }
  }, [isAuthenticated, user, loading]);

  if (loading) {
    return <div>Loading...</div>; // skeletons
  }

  return (
    <div className="w-full lg:w-2/12 flex flex-col p-4 border-r">
      <MobileNav />
      <DesktopNav />
    </div>
  );
};

export default NavPanel;

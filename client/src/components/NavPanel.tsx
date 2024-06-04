import React, { useEffect } from 'react';
import { useAuth } from '../contexts/authContext';
import { useNavigate } from 'react-router-dom';
import ModeToggle from './ModeToggle';
import DropdownAvatar from './DropdownAvatar';
import { useLogo } from './Logo';
import {
  BarChart4,
  Folder,
  FolderOpen,
  FolderOutput,
  Gift,
  Hammer,
  LucideNotebookTabs,
  Plus,
  Settings,
  ShieldQuestion,
  Store,
  Tag,
  Menu,
} from "lucide-react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChatBubbleIcon } from '@radix-ui/react-icons';
import { DialogDemo } from './DialogDemo';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useContainerContext } from '../contexts/containerContext';


const NavPanel: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const { setSelectedOption } = useContainerContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || !user) {
        // navigate('/login');
      }
    }
  }, [isAuthenticated, user, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>; // skeletons
  }

  return (
    <div className="w-full lg:w-3/12 flex flex-col p-4 border-r">
<header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 lg:hidden">
        <Sheet>
        <SheetTrigger asChild>
          <div className="w-full flex justify-between items-center p-4">
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
            <img className="w-3/12" src={useLogo()} alt="logo" />
          </div>
        </SheetTrigger>
          <SheetContent side="left" className="flex flex-col justify-between">
          <nav className="grid gap-6 text-lg font-medium">
              <Command className="w-full h-full flex-1">
                <CommandInput placeholder="Search" />
                <CommandList className="">
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup heading="Entries" className='my-2'>
                    <CommandItem onSelect={() => setSelectedOption('ALL_ENTRIES')}>
                      <Folder className="mr-2 h-4 w-4" />
                      <span>All Entries</span>
                    </CommandItem>
                    <CommandItem onSelect={() => setSelectedOption('NEW_ENTRY')}>
                      <Plus className="mr-2 h-4 w-4"/>
                      <span>New Entry</span>
                    </CommandItem>
                    <CommandItem onSelect={() => setSelectedOption('IMPORT_EXPORT')}>
                      <DialogDemo />
                    </CommandItem>
                    <CommandItem onSelect={() => setSelectedOption('CATEGORIES')}>
                      <FolderOpen className="mr-2 h-4 w-4" />
                      <span>Categories</span>
                    </CommandItem>
                    <CommandItem onSelect={() => setSelectedOption('TAGS')}>
                      <Tag className="mr-2 h-4 w-4" />
                      <span>Tags</span>
                    </CommandItem>
                  </CommandGroup>
                  <CommandSeparator className='my-2'/>
                  <CommandGroup heading="AI">
                    <CommandItem onSelect={() => setSelectedOption('CHAT')}>
                      <ChatBubbleIcon className="mr-2 h-4 w-4" />
                      <span>Chat</span>
                      <CommandShortcut>⌘P</CommandShortcut>
                    </CommandItem>
                    <CommandItem onSelect={() => setSelectedOption('STATS')}>
                      <BarChart4 className="mr-2 h-4 w-4" />
                      <span>Stats</span>
                      <CommandShortcut>⌘B</CommandShortcut>
                    </CommandItem>
                    <CommandItem onSelect={() => setSelectedOption('TOOLS')}>
                      <Hammer className="mr-2 h-4 w-4" />
                      <span>Tools</span>
                      <CommandShortcut>⌘S</CommandShortcut>
                    </CommandItem>
                  </CommandGroup>
                  <CommandSeparator className='my-2' />
                  <CommandGroup heading="Links">
                    <CommandItem onSelect={() => setSelectedOption('ABOUT')}>
                      <Store className="mr-2 h-4 w-4" />
                      <span>About</span>
                      <CommandShortcut>⌘X</CommandShortcut>
                    </CommandItem>
                    <CommandItem onSelect={() => setSelectedOption('CONTACT')}>
                      <LucideNotebookTabs className="mr-2 h-4 w-4" />
                      <span>Contact</span>
                      <CommandShortcut>⌘Y</CommandShortcut>
                    </CommandItem>
                    <CommandItem onSelect={() => setSelectedOption('DONATE')}>
                      <Gift className="mr-2 h-4 w-4" />
                      <span>Donate</span>
                      <CommandShortcut>⌘Z</CommandShortcut>
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </nav>
            <div className="flex justify-center items-center space-x-4 sticky bottom-4">
              <ModeToggle />
              <DropdownAvatar />
            </div>
          </SheetContent>
        </Sheet>
      </header>
      <Command className="w-full h-full flex-1 hidden lg:block">
        <CommandInput placeholder="Search" />
        <CommandList className="">
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Entries" className='my-2'>
            <CommandItem onSelect={() => setSelectedOption('ALL_ENTRIES')}>
              <Folder className="mr-2 h-4 w-4" />
              <span>All Entries</span>
            </CommandItem>
            <CommandItem onSelect={() => setSelectedOption('NEW_ENTRY')}>
              <Plus className="mr-2 h-4 w-4"/>
              <span>New Entry</span>
            </CommandItem>
            <CommandItem onSelect={() => setSelectedOption('IMPORT_EXPORT')}>
              <DialogDemo />
            </CommandItem>
            <CommandItem onSelect={() => setSelectedOption('CATEGORIES')}>
              <FolderOpen className="mr-2 h-4 w-4" />
              <span>Categories</span>
            </CommandItem>
            <CommandItem onSelect={() => setSelectedOption('TAGS')}>
              <Tag className="mr-2 h-4 w-4" />
              <span>Tags</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator className='my-2'/>
          <CommandGroup heading="AI">
            <CommandItem onSelect={() => setSelectedOption('CHAT')}>
              <ChatBubbleIcon className="mr-2 h-4 w-4" />
              <span>Chat</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => setSelectedOption('STATS')}>
              <BarChart4 className="mr-2 h-4 w-4" />
              <span>Stats</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => setSelectedOption('TOOLS')}>
              <Hammer className="mr-2 h-4 w-4" />
              <span>Tools</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator className='my-2' />
          <CommandGroup heading="Links">
            <CommandItem onSelect={() => setSelectedOption('ABOUT')}>
              <Store className="mr-2 h-4 w-4" />
              <span>About</span>
              <CommandShortcut>⌘X</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => setSelectedOption('CONTACT')}>
              <LucideNotebookTabs className="mr-2 h-4 w-4" />
              <span>Contact</span>
              <CommandShortcut>⌘Y</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => setSelectedOption('DONATE')}>
              <Gift className="mr-2 h-4 w-4" />
              <span>Donate</span>
              <CommandShortcut>⌘Z</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
      <div className="hidden lg:flex w-full items-center justify-between mt-8">
        <ModeToggle />
        <DropdownAvatar />
      </div>
    </div>
  );
};

export default NavPanel;

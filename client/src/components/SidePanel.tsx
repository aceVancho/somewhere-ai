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
    Gift,
    Hammer,
    LucideNotebookTabs,
    Plus,
    Settings,
    ShieldQuestion,
    Store,
    Tag,
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
import { ChatBubbleIcon } from '@radix-ui/react-icons';

const SidePanel: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || !user) {
        navigate('/login');
      }
    }
  }, [isAuthenticated, user, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>; // skeletons
  }

  return (
    <div className="w-full lg:w-3/12 flex flex-col items-center p-8 relative">
        <img className="w-6/12 mb-7" src={useLogo()} alt="logo" />
        <Command className="w-full h-full flex-1">
          <CommandInput placeholder="Search" />
          <CommandList className="">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Entries" className='my-2'>
              <CommandItem>
                <Folder className="mr-2 h-4 w-4" />
                <span>All Entries</span>
              </CommandItem>
              <CommandItem>
                <Plus className="mr-2 h-4 w-4"/>
                <span>New Entry</span>
              </CommandItem>
              <CommandItem>
                <FolderOpen className="mr-2 h-4 w-4" />
                <span>Categories</span>
              </CommandItem>
              <CommandItem>
                <Tag className="mr-2 h-4 w-4" />
                <span>Tags</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator className='my-2'/>
            <CommandGroup heading="AI">
              <CommandItem>
                <ChatBubbleIcon className="mr-2 h-4 w-4" />
                <span>Chat</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <BarChart4 className="mr-2 h-4 w-4" />
                <span>Stats</span>
                <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <Hammer className="mr-2 h-4 w-4" />
                <span>Tools</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator className='my-2' />
            <CommandGroup heading="Links">
              <CommandItem>
                <Store className="mr-2 h-4 w-4" />
                <span>About</span>
                <CommandShortcut>⌘X</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <LucideNotebookTabs className="mr-2 h-4 w-4" />
                <span>Contact</span>
                <CommandShortcut>⌘Y</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <Gift className="mr-2 h-4 w-4" />
                <span>Donate</span>
                <CommandShortcut>⌘Z</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      <div className="w-full flex items-center justify-between mt-8">
        <ModeToggle />
        <DropdownAvatar />
      </div>
    </div>
  );
};

export default SidePanel;

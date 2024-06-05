import React from 'react';
import { useContainerContext } from '../contexts/containerContext';
import AllEntries from './ContainerComponents/AllEntries';
import { useAuth } from '@/contexts/authContext';

// Replace anonymous functions with real components
const containerComponentMap: { [key: string]: React.FC } = {
  ALL_ENTRIES: AllEntries,
  NEW_ENTRY: () => <div>New Entry</div>,
  IMPORT_EXPORT: () => <div>Import/Export</div>,
  CATEGORIES: () => <div>Categories</div>,
  TAGS: () => <div>Tags</div>,
  CHAT: () => <div>Chat</div>,
  STATS: () => <div>Stats</div>,
  TOOLS: () => <div>Tools</div>,
  ABOUT: () => <div>About</div>,
  CONTACT: () => <div>Contact</div>,
  DONATE: () => <div>Donate</div>,
  LOGIN: () => (
    <div className='bg-primary w-full text-white lg:flex lg:items-center lg:justify-center h-full hidden'>
        <p>Put your animation or picture here.</p>
    </div>
  )
};

export const MainContainer: React.FC = () => {
    const { selectedOption } = useContainerContext();
    const { isAuthenticated } = useAuth();

    const MainComponent = isAuthenticated
    ? containerComponentMap[selectedOption] || AllEntries
    : containerComponentMap['LOGIN'] ;

    return <MainComponent />
}
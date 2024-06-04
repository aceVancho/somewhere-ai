import React from 'react';
import { useContainerContext } from '../contexts/containerContext';
import AllEntries from './ContainerComponents/AllEntries';

const NewEntry = () => <div>New Entry</div>;
const ImportExport = () => <div>Import/Export</div>;
const Categories = () => <div>Categories</div>;
const Tags = () => <div>Tags</div>;
const Chat = () => <div>Chat</div>;
const Stats = () => <div>Stats</div>;
const Tools = () => <div>Tools</div>;
const About = () => <div>About</div>;
const Contact = () => <div>Contact</div>;
const Donate = () => <div>Donate</div>;
const Default = () => <p>Put your animation or picture here.</p>


const componentsMap: { [key: string]: React.FC } = {
  ALL_ENTRIES: AllEntries,
  NEW_ENTRY: NewEntry,
  IMPORT_EXPORT: ImportExport,
  CATEGORIES: Categories,
  TAGS: Tags,
  CHAT: Chat,
  STATS: Stats,
  TOOLS: Tools,
  ABOUT: About,
  CONTACT: Contact,
  DONATE: Donate,
  DEFAULT: Default
};

export const MainContainer: React.FC = () => {
    const { selectedOption } = useContainerContext();
    const ComponentToRender = componentsMap[selectedOption] || AllEntries;

    return (
        <div className="hidden lg:flex w-full p-8 bg-primary justify-center items-center text-white overflow-scroll overflow-x-hidden">
            <ComponentToRender />
        </div>
    )
}
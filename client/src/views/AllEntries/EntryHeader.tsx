import React from "react";
import { CustomEntryAccordionTrigger } from "@/components/ui/accordion";
import EntryDropDownOptions from "./EntryDropDownOptions";

interface EntryHeaderProps {
  entry: {
    _id: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

const EntryHeader: React.FC<EntryHeaderProps> = ({ entry }) => {
  const isUpdated = entry.createdAt !== entry.updatedAt

  return (
    <CustomEntryAccordionTrigger className="w-full items-center p-5">
    <div className="flex justify-between w-full items-center">
      <div className="flex flex-col items-start">
        <p className="font-semibold text-left">{entry.title}</p>
        <p className="text-sm text-muted-foreground pt-1">
          Created on: {new Date(entry.createdAt).toLocaleDateString()}
        </p>
        {isUpdated && (
          <p className="text-sm text-muted-foreground pt-1">
            Updated on: {new Date(entry.updatedAt).toLocaleDateString()}
          </p>
        )}
      </div>
      <EntryDropDownOptions entry={entry} />
    </div>
  </CustomEntryAccordionTrigger>
  )
}

export default EntryHeader;

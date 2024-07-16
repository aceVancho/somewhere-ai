import React from "react";

interface TrendsCardProps {
  entry: {
    _id: string;
    trends: string;
  };
}

const TrendsCard: React.FC<TrendsCardProps> = ({ entry }) => (
    <div className="flex flex-col w-full mt-4 p-5 whitespace-pre-wrap">
    <h4 className="leading-7 scroll-m-20 text-2xl font-semibold tracking-tight">
      Trends
    </h4>
    <p className="my-1 leading-7">{entry.trends}</p>
  </div>
);

export default TrendsCard;

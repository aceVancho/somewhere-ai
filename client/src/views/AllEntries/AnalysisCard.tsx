import React from "react";

interface AnalysisCardProps {
  entry: {
    analysis: string;
  };
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ entry }) => (
  <div className="flex flex-col w-full mt-4 p-5">
    <h4 className="leading-7 scroll-m-20 text-2xl font-semibold tracking-tight">
      Analysis
    </h4>
    <p className="my-1 leading-7 whitespace-pre-wrap">{entry.analysis}</p>
  </div>
);

export default AnalysisCard;

import React from "react";

interface QuestionsCardProps {
  entry: {
    questions: string[];
  };
}

const QuestionsCard: React.FC<QuestionsCardProps> = ({ entry }) => (
  <div className="flex flex-col w-full mt-4 p-5">
    <h4 className="leading-7 scroll-m-20 text-2xl font-semibold tracking-tight">
      Questions
    </h4>
    <ul className="list-disc [&>li]:mt-2">
    {entry.questions.map((q, index) => (<li key={index} className="m-1 leading-7">{q}</li>))}
    </ul>
  </div>
);

export default QuestionsCard;

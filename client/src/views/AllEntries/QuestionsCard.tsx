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
    {entry.questions.map((q, index) => (
      <p key={index} className="my-1 leading-7">
        {q}
      </p>
    ))}
  </div>
);

export default QuestionsCard;

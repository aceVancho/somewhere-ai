import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface GoalsCardProps {
  entry: {
    _id: string;
    goals: string[];
  };
}

const GoalsCard: React.FC<GoalsCardProps> = ({ entry }) => (
  <div className="flex flex-col w-full mt-4 p-5">
    <h4 className="leading-7 scroll-m-20 text-2xl font-semibold tracking-tight">
      Goals
    </h4>
    <ul>
      {entry.goals.map((g, index) => {
        const goalId = `${entry._id}-goal-${index}`;
        return (
          <li key={goalId} className="list-disc [&>li]:mt-2 m-1">
            <div className="flex items-center justify-between space-x-2 my-1 leading-7">
              <p className="leading-7">
                <Label htmlFor={goalId}>{g}</Label>
              </p>
              <Switch id={goalId} />
            </div>
          </li>
        );
      })}
    </ul>
  </div>
);

export default GoalsCard;

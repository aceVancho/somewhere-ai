import React, { useEffect, useState } from 'react';
import { useWordBank } from '@/contexts/old/wordBankContext';
import { Progress } from "@/components/ui/progress"
import { useToast } from '../ui/use-toast';
import { ToastAction } from "@/components/ui/toast"


export const ProgressBar: React.FC = () => {
    const { isLoading, word } = useWordBank();
    const [progressValue, setProgressValue] = useState(0);
    const duration = 60000; 
    const intervalTime = 1000; 
    const incrementValue = 100 / (duration / intervalTime); 

    const { toast } = useToast();
    
    useEffect(() => {
        const showToast = () => toast({
            title: `Just a moment...`,
            description: `See why this takes some time.`,
            action: <ToastAction altText="Learn More">Learn More</ToastAction>,

        });
        
        if (isLoading) {
            const interval = setInterval(() => {
                setProgressValue((prevValue) => {
                    const newValue = prevValue + incrementValue;
                    if (newValue >= 5 && prevValue < 5) {
                        showToast(); // Show toast when progress reaches 5%
                    }
                    if (newValue >= 100) {
                        clearInterval(interval); 
                        return 100;
                    }
                    return newValue;
                });
            }, intervalTime);

            return () => clearInterval(interval); 
        } else {
            setProgressValue(0); 
        }
    }, [isLoading, incrementValue, toast, word]);

    if (!isLoading) {
        return null;
    }

    return (
        <div className='w-1/4 my-6 '>
            <Progress value={progressValue} />
        </div>
    );
};

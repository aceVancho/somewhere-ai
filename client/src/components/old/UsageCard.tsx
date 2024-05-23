import React, { useEffect, useState, useRef } from 'react';
import { useWordBank } from '@/contexts/old/wordBankContext';
import { SkeletonContainer } from '../SkeletonContainer';
import { Separator } from '../ui/separator';

export const UsageCard: React.FC = () => {
    const { wordData, wordBankIdx, isLoading } = useWordBank();
    const [usage1, setUsage1] = useState<string>('');
    const [usage2, setUsage2] = useState<string>('');
    const [usageAudioUrl1, setUsageAudioUrl1] = useState<string>('');
    const [usageAudioUrl2, setUsageAudioUrl2] = useState<string>('');
  
    useEffect(() => {
      if (wordData[wordBankIdx]) {
        const [newUsage1, newUsage2] = wordData[wordBankIdx]?.usages || [];
        const [newUsageAudioUrl1, newUsageAudioUrl2] = wordData[wordBankIdx]?.ttsUrls?.usages || [];
        setUsage1(newUsage1);
        setUsage2(newUsage2);
        setUsageAudioUrl1(newUsageAudioUrl1);
        setUsageAudioUrl2(newUsageAudioUrl2);
      }
    }, [wordData, wordBankIdx]);
  
    const usage1AudioRef = useRef<HTMLAudioElement>(null);
    const usage2AudioRef = useRef<HTMLAudioElement>(null);
    const playUsageAudio1 = () => usage1AudioRef.current?.play();
    const playUsageAudio2 = () => usage2AudioRef.current?.play();
  
    if (isLoading) return (
      <div className='my-3'>
        <SkeletonContainer />
      </div>
    )
    
    return (
      <div className='flex flex-col items-start mt-6 w-1/2'>
          <div className="cursor-pointer" onClick={playUsageAudio1}>
            <small className='font-semibold'>Usage</small>
            <p className="mt-3 border-l-2 pl-3 italic">
              "{usage1}"
            </p>
            <audio ref={usage1AudioRef} src={usageAudioUrl1} />
          </div>
          <div className="cursor-pointer" onClick={playUsageAudio2}>
            <p className="mt-3 border-l-2 pl-3 italic">
              "{usage2}"
            </p>
            <audio ref={usage2AudioRef} src={usageAudioUrl2} />
          </div>
      </div>
    )
  }
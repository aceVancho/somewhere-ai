import React, { useEffect, useState, useRef } from 'react';
import { useWordBank } from '@/contexts/old/wordBankContext';
import { SkeletonContainer } from '../SkeletonContainer';

export const EtymologyCard: React.FC = () => {
    const { wordData, wordBankIdx, isLoading } = useWordBank();
    useEffect(() => {
      if (wordData[wordBankIdx]) {
        const { etymology } = wordData[wordBankIdx];
        setEtymology(etymology);
      }
    }, [wordData, wordBankIdx]);
  
    const [etymology, setEtymology] = useState('');

    if (isLoading) return (
      <div className='my-3'>
        <SkeletonContainer />
      </div>
    )
    return (
      <div className='flex justify-start mt-10 w-1/2'>
          <div>
            <small className='font-semibold'>Etymology</small>
            <p className="leading-7">
              {etymology}
            </p>
          </div>
      </div>
    );
  }
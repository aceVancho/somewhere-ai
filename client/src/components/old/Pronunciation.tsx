import React, { useEffect, useState, useRef } from 'react';
import { useWordBank } from '@/contexts/old/wordBankContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeLow } from '@fortawesome/free-solid-svg-icons';

export const Pronunciation: React.FC = () => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const { wordData, isLoading } = useWordBank();
    const [pronunciationAudioUrl, setPronunciationAudioUrl] = useState<string>('');
  
    useEffect(() => {
      if (!isLoading) {
        setPronunciationAudioUrl(wordData[0]?.ttsUrls?.word || '');
      }
    }, [wordData, isLoading]);
  
    const playAudio = () => audioRef.current?.play();
  
    if (isLoading) {
      return null;
    }
  
    return (
      <div className='cursor-pointer'>
        <h1 className='mt-3 text-sm text-muted-foreground' onClick={playAudio}>
          <FontAwesomeIcon className='mr-2' icon={faVolumeLow} />
          {wordData[0]?.pronunciation}
        </h1>
        <audio ref={audioRef} src={pronunciationAudioUrl} />
      </div>
    );
  };
import React, { useEffect, useRef, useState } from 'react';
import { WordDefinition } from '../../types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { type CarouselApi } from "@/components/ui/carousel"
import { SkeletonContainer } from '../SkeletonContainer';
import { useWordBank } from '@/contexts/old/wordBankContext';

type Props = {
    wordData: WordDefinition[];
  };

export const WordCarousel: React.FC<Props> = ({ wordData }) => {
    const [api, setApi] = useState<CarouselApi>()
    const { wordBankIdx, setWordBankIdx, isLoading } = useWordBank();
    const [definitionAudioUrl, setDefinitionAudioUrl] = useState('');
    const audioRef = useRef<HTMLAudioElement>(null);
    const playAudio = () => audioRef.current?.play();
    
    useEffect(() => {
      if (!api) return;
      
      api.on("select", () => {
        const index = api.selectedScrollSnap()
        setWordBankIdx(index)
        setDefinitionAudioUrl(wordData[index]?.ttsUrls?.definition || '');
      })
    }, [api, setWordBankIdx, wordData])
  
    useEffect(() => {
      setDefinitionAudioUrl(wordData[wordBankIdx]?.ttsUrls?.definition || ''); // Update when wordBankIdx changes
    }, [wordBankIdx, wordData]);

    if (isLoading) return (
      <div className='my-3 mt-9'>
        <SkeletonContainer />
      </div>
    )
  
    return (
      <div className='flex justify-center mt-4 w-1/2 px-5'>
        <Carousel className='flex items-center' setApi={setApi}>
          <CarouselPrevious id="carouselPrev" className='mx-2 mt-6 p-2'/>
          <CarouselContent className=''>
            {Array.from(wordData).map((obj: WordDefinition, index: number) => (
              <CarouselItem key={index} className="">
                <div className="p-1">
                  <Card className=''>
                    <CardContent className="flex items-center justify-center p-6 cursor-pointer" onClick={playAudio}>
                        <span className="">
                          <audio ref={audioRef} src={definitionAudioUrl}/>
                          <p className='text-sm text-muted-foreground'>{obj.partOfSpeech}</p>
                          <p className='leading-7 [&:not(:first-child)]:mt-2'>{obj.definition}</p>
                        </span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselNext id="carouselNext" className='mx-2 mt-6 p-2'/>
        </Carousel>
      </div>
    );
};

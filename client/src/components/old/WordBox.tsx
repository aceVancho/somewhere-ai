import React, { useEffect, useState, useRef } from 'react';
import { useWordBank } from '@/contexts/old/wordBankContext';
import * as Separator from '@radix-ui/react-separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from '../ui/badge';


export const BoxOfWords: React.FC = () => {

  const { wordData, wordBankIdx, isLoading } = useWordBank();
  
  const [rhymes, setRhymes] = useState({ syllable1: [], syllable2: [], syllable3: [], syllable4: [] });
  const [synonyms, setSynonyms] = useState({ level1: [], level2: [], level3: [], level4: [] });
  const [antonyms, setAntonyms] = useState<string[]>([]);
  
  useEffect(() => {
    if (wordData[wordBankIdx] && !isLoading) {
      const { thesaurus, antonyms: wordAntonyms, rhymesWith } = wordData[wordBankIdx];
      setSynonyms(thesaurus || '');
      setAntonyms(wordAntonyms || '');
      setRhymes(rhymesWith || '');
    }
  }, [wordData, wordBankIdx, isLoading]);

  if (isLoading) return null;

  return (
      <Tabs defaultValue="synonyms" className="mt-10 flex flex-col w-1/2 items-center ">
        <TabsList className=''>
          <TabsTrigger value="synonyms">Synonyms</TabsTrigger>
          <TabsTrigger value="antonyms">Antonyms</TabsTrigger>
          <TabsTrigger value="rhymes">Rhymes</TabsTrigger>
        </TabsList>
        <TabsContent value="synonyms" className=''>
          {Object.entries(synonyms).map(([level, words]) => (
              words.map((synonym, index) => (
                <Badge variant="outline" className='text-sm my-2 mx-2' key={index}>{synonym}</Badge>
              ))
          ))}
        </TabsContent>
        <TabsContent value="antonyms" className=''>
            {antonyms.map((antonym, index) => (
                <Badge variant="outline" className='text-sm my-2 mx-2' key={index}>{antonym}</Badge>
            ))}
        </TabsContent>
        <TabsContent value="rhymes" className=''>
          {Object.entries(rhymes).map(([syllable, words]) => (
              words.map((rhyme, index) => (
                <Badge variant="outline" className='text-sm my-2 mx-2' key={index}>{rhyme}</Badge>
              ))
          ))}
        </TabsContent>
      </Tabs>
  )
}
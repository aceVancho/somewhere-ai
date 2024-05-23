declare namespace Express {
    interface Request {
        user: any;
    }
}

interface IThesaurus {
    level1: string[];
    level2: string[];
    level3: string[];
    level4: string[];
  }
  
  interface IRhyme {
    syllable1: string[];
    syllable2: string[];
    syllable3: string[];
    syllable4: string[];
  }
  
  export interface IWord extends Document {
    word: string;
    meaningId: string;
    definition: string;
    usages: string[];
    partOfSpeech: string;
    pronunciation: string;
    etymology: string;
    rhymesWith: string[];
    antonyms: string[];
    collocations: string[];
    wordFamily: string[];
    relatedWords: string[]
    thesaurus: IThesaurus;
    ttsUrls: ITextToSpeechURLs
  }



  interface ITextToSpeechURLs {
    word: string;
    definition: string;
    usages: string[];
    pronunciation: string;
  }
  
  interface IUploadFileFromMemoryParams {
    buffer: Buffer;
    inputType: string
    word: string;
    meaningId: string;
  }
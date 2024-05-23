// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Input } from "@/components/ui/input"
// import { useWordBank } from '@/contexts/old/wordBankContext';

  
// const baseUrl = 'http://localhost:4001'
// const wordEndpoint = '/api/word/'

// const SearchBar: React.FC = () => {
//     const [searchTerm, setSearchTerm] = useState('');
//     const [, setSearchResults] = useState(null);
//     const [isValidWord, setIsValidWord] = useState(true);
//     const { setWord, setWordData, setIsLoading } = useWordBank();


//     const checkWordValidity = async (word: string): Promise<boolean> => {
//         try {
//             const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
//             return response.ok;
//         } catch (error) {
//             console.error("Error validating word.", error);
//             return false;
//         }
//     }

//     const handleSearch = async () => {
//         if (!(await checkWordValidity(searchTerm))) {
//             setIsValidWord(false);
//             return console.log(`${searchTerm} is not a valid word. `)
//         }
//         if (searchTerm.trim() !== '') {
//             setIsLoading(true)
//             setIsValidWord(true);
//             setWord(searchTerm)
//             try {
//                 const response = await axios.get(`${baseUrl}${wordEndpoint}${searchTerm}`)
//                 if (response.status >= 200 && response.status < 300) {
//                     const data = await response.data;
//                     setSearchResults(data);
//                     setWordData(data)
//                 } else {
//                     setIsValidWord(false);
//                     throw new Error(response.statusText);
//                 }
//             } catch (error) {
//                 console.error(error);
//                 setSearchResults(null);
//                 setIsValidWord(false);
//             } finally {
//                 setIsLoading(false);
//             }
//         }
//     }

//     const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);

//     const handleKeyPress = (e: React.KeyboardEvent) => {
//         if (e.key === 'Enter') {
//             handleSearch();
//         }
//     };

//     const validWordClassName = (isValid: boolean) => isValid ? 'text-green-500' : 'text-red-500';


//     return (
//         <div>
//             <Input
//                 type="search"
//                 // className={`${validWordClassName(isValidWord)} focus:border-[#8390FA] focus:text-[#F9E9EC] border-[#F9E9EC] peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-vista-blue data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-vista-blue [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0`}
//                 id="searchbar"
//                 placeholder="Search"
//                 value={searchTerm}
//                 onChange={handleSearchChange}
//                 onKeyPress={handleKeyPress}
//             />
//         </div>
//     );
// };

// export default SearchBar;

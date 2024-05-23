import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// import SearchBar from './old/SearchBar';  
import LoginButton from './LoginButton';
import { useAuth } from '../contexts/authContext';
import ModeToggle from './ModeToggle';
import DropdownAvatar from './DropdownAvatar';
import { Button } from "@/components/ui/button"
import { useLogo } from './Logo';

const Navbar: React.FC = () => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const dropdownAvatar = document.getElementById('dropdownAvatar');
    const loginButtonElem = document.getElementById('loginButton');

    if (isAuthenticated) {
      if (dropdownAvatar) dropdownAvatar.style.display = 'block';
      if (loginButtonElem) loginButtonElem.style.display = 'none';
    } else {
      if (dropdownAvatar) dropdownAvatar.style.display = 'none';
      if (loginButtonElem) loginButtonElem.style.display = 'block';
    }
  }, [isAuthenticated]);

  return (
    <nav
      className="flex-no-wrap relative flex w-screen items-center justify-between py-2 px-2 lg:flex-wrap lg:justify-start lg:py-4">
      <div className="flex w-full flex-wrap items-center justify-between px-3">
        {/* <!-- Hamburger button for mobile view --> */}
        <button
          className="block border-0 bg-transparent px-2 text-neutral-500 hover:no-underline hover:shadow-none focus:no-underline focus:shadow-none focus:outline-none focus:ring-0 dark:text-neutral-200 lg:hidden"
          type="button"
          data-te-collapse-init
          data-te-target="#navbarSupportedContent1"
          aria-controls="navbarSupportedContent1"
          aria-expanded="false"
          aria-label="Toggle navigation">
          {/* <!-- Hamburger icon --> */}
          <span className="[&>svg]:w-7">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-7 w-7">
              <path
                fillRule="evenodd"
                d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
                clipRule="evenodd" />
            </svg>
          </span>
        </button>
    
        {/* <!-- Collapsible navigation container --> */}
        <div
          className="!visible hidden 6 flex-grow basis-[100%] items-center lg:!flex lg:basis-auto"
          id="navbarSupportedContent1"
          data-te-collapse-item>
          {/* <!-- Logo --> */}
          <Link to="/" className="mb-4 ml-2 mr-5 mt-3 flex items-center text-neutral-900 hover:text-neutral-900 focus:text-neutral-900 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400 lg:mb-0 lg:mt-0">
                <img className='h-8' src={useLogo()} alt="Lexicon AI Logo" loading="lazy" />
            </Link>
          {/* <!-- Left navigation links --> */}
          <ul className="list-style-none mr-auto flex flex-col pl-0 lg:flex-row" data-te-navbar-nav-ref>
                <li className="mb-4 lg:mb-0 lg:pr-2" data-te-nav-item-ref>
                {/* <!-- About link --> */}
                  <Button variant="ghost">
                    <Link to="/about" className="">About</Link>
                  </Button>
                </li>
                <li className="mb-4 lg:mb-0 lg:pr-2" data-te-nav-item-ref>
                {/* <!-- Donations link --> */}
                <Button variant="ghost">
                    <Link to="/donations" className="">Donations</Link>
                  </Button>                
                </li>
            </ul>
        </div>
    
        {/* <!-- Right elements --> */}
        <div className="relative flex items-center space-x-2">
          {/* <!-- Search Bar --> */}
            <ModeToggle />
            {/* <SearchBar /> */}
            <LoginButton />
            <DropdownAvatar />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

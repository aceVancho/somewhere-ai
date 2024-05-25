import React, { useEffect, useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from '../contexts/authContext';

async function hashEmail(email: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const encoder = new TextEncoder();
    const data = encoder.encode(normalizedEmail);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}


const DropdownAvatar: React.FC = () => {
    const { user, logout } = useAuth();
    const [gravatarHash, setGravatarHash] = useState('');

    useEffect(() => {
        if (user) hashEmail(user.email).then(hashedEmail => setGravatarHash(hashedEmail));
    }, [user])

    return (
        <Avatar id="dropdownAvatar" className="">
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <AvatarImage src={`https://gravatar.com/avatar/${gravatarHash}`}/>
                    <AvatarFallback>CN</AvatarFallback>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { logout() }}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
            </Avatar>
    )
}

export default DropdownAvatar; 
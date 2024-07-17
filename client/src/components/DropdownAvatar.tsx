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
import { useToast } from './ui/use-toast';
import { useContainerContext } from '@/contexts/containerContext';

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

    const { toast } = useToast();

    const handleLogout = () => {
        try {
            const username = user?.email.split('@')[0]
            logout()
            toast({
                title: `✌️ Bye, ${username}!`,
                description: "Logged out successfully.",
              });
        } catch (error) {
            console.error(error);
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description: "There was a problem with your request.",
            });
        }
    }

    const { setSelectedContainer } = useContainerContext();

    return (
        <Avatar id="dropdownAvatar" className="shadow-lg">
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <AvatarImage src={`https://gravatar.com/avatar/${gravatarHash}`}/>
                    <AvatarFallback>CN</AvatarFallback>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSelectedContainer("PROFILE")}>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
            </Avatar>
    )
}

export default DropdownAvatar; 
import React, { useEffect } from 'react';
import { useAuth } from '../contexts/authContext';
import { useNavigate, Link } from 'react-router-dom';
import ModeToggle from '@/components/ModeToggle';
import DropdownAvatar from '@/components/DropdownAvatar';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"



const HomePage: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || !user) {
        navigate('/login');
      }
    }
  }, [isAuthenticated, user, loading, navigate]);

  if (loading) {
    return <div> Loading...</div>; // Or any loading indicator
  }

  return (
    <div id="home-container" className='flex flex-col w-full items-center'>
      Home Page
      <div className="bottom-8 w-full flex justify-between">
            <ModeToggle />
            <DropdownAvatar />
        </div>
        <Card className="sm:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle>Your Orders</CardTitle>
          <CardDescription className="max-w-lg text-balance leading-relaxed">
            Introducing Our Dynamic Orders Dashboard for Seamless Management and
            Insightful Analysis.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button>Create New Order</Button>
        </CardFooter>
      </Card>
      <nav
      className="grid gap-4 text-sm text-muted-foreground"
    >
      <Link to="#" className="font-semibold text-primary">
        General
      </Link>
      <Link to="#">Security</Link>
      <Link to="#">Integrations</Link>
      <Link to="#">Support</Link>
      <Link to="#">Organizations</Link>
      <Link to="#">Advanced</Link>
    </nav>
    <Menubar>
    <MenubarMenu>
      <MenubarTrigger>File</MenubarTrigger>
      <MenubarContent>
        <MenubarItem>
          New Tab <MenubarShortcut>⌘T</MenubarShortcut>
        </MenubarItem>
        <MenubarItem>New Window</MenubarItem>
        <MenubarSeparator />
        <MenubarItem>Share</MenubarItem>
        <MenubarSeparator />
        <MenubarItem>Print</MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  </Menubar>
  <NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
      <NavigationMenuContent>
        <NavigationMenuLink>Link</NavigationMenuLink>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>

    </div>
  );
};

export default HomePage;

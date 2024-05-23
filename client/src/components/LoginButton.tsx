import React, { useEffect } from 'react';
import TestForm from "./LoginForm"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
  
const LoginButton: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger id="loginButton" asChild>
        <Button variant="outline">Login</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {/* Header */}
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
          <DialogDescription>
            Log in to share how smart you are.
          </DialogDescription>
        </DialogHeader>

        {/* Form */}
        <TestForm />

        {/* Footer */}
        <DialogFooter className='hidden'>
          <DialogClose asChild>
              <Button type="button" variant="secondary" id="loginCloseButton">
                Close
              </Button>
            </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default LoginButton; 
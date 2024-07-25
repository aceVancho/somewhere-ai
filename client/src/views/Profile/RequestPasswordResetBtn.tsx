import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/authContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { ReactEventHandler, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

interface RequestPasswordResetBtnProps {
  email: string;
  isAuthenticated: boolean
}

export const RequestPasswordResetBtn: React.FC<
  RequestPasswordResetBtnProps
> = ({ isAuthenticated, email }) => {

  const { verifyUser } = useAuth();
  const { toast } = useToast();

  const handlePasswordResetRequest = async () => {
    let response;
    if (!isAuthenticated) {
      response = await verifyUser(email)
    }
    
    if (!response) return toast({
        variant: "destructive",
        title: "This user does not exist in our database",
        description: "Try again with a different e-mail address.",
        action: <ToastAction altText="Try again">Try again.</ToastAction>,
      });

    try {
      fetch(`http://localhost:4001/api/users/requestPasswordReset/`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("somewhereAIToken")}`,
        },
        body: JSON.stringify({ email, isAuthenticated })
      })
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {isAuthenticated 
        ? <Button variant="outline">Request Password Reset</Button>
        : <Button variant="link">Forgot Password?</Button> 
        }
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reset Password</AlertDialogTitle>
          <AlertDialogDescription>
            An email will be sent to {email}. Click the link inside to
            navigate back here and reset your password.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="destructive" onClick={handlePasswordResetRequest}>
              Continue
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
};

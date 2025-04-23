import { useRef, useState } from "react";
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
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { useToast } from "@/components/ui/use-toast";
  import { ToastAction } from "@/components/ui/toast";

  
  export const UnauthPwResetBtn = () => {
  
    const { verifyUser } = useAuth();
    const { toast } = useToast();
    const [email, setEmail] = useState("");

  
    const handlePasswordResetRequest = async () => {
      
      // Validate email
      if (!email) {
        return toast({ title: "Please enter your email." });
      }

      // Check if user exists
      const userExists = await verifyUser(email);
        
      if (!userExists) return toast({
          variant: "destructive",
          title: "User not found",
          description: "Try again with a different e-mail address.",
          action: <ToastAction altText="Try again">Try again.</ToastAction>,
        });
      
  
      // Send password reset request
      try {
        fetch(`http://localhost:4001/api/users/requestPasswordReset/`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("somewhereAIToken")}`,
          },
          body: JSON.stringify({ email })
        })

        toast({
          variant: "default",
          title: "Password Reset Request Sent",
          description: "Check your email for a link to reset your password.",
        });
      } catch (error) {
        console.error(error);
      }
    }
  
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="link">Forgot Password?</Button> 
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Password</AlertDialogTitle>
            <AlertDialogDescription>
              <p>Please provide the email address you used to sign up. We will send you a link to reset your password.</p>
              <Input onChange={(e) => {setEmail(e.target.value)}} className="mt-4" type="email" placeholder="Email" />
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
  
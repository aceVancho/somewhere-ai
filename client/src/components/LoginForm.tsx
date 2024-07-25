import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/authContext";
import { Link, useNavigate } from "react-router-dom";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import 'animate.css';
import { RequestPasswordResetBtn } from "@/views/Profile/RequestPasswordResetBtn";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
 
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

const FormSchema = z.object({
  email: z.string().min(2, {
    message: "Email must be at least 2 characters.",
  }),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
});

interface LoginFormProps {
  switchToSignUp: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ switchToSignUp }) => {
  const { login, user, isAuthenticated, verifyUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { toast } = useToast();
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const { email, password } = data;
    if (email && password) {
      try {
        await login({ email, password });
        const username = email.split("@")[0];
        toast({
          title: `👋 Welcome back, ${username}!`,
          description: "You've logged in successfully.",
        });
        navigate('/all-entries')
      } catch (error: any) {
        console.error(error.message);
        document.getElementById('password')?.classList.add('animate__shakeX')
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: `${error.message || 'There was a problem with your request.'}`,
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      } 
      finally {
        setTimeout(() => {
          document.getElementById('password')?.classList.remove('animate__shakeX')
          
        }, 1000);
      }
    }
  }

  const handleNextClick = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (email) {
      setShowPassword(true);
    }
  };

  const requestPasswordResetBtnProps = {
    isAuthenticated: isAuthenticated,
    email
}

  return (
    <div className="w-full flex-1 flex flex-col relative h-screen">
      <div>
        <div className="mb-2">
          <h1 className="text-2xl font-bold">Log in to your account</h1>
        </div>
        <div className="mb-4 flex items-center">
          <p className="mr-2">Don't have an account?</p>
          <Button
            variant="link"
            className="text-primary text-md active:text-secondary p-0"
            onClick={switchToSignUp}
          >
            Sign Up
          </Button>
        </div>
      </div>
      <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                    id='emailInput'
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      {...field}
                      value={email}
                      onChange={(e) => {
                        field.onChange(e);
                        setEmail(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {showPassword && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative animate__animated" id="password">
                        <Input
                          type={passwordVisible ? "text" : "password"}
                          placeholder="p@$$w0Rd"
                          autoComplete="new-password"
                          {...field}
                          className="pr-10"
                          
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                          onClick={() => setPasswordVisible(!passwordVisible)}
                        >
                          {passwordVisible ? (
                            <FontAwesomeIcon icon={faEye} />
                          ) : (
                            <FontAwesomeIcon icon={faEyeSlash} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <div className="flex justify-end">
                      <RequestPasswordResetBtn {...requestPasswordResetBtnProps} />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
              {showPassword ? (
                <Button type="submit" className='w-1/4  rounded'>Login</Button>
              ) : (
                <div className="flex justify-start">
                  <Button type="button" className='w-1/4 rounded' onClick={handleNextClick}>Next</Button>
                </div>
              )}
          </form>
        </Form>
    </div>
  );
};

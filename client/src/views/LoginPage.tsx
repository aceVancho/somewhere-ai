import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/authContext';
import { Link, useNavigate } from 'react-router-dom';
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

const FormSchema = z.object({
  email: z.string().min(2, {
    message: "Email must be at least 2 characters.",
  }),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
});

const LoginPage = () => {
  const { user, login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    console.log('Updated isAuthenticated:', isAuthenticated);
    console.log('Updated user:', user);
  }, [isAuthenticated, user]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  });

  const { toast } = useToast();
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const { email, password } = data;
    if (email && password) {
      try { 
        await login({ email, password });
        toast({
          title: 'Welcome!',
          description: "You've logged in successfully.",
        });
        handleDismissModal();
      } catch (error) { 
        console.error(error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      } 
    } 
  }

  const handleDismissModal = () => {
    document.getElementById('loginCloseButton')?.click();
    navigate('/');
  };

  const handleNextClick = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    if (email) {
      setShowPassword(true);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/5 bg-gray-900 text-white flex flex-col items-center p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Logo</h1>
        </div>
        <div className="mb-4">
          <h2 className="text-xl">Log in to your account</h2>
        </div>
        <div className="mb-4">
          <p>
            Don't have an account? <a href="#" className="text-green-500">Sign Up</a>
          </p>
        </div>
        <div className="w-full">
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
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        {...field}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        <Input
                          type="password"
                          placeholder="p@$$w0Rd"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <a href="#" className="text-green-500 mb-4">Forgot Password?</a>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {showPassword ? (
                <Button type="submit" className='w-full'>Login</Button>
              ) : (
                <Button type="button" className='w-full bg-green-500 text-white rounded hover:bg-green-600' onClick={handleNextClick}>Next</Button>
              )}
              <div className='flex justify-center items-center w-full'>
                <h1 className="">Not already a member? </h1>
                <Link to="registrationPage" className='' onClick={handleDismissModal}>
                  <Button variant="ghost" className='text-primary text-md active:text-secondary'>Register</Button>
                </Link>
              </div>
            </form>
          </Form>
        </div>
      </div>
      <div className="w-4/5 bg-green-700 flex justify-center items-center text-white">
        <p>Put your animation or picture here.</p>
      </div>
    </div>
  );
};

export default LoginPage;

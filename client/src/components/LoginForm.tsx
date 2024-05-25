"use client"

import React, { useEffect } from 'react';
import { useAuth } from '../contexts/authContext';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

const FormSchema = z.object({
  email: z.string().min(2, {
    message: "Email must be at least 2 characters.",
  }),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
})

const InputForm: React.FC =() => {

  const { user, login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
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
  })

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
        handleDismissModal()
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
    document.getElementById('loginCloseButton')?.click()
    navigate('/');
  };
  

  return (
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
                  // ref={emailRef}
                  type="email" 
                  placeholder="you@example.com"
                  autoComplete="email" 
                  {...field} 
                  />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input 
                  // ref={passwordRef}
                  type="password" 
                  placeholder="p@$$w0Rd" 
                  autoComplete="new-password" 
                  {...field} 
                  />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className='w-full'>Login</Button>
        <div className='flex justify-center items-center w-full'>
            <h1 className="">Not already a member? </h1>
            <Link to="registrationPage" className='' onClick={handleDismissModal}>
              <Button variant="ghost" className='text-primary text-md active:text-secondary'>Register</Button>
            </Link>
        </div>
      </form>
    </Form>
  )
}

export default InputForm; 

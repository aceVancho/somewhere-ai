"use client"

import React, { useContext, useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/authContext';
import { Link } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { useNavigate } from 'react-router-dom';

const FormSchema = z.object({
  email: z.string().min(1, {message: 'Email is required'}).email('Invalid email address'),
  password: z.string().min(6, {message: 'Password must be at least 6 characters'}),
  confirmPassword: z.string().min(6, {message: 'Password must be at least 6 characters'})
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords does not match'
})

const RegistrationForm: React.FC =() => {

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: ""
    },
  })

  const { toast } = useToast();
  const { signUp } = useAuth();
  const navigate = useNavigate();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const { email, password } = data;
    if (email && password) {
      try { 
        await signUp({ email, password });
        toast({
          title: 'Welcome!',
          description: `A user for ${email} has successfully been added.`,
        });
        navigate('/');
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
                  className='bg-dimgrey'
                  type="email" 
                  placeholder="you@example.com"
                  autoComplete="email" 
                  {...field} />
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
                  className='bg-dimgrey'
                  type="password" 
                  placeholder="Password" 
                  autoComplete="new-password" 
                  {...field} />
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
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input 
                  className='bg-dimgrey'
                  type="password" 
                  placeholder="Confirm Password" 

                  {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className='w-full' variant="secondary">Sign Up</Button>
      </form>
    </Form>
  )
}

export default RegistrationForm; 

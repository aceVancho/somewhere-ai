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
import DropdownAvatar from '@/components/DropdownAvatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import ModeToggle from '@/components/ModeToggle';
import { useLogo } from '@/components/Logo';

const FormSchema = z.object({
  email: z.string().min(2, {
    message: "Email must be at least 2 characters.",
  }),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
})

const LoginPanel = () => {
  const { user, login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    const dropdownAvatar = document.getElementById('dropdownAvatar');
    const loginButtonElem = document.getElementById('loginButton');
  
    if (isAuthenticated) {
      if (dropdownAvatar) dropdownAvatar.style.display = 'block';
      if (loginButtonElem) loginButtonElem.style.display = 'none';
    } else {
      if (dropdownAvatar) dropdownAvatar.style.display = 'none';
      if (loginButtonElem) loginButtonElem.style.display = 'block';
    }
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
        const username = email.split('@')[0]
        toast({
          title: `👋 Welcome back, ${username}!`,
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
      <div className="w-full lg:w-3/12 flex flex-col items-center p-8 relative">
        <img className="w-8/12 mb-7" src={useLogo()} alt="logo" />
        <div className="mb-2">
          <h1 className="text-2xl font-bold">Log in to your account</h1>
        </div>
        <div className='mb-4 flex items-center'>
          <p className="mr-2">Don't have an account?</p>
          <Link to="registrationPage" className='inline' onClick={handleDismissModal}>
            <Button variant="link" className='text-primary text-md active:text-secondary p-0'>Sign Up</Button>
          </Link>
        </div>
        <div className="w-full flex-1 flex flex-col justify-between">
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
                        onChange={(e) => {
                          field.onChange(e)
                          setEmail(e.target.value)
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
                        <div className="relative">
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
                      <Link to="registrationPage" className='flex justify-end' onClick={handleDismissModal}>
                        <Button variant="link">Forgot Password?</Button>
                      </Link>
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
          <div className="bottom-8 w-full flex justify-between">
            <ModeToggle />
            <DropdownAvatar />
          </div>
        </div>
      </div>

  );
};

export default LoginPanel;
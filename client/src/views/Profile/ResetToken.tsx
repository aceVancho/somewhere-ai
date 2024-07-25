import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/authContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export const ResetToken = () => {
    const [searchParams] = useSearchParams();
    const { user, resetPassword } = useAuth();
    const { toast } = useToast();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [passwordResetToken, setPasswordResetToken] = useState<null | string>(null);
    const [email, setEmail] = useState('');
    const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);

    useEffect(() => {
      const passwordResetTokenParam = searchParams.get('passwordResetToken');
      if (passwordResetTokenParam) setPasswordResetToken(passwordResetTokenParam);

      const emailParam = searchParams.get('email');
      if (emailParam) {
        setEmail(emailParam.trim());
        form.reset({ email: emailParam.trim() });
      }
    }, [searchParams]);

    const FormSchema = z
    .object({
      email: z.string().email({ message: "Invalid email address." }),
      password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters." }),
      confirmPassword: z
        .string()
        .min(6, { message: "Password must be at least 6 characters." }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    });

    const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
        email: email,
        password: "",
        confirmPassword: "",
      },
    });

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
      const { password } = data;
      if (email && password && passwordResetToken) {
        try {
          await resetPassword({ email, password, token: passwordResetToken });
          toast({
            title: `🎉 Password Reset`,
            description: "Your password has been successfully reset.",
          });
        } catch (error: any) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description:
              error.message || "There was a problem with your request.",
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
        }
      }
    };

    return (
      <div className="flex flex-col h-screen justify-evenly items-center">
        <div className='flex flex-col items-center'>
          <h1 className='text-3xl font-extrabold mb-2'>Welcome back.</h1>
          <h1 className='leading-7'>Your password reset request was successful.</h1>
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
                      disabled
                      type="email"
                      placeholder={email}
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={passwordVisible ? "text" : "password"}
                        placeholder="Password"
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
                    <div className="relative">
                      <Input
                        type={confirmPasswordVisible ? "text" : "password"}
                        placeholder="Confirm Password"
                        autoComplete="new-password"
                        {...field}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                        onClick={() =>
                          setConfirmPasswordVisible(!confirmPasswordVisible)
                        }
                      >
                        {confirmPasswordVisible ? (
                          <FontAwesomeIcon icon={faEye} />
                        ) : (
                          <FontAwesomeIcon icon={faEyeSlash} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Reset Password
            </Button>
          </form>
        </Form>
        <div></div>
      </div>
    );
}

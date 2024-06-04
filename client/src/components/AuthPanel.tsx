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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Form1 } from './Form1';
import { Form2 } from './Form2';

const FormSchema = z.object({
  email: z.string().min(2, {
    message: "Email must be at least 2 characters.",
  }),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
});



export const AuthPanel: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="w-full lg:w-3/12 flex flex-col items-center p-8 relative">
      <img className="w-8/12 mb-7" src={useLogo()} alt="logo" />
      {isSignUp ? (
        <Form2 switchToLogin={() => setIsSignUp(false)} />
      ) : (
        <Form1 switchToSignUp={() => setIsSignUp(true)} />
      )}
      <div className="bottom-8 w-full flex justify-between">
        <ModeToggle />
      </div>
    </div>
  );
};

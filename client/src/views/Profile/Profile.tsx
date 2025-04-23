import { useToast } from "@/components/ui/use-toast";
import DeleteAllEntriesBtn from "./DeleteAllEntriesBtn";
import { useAuth } from "@/contexts/authContext";
import { CornerDownLeft, Mic, Paperclip, Upload, UploadIcon, UploadCloud, UploadCloudIcon, Image } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AuthPwResetBtn } from "./AuthPwResetBtn";
import DeleteUserBtn from "./DeleteUserBtn";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useRef } from "react";

const Profile: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDeleteAllEntries = async () => {
    try {
      fetch(
        `http://localhost:4001/api/entries/deleteAllEntries/${user?._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("somewhereAIToken")}`,
          },
        }
      );
      toast({
        title: "Entry deleted",
        description: `Your entries have been deleted successfully.`,
      });
    } catch (error) {
      console.error('Could not delete all entries:', error);
      toast({
          variant: "destructive",
          title: "Error",
          description: (error as Error).message,
        });
    }
  }

  const authPwResetBtnProps = {
      email: user?.email || '',
      isAuthenticated: isAuthenticated
  }

  const handleDeleteUser = async () => {
    try {
      fetch(
        `http://localhost:4001/api/users/${user?._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("somewhereAIToken")}`,
          },
        }
      );
      toast({
        title: "User deleted",
        description: `Your user and entries have been deleted successfully.`,
      });
      navigate('/login');
    } catch (error) {
      console.error('Could not delete user or entries:', error);
      toast({
          variant: "destructive",
          title: "Error",
          description: (error as Error).message,
        });
    }
  }


const ProfilePhotoUploadButton = () => {
  const { toast } = useToast();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("http://localhost:4001/api/users/uploadProfilePhoto", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("somewhereAIToken")}`,
        },
        body: formData,
      });

      const result = await response.json();
      if (result) {
        toast({
          title: 'Lookin good! 👤🤳',
          description: "Photo Uploaded Successfully",
        });
      }

    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Could not upload profile photo.',
      });
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" onClick={handleButtonClick}>
            <Image />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="bg-foreground">
          <p>Choose Profile Image</p>
        </TooltipContent>
      </Tooltip>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </TooltipProvider>
  );
};

  return (
    <div className="flex h-4/5 justify-center items-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription className="flex justify-between items-baseline">
            {user?.email}
            <ProfilePhotoUploadButton />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col mt-2 space-y-3">
            <Label>Actions</Label>
            <AuthPwResetBtn {...authPwResetBtnProps } />
            <DeleteAllEntriesBtn deleteAllEntries={handleDeleteAllEntries}/>
            <DeleteUserBtn deleteUser={handleDeleteUser} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;

import { useToast } from "@/components/ui/use-toast";
import DeleteAllEntriesBtn from "./DeleteAllEntriesBtn";
import { useAuth } from "@/contexts/authContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RequestPasswordResetBtn } from "./RequestPasswordResetBtn";
import DeleteUserBtn from "./DeleteUserBtn";
import { useNavigate } from "react-router-dom";

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

  const requestPasswordResetBtnProps = {
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

  return (
    <div className="flex h-4/5 justify-center items-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>{user?.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col mt-2 space-y-3">
            <Label>Actions</Label>
            <RequestPasswordResetBtn {...requestPasswordResetBtnProps } />
            <DeleteAllEntriesBtn deleteAllEntries={handleDeleteAllEntries}/>
            <DeleteUserBtn deleteUser={handleDeleteUser} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;

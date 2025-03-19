import { useContext, useEffect, useState } from "react";
import Input from "../../components/Input";
import { toast } from "react-toastify";
import { AuthContext } from "../../components/auth/AuthContext";
import { useNavigate, Link } from "react-router";
import { api } from "../../helpers/api";
import { KeyRound, KeySquare } from "lucide-react";

function  ChangePass() {
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPass !== confirmPass) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    api
      .post(`/auth/change-password`, {
        old_pass: currentPass,
        new_pass: newPass,
      })
      .then((res) => {
        if (res.data.ok) {
          toast.success("Password changed successfully!");
          navigate("/profile");
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error(
          err.response.data.message ||
            "Failed to change password. Please try again."
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gray-100">
      <div className="bg-white flex flex-col rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-primary text-center">Change Password</h2>
        <p className="text-sm text-gray-600 mt-1 text-center">
          Enter your current password and set a new one
        </p>
        
        <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
          <Input
            id="currentPass"
            type="password"
            placeholder="**********"
            icon={<KeyRound size={16} color="#99a1af" />}
            label="Current Password"
            value={currentPass}
            onChange={(e) => setCurrentPass(e.target.value)}
          />
          <Input
            id="newPass"
            type="password"
            placeholder="**********"
            icon={<KeySquare size={16} color="#99a1af" />}
            label="New Password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
          />
          <Input
            id="confirmPass"
            type="password"
            placeholder="**********"
            icon={<KeySquare size={16} color="#99a1af" />}
            label="Confirm New Password"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 rounded-md bg-black text-white font-medium hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-black"
          >
            {isLoading ? "Processing..." : "Change Password"}
          </button>
        </form>

        <Link to="/forgotPass" className="mt-4 text-sm text-center text-blue-600 underline">
          Forgot Password?
        </Link>
      </div>
    </div>
  );
}

export default ChangePass;

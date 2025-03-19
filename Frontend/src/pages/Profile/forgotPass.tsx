import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import { KeyRound, Mail, SquareAsterisk } from "lucide-react";
import { toast } from "react-toastify";
import { api } from "../../helpers/api";
import { AuthContext } from "../../components/auth/AuthContext";

const ForgotPass = () => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) logout();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (step === 1) {
        api.post("/auth/forgot-password", { email })
          .then((res) => {
            if (res.data.ok) {
              toast.success("Password reset email sent successfully.");
              setStep(2);
            } else {
              toast.error(res.data.message || "Failed to send reset email.");
            }
          })
          .catch((err) => toast.error(err.response?.data.message || "Error"))
          .finally(() => setIsLoading(false));
      } else {
        if (newPass !== confirmPass) {
          toast.error("Passwords do not match");
          setIsLoading(false);
          return;
        }
        api.post("/auth/reset-password", { token, newPassword: newPass })
          .then((res) => {
            if (res.data.ok) {
              toast.success("Password reset successfully. Please login.");
              navigate("/login");
            } else {
              toast.error(res.data.message || "Failed to reset password.");
            }
          })
          .catch((err) => toast.error(err.response?.data.message || "Error"))
          .finally(() => setIsLoading(false));
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg p-6 sm:p-8 overflow-hidden">
        {/* Progress Bar */}
        <div className="w-full h-1 bg-gray-200">
          <div className={`h-1 bg-primary transition-all duration-500 ${step === 1 ? "w-1/2" : "w-full"}`}></div>
        </div>
        
        <div className="text-center mt-4">
          <h2 className="text-lg sm:text-xl font-bold text-primary">
            {step === 1 ? "Get Reset Token" : "Reset Password"}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {step === 1 ? "Enter Your Email" : "Enter the verification token"}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          {step === 1 && (
            <Input
              icon={<Mail size={20} color="#99a1af" />}
              label="Email"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=""
            />
          )}
          {step === 2 && (
            <>
              <Input
                icon={<SquareAsterisk size={20} color="#99a1af" />}
                label="Verification Token"
                type="text"
                id="token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder=""
              />
              <Input
                icon={<KeyRound size={20} color="#99a1af" />}
                label="New Password"
                type="password"
                id="newPass"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder=""
              />
              <Input
                icon={<KeyRound size={20} color="#99a1af" />}
                label="Confirm Password"
                type="password"
                id="confirmPass"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder=""
              />
            </>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 rounded-md bg-black text-white font-medium hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-black"
          >
            {isLoading ? "Processing..." : step === 1 ? "Send" : "Change Password"}
          </button>
          
          {step === 1 && (
            <p className="text-sm text-center mt-4 cursor-pointer" onClick={() => setStep(2)}>
              Already Got a Token?
            </p>
          )}
          {step === 2 && (
            <p className="text-sm text-center mt-4 cursor-pointer" onClick={() => setStep(1)}>
              Didn't get a token?
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ForgotPass;

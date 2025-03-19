import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import avatar from "@multiavatar/multiavatar";
import {
  BookIcon,
  MailIcon,
  UserIcon,
  GraduationCapIcon,
} from "../../components/icons";
import { AuthContext } from "../../components/auth/AuthContext";
import { toast } from "react-toastify";
import { api } from "../../helpers/api";
import { CircleX, CloudUpload, Key, Pencil } from "lucide-react";

function Profile() {
  const { user, loadUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [branch, setBranch] = useState("");
  const [gradYear, setGradYear] = useState(new Date().getFullYear().toString());
  const [profileIcon, setProfileIcon] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      // Redirect to login if user is not logged in
      navigate("/login");
    } else {
      setFullName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  // For discarding changes if canceled
  const [oldFullName, setOldFullName] = useState(fullName);
  const [oldEmail, setOldEmail] = useState(email);

  useEffect(() => {
    const svgCode = avatar(fullName);
    setProfileIcon(svgCode);
  }, [fullName]);

  const handleEditClick = () => {
    if (!isEditing) {
      setOldFullName(fullName);
      setOldEmail(email);
      setIsEditing(true);
    } else {
      setFullName(oldFullName);
      setEmail(oldEmail);
      setIsEditing(false);
    }
  };

  const handleSaveClick = () => {
    api
      .post(`/user`, {
        name: fullName,
        email: email,
      })
      .then((res) => {
        if (res.data.ok) {
          toast.success("Profile updated successfully");
        } else {
          toast.error("Failed to update profile");
          console.error(res.data.message);
        }
      })
      .catch((err) => {
        toast.error("Failed to update profile");
        console.error(err);
      })
      .finally(() => {
        loadUser();
        setIsEditing(false);
      });
  };

  return (
    <div className="min-h-[80vh] w-screen flex items-center mt-[80px] pb-[80px]">
      <div className=" w-1/2 max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-[0px_35px_35px_rgba(0,0,0,0.4)]">
        <div className="w-full flex justify-center">
          <div
            className="h-[100px] w-[100px] self-center rounded-full overflow-hidden"
            dangerouslySetInnerHTML={{ __html: profileIcon }}
          ></div>
        </div>
        <div className="mb-4">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UserIcon />
            </div>
            <input
              id="name"
              name="name"
              placeholder="Rohan Sharma"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={!isEditing}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MailIcon />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="your.email@college.edu"
              value={email}
              disabled={!isEditing}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
              required
            />
          </div>
        </div>

        <div className="flex items-center font-roboto space-x-4 mt-4">
          <button
            type="button"
            onClick={handleEditClick}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
          >
            <span>
              {!isEditing ? <Pencil size={20} /> : <CircleX size={20} />}
            </span>
            <span>{isEditing ? "Cancel" : "Edit"}</span>
          </button>
          <button
            type="button"
            onClick={handleSaveClick}
            disabled={!isEditing}
            className={`px-4 py-2 text-white rounded-lg transition flex items-center gap-2 ${
              isEditing
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            <span>
              <CloudUpload size={20} />
            </span>
            Save
          </button>
          <Link
            to="/profile/changePass"
            className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-950 transition flex items-center gap-2"
          >
            <span>
              <Key size={20} />
            </span>
            Change Password
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Profile;

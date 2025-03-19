import { useContext, useEffect, useState } from "react";
import logo from "../assets/Images/logo.jpg";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import multiavatar from "@multiavatar/multiavatar/esm";
import { ProfileIcon, LogoutIcon } from "./icons";
import { AuthContext } from "./auth/AuthContext";
import { Bookmark, BookMarked, LayoutDashboard } from "lucide-react";
// import pi from '@/assets/Images/profile.png'

function Navbar() {
  // const [token, setToken] = useState(localStorage.getItem("token"));
  const { user, logout } = useContext(AuthContext);
  const [profileIcon, setProfileIcon] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      return;
    }
    let svgCode = multiavatar(user.name);
    setProfileIcon(svgCode);
  }, [user]);

  const handleBackdropClick = () => {
    setShowMenu(false);
  };

  return (
    <div className="h-[80px] grid grid-cols-2 z-2 bg-bg-1 items-center justify-items-center px-3 fixed top-0 left-0 right-0 text-2xl text-secondary font-bold">
      <div className="ml-5 justify-self-start flex items-center gap-2">
        <img className="h-[25px]" src={logo} alt="" />
        <span className="text-primary text-[18px] sm:text-[24px] font-normal">TLE Eliminators</span>
      </div>
      {!user && (
        <>
        <Link
          to={"/login"}
          className="justify-self-end mr-4 bg-primary text-bg-1 py-1 px-[10px] rounded-sm hover:scale-110 active:scale-90 transition-all text-xl font-normal"
          style={{ boxShadow: "4px 5px 5px rgba(0, 0, 0, .4)" }}
        >
          Sign In
        </Link>
        </>
      )}
      {user && (
        <div className="relative justify-self-end">
          <button
            className=" mr-4 rounded-full hover:scale-110 active:scale-90 transition-all text-xl h-[40px] w-[40px]"
            style={{ boxShadow: "4px 5px 5px rgba(0, 0, 0, .3)" }}
            onClick={() => setShowMenu(!showMenu)}
            dangerouslySetInnerHTML={{ __html: profileIcon }}
          ></button>
          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={handleBackdropClick}
              ></div>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  onClick={() => {
                    setShowMenu(false);
                    navigate("/profile");
                  }}
                >
                  <ProfileIcon />
                  Profile
                </button>
                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <LogoutIcon />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Navbar;

import { useEffect, useState } from "react";
import { FaShoppingBag, FaRegUser } from "react-icons/fa";
import { GiChocolateBar } from "react-icons/gi";
import Image from "../../assets/logo.webp";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { useDispatch, useSelector } from "react-redux";
import { calculateTotalQuantity } from "../redux/slices/cartSlice";
import { selectIsSpecialMember } from "../redux/slices/authSlice";

const Nav = () => {
  const [open, setOpen] = useState(false);
  const [drop, setDrop] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const totalQuantity = useSelector(state => state.cart.totalQuantity); // ✅ FIXED
  const isSpecialMember = useSelector(selectIsSpecialMember);

  useEffect(() => {
    dispatch(calculateTotalQuantity());
  }, [dispatch]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    localStorage.removeItem("isSpecialMember");

    signOut(auth)
      .then(() => {
        toast.success("Logout Successful");
        navigate("/login");
      })
      .catch(error => {
        toast.error(error.message);
      });
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const Links = [
    { name: "HOME", link: "/" },
    { name: "PRODUCT", link: "/product" },
    { name: "CONTACT", link: "/contact" },
  ];

  return (
    <nav className="sticky top-0 left-0 z-50 shadow-md w-full">
      <div
        className="md:flex items-center justify-between px-6 py-3"
        style={{ background: "linear-gradient(135deg, #ff99cc, #ffffff)" }}
      >
        {/* Logo */}
        <div className="cursor-pointer flex items-center">
          <Link to="/">
            <img
              src={Image}
              alt="CocoKart Logo"
              className="w-[12rem]"
              width="300"
              height="200"
            />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div
          onClick={() => setOpen(!open)}
          className="text-3xl absolute right-8 cursor-pointer md:hidden"
          style={{ top: "3.5rem" }}
        >
          <GiChocolateBar />
        </div>

        {/* Navigation Links */}
        <ul
          className={`md:flex md:items-center absolute md:static text-amber-600 bg-white md:bg-transparent z-50 left-0 w-full md:w-auto transition-all duration-500 ease-in-out ${
            open
              ? "top-24 opacity-100"
              : "-top-[500px] opacity-0 md:opacity-100"
          }`}
        >
          {Links.map((link, index) => (
            <li
              key={index}
              className="md:ml-8 lg:text-xl md:text-sm md:my-0 my-7 lg:mx-4 md:mx-2"
            >
              <NavLink
                to={link.link}
                className={({ isActive }) =>
                  `hover:text-gray-400 duration-500 uppercase ${
                    isActive ? "text-black" : "text-amber-600"
                  }`
                }
              >
                {link.name}
              </NavLink>
            </li>
          ))}

          {/* Special Member Dashboard */}
          {isSpecialMember && (
            <li className="md:ml-8 lg:text-xl md:text-sm md:my-0 my-7 mx-8">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `hover:text-gray-400 duration-500 uppercase ${
                    isActive ? "text-black" : "text-amber-600"
                  }`
                }
              >
                DASHBOARD
              </NavLink>
            </li>
          )}

          {/* Cart */}
          <li className="md:ml-8 text-xl md:my-0 my-7 mx-8 relative">
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `hover:text-gray-400 duration-500 ${
                  isActive ? "text-black" : "text-amber-600"
                }`
              }
            >
              <FaShoppingBag />
              {totalQuantity > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 rounded-full">
                  {totalQuantity}
                </span>
              )}
            </NavLink>
          </li>

          {/* User Dropdown */}
          <li className="md:ml-8 text-xl md:my-0 my-7 mx-8 relative">
            <button
              className="text-amber-600 font-semibold rounded inline-flex items-center"
              onClick={() => setDrop(!drop)}
            >
              <FaRegUser />
            </button>
            {drop && (
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg z-50">
                {auth.currentUser ? (
                  <button
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                ) : (
                  <button
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={handleLogin}
                  >
                    Login
                  </button>
                )}
              </div>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Nav;

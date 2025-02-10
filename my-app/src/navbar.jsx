import { NavLink } from "react-router-dom";
//import { Button } from "@/components/ui/button";
import "./navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
          Home
        </NavLink>
        <NavLink to="/users" className={({ isActive }) => isActive ? "active" : ""}>
          Users
        </NavLink>
        <NavLink to="/orders" className={({ isActive }) => isActive ? "active" : ""}>
          Orders
        </NavLink>
        <NavLink to="/books" className={({ isActive }) => isActive ? "active" : ""}>
          Books
        </NavLink>
        <NavLink to="/login" className={({ isActive }) => isActive ? "active" : ""}>
          Login
        </NavLink>
        <NavLink to="/cart" className={({ isActive }) => isActive ? "active" : ""}>
            Cart
        </NavLink>
        <NavLink to="/register" className={({ isActive }) => isActive ? "active" : ""}>
            Register
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
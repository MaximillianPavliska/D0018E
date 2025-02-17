import { NavLink, useNavigate } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("token") !== null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    if (location.pathname === "/") {
      window.location.reload(); // Refresh if already on home
    } else {
      navigate("/"); // Normal navigation for other routes
    }
  };

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
        <NavLink to="/cart" className={({ isActive }) => isActive ? "active" : ""}>
          Cart
        </NavLink>
        {isLoggedIn ? (
          <button 
            onClick={handleLogout}
            className="nav-link" // Add this if you need specific class handling
          >
            Logout
          </button>
        ) : (
          <NavLink to="/login" className={({ isActive }) => isActive ? "active" : ""}>
            Login
          </NavLink>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

import { NavLink, useNavigate } from "react-router-dom";
import "./navbar.css";

// JWT decoding helper
const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const decoded = token ? decodeToken(token) : null;
  const isAdmin = decoded?.role === "Admin";
  const isLoggedIn = !!token;

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
        {isAdmin && (
          <>
            <NavLink to="/users" className={({ isActive }) => isActive ? "active" : ""}>
              Users
            </NavLink>
            <NavLink to="/orders" className={({ isActive }) => isActive ? "active" : ""}>
              Orders
            </NavLink>
          </>
        )}
        <NavLink to="/books" className={({ isActive }) => isActive ? "active" : ""}>
          Books
        </NavLink>
        {isLoggedIn && (
        <NavLink to="/cart" className={({ isActive }) => isActive ? "active" : ""}>
          Cart
        </NavLink>
        )}
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

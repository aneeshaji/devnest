import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Navbar.css";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    setShowDropdown(false);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <span className="brand-icon">🪺</span>
            <span className="brand-text">DevNest</span>
          </Link>

          <div className="navbar-search">
            <input
              type="search"
              placeholder="Search articles..."
              className="search-input"
            />
          </div>

          <div className="navbar-actions">
            {isAuthenticated ? (
              <>
                <Link to="/write" className="btn btn-primary">
                  Write Article
                </Link>
                <div className="user-menu">
                  <button
                    className="user-avatar"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <img src={user.profilePicture} alt={user.username} />
                  </button>
                  {showDropdown && (
                    <div className="dropdown-menu">
                      <Link
                        to={`/@${user.username}`}
                        onClick={() => setShowDropdown(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/dashboard"
                        onClick={() => setShowDropdown(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setShowDropdown(false)}
                      >
                        Settings
                      </Link>
                      <hr />
                      <button onClick={handleLogout}>Logout</button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

import React from "react";
import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross2 } from "react-icons/rx";
import { useState, useContext } from "react";
import { UserContext } from "../context/userContext";

const Header = () => {
  const [isNavShowing, setIsNavShowing] = useState(
    window.innerWidth > 800 ? true : false
  );

  const {currentUser} = useContext(UserContext)

  const closeNavHandler = () => {
    if (window.innerWidth > 800) {
      setIsNavShowing(true);
    } else {
      setIsNavShowing(false);
    }
  };
  return (
    <nav>
      <div className="container nav_container">
        <Link to="/" className="nav_logo" onClick={closeNavHandler}>
          <img src={""} alt="Image" />
        </Link>
        {currentUser?.id && isNavShowing && (
          <ul className="nav_menu">
            <li>
              <Link to={`/profile/${currentUser.id}`}onClick={closeNavHandler}>{currentUser?.name}</Link>
            </li>
            <li>
              <Link to="/create" onClick={closeNavHandler}>Create Post</Link>
            </li>
            <li>
              <Link to="/author" onClick={closeNavHandler}>Author</Link>
            </li>
            <li>
              <Link to="/logout" onClick={closeNavHandler}>Logout</Link>
            </li>
          </ul>
        )}

{!currentUser?.id && isNavShowing && (
          <ul className="nav_menu">
            <li>
              <Link to="/author" onClick={closeNavHandler}>Author</Link>
            </li>
            <li>
              <Link to="/login" onClick={closeNavHandler}>Login</Link>
            </li>
          </ul>
        )}

        <button
          className="nav_toggle-btn"
          onClick={() => setIsNavShowing(!isNavShowing)}
        >
          {isNavShowing ? <RxCross2 /> : <GiHamburgerMenu />}
        </button>
      </div>
    </nav>
  );
};

export default Header;

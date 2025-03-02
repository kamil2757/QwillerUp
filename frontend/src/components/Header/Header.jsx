import styles from "./Header.module.scss";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState, useRef, useContext } from "react";
import UserContext from "../../contexts/UserContext";

function Header() {
  const location = useLocation().pathname;
  const [bMenuIsOpen, setBMenuIsOpen] = useState(false);
  const menuRef = useRef(null);
  const { authorized } = useContext(UserContext);
  const username = localStorage.username

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setBMenuIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        bMenuIsOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setBMenuIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [bMenuIsOpen]);

  return (
    <header ref={menuRef}>
      <h1>
        <Link to="/">QwillerUp</Link>
      </h1>
      {authorized && (
        <div className={styles.content}>
          <Link
            to="/main"
            className={
              location == "/" || location == "/main" ? styles.active : ""
            }
            onClick={() => setBMenuIsOpen(false)}
          >
            Задачи
          </Link>
          <Link
            to="/honor-board"
            className={location == "/honor-board" ? styles.active : ""}
            onClick={() => setBMenuIsOpen(false)}
          >
            Доска почёта
          </Link>
          <Link
            to="/profile"
            className={location == "/profile" ? styles.active : ""}
            onClick={() => setBMenuIsOpen(false)}
          >
            {username}
          </Link>
        </div>
      )}

      {!authorized && (
        <div className={styles.authentication}>
          <Link
            to="/login"
            className={location == "/login" ? styles.active : ""}
          >
            Войти
          </Link>
          <Link
            to="/registration"
            className={location == "/registration" ? styles.active : ""}
          >
            Зарегистрироваться
          </Link>
        </div>
      )}

      <div className={styles.burder_menu_block}>
        <div
          className={`${styles.burger} ${
            bMenuIsOpen && authorized ? styles.burger_open : ""
          }`}
          onClick={() => setBMenuIsOpen(!bMenuIsOpen)}
        >
          <div></div>
          <div></div>
          <div></div>
        </div>

        <div
          className={`${styles.burger_content} ${
            bMenuIsOpen ? styles.burger_content_open : ""
          }`}
          onClick={() => setBMenuIsOpen(false)}
        >
          <Link to="/main" className={location == "/main" ? styles.active : ""}>
            <p>Задачи</p>
          </Link>
          <Link
            to="/honor-board"
            className={location == "/honor-board" ? styles.active : ""}
          >
            <p>Доска почёта</p>
          </Link>
          <Link
            to="/profile"
            className={location == "/profile" ? styles.active : ""}
          >
            <p>Профиль</p>
          </Link>
          <Link
            to="/settings/profile"
            className={location == "/settings/profile" ? styles.active : ""}
          >
            <p>Настройки</p>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;

import styles from "./Header.module.scss";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState, useRef, useContext } from "react";
import UserContext from "../../contexts/UserContext";
import no_avatar from "../../assets/no_avatar.png";

function Header() {
  const location = useLocation().pathname;
  const [bMenuIsOpen, setBMenuIsOpen] = useState(false);
  const menuRef = useRef(null);
  const { userData, imageProfileSettings, authorized, loading, setLoading, protocol, domain, UpdateTokens, GetUser  } = useContext(UserContext);
  const avatarURL = userData?.photo ? userData.photo : no_avatar;

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setBMenuIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  async function getInfoAgain() {
    try {
      const response = await fetch(
        `${protocol}://${domain}/api/users/userInfo/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setUserData(data);
        setLoading(false);
        localStorage.getNewUserData = "false";
      } else {
        UpdateTokens(GetUser);
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  }

  // useEffect(() => {
  //   console.log('1')
  //   if (localStorage.getNewUserData == "true") {
  //     console.log('2 обновляем')
  //     getInfoAgain();
  //   }
  // }, [imageProfileSettings]);

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

      {!authorized && (
        <div className={styles.burder_menu_block_auth}>
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
        </div>
      )}

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
            to="/tracker"
            className={location == "/tracker" ? styles.active : ""}
            onClick={() => setBMenuIsOpen(false)}
          >
            <p>Трекер времени</p>
          </Link>
          <Link
            to="/honor-board"
            className={location == "/honor-board" ? styles.active : ""}
            onClick={() => setBMenuIsOpen(false)}
          >
            Доска почёта
          </Link>
          <div>
            <Link
              to="/profile"
              className={location == "/profile" ? styles.active : ""}
              onClick={() => setBMenuIsOpen(false)}
            >
              {userData.username}
              <img src={avatarURL} alt="" />
            </Link>
          </div>
        </div>
      )}

      {authorized && (
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
            <Link
              to="/main"
              className={location == "/main" ? styles.active : ""}
            >
              <p>Задачи</p>
            </Link>
            <Link
              to="/tracker"
              className={location == "/tracker" ? styles.active : ""}
            >
              <p>Трекер времени</p>
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
      )}
    </header>
  );
}

export default Header;

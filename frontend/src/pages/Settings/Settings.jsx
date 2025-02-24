import { useState, useEffect } from "react";
import styles from "./Settings.module.scss";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import ModalWindowLogout from "../../components/ModalWindowLogout/ModalWindowLogout";

function Settings() {
  const location = useLocation().pathname;
  const [isOpenLogout, setIsOpenLogout] = useState(false);
  const [isMini, setIsMini] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMini(window.innerWidth < 723);
    }

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function set_Active(path) {
    if (location == path) {
      return styles.active;
    }
  }

  return (
    <div className={styles.block_Settings}>
      {!isMini && (
        <nav className={styles.nav}>
          <Link to="profile" className={set_Active("/settings/profile")}>
            Редактирование профиля
          </Link>
          <Link to="tasks/format1" className={set_Active("/settings/tasks")}>
            Задачи
          </Link>
          <Link to="progress" className={set_Active("/settings/progress")}>
            Настройки учета прогресса
          </Link>
          <Link to="donate" className={set_Active("/settings/donate")}>
            Поддержать автора монеткой
          </Link>
          <div onClick={() => setIsOpenLogout(true)}>Выйти</div>
        </nav>
      )}

      {isMini && (
        <nav className={styles.nav}>
          <div className={styles.line1}>
            <Link to="profile" className={set_Active("/settings/profile")}>
              Редактирование профиля
            </Link>
            <Link to="tasks/format1" className={set_Active("/settings/tasks")}>
              Задачи
            </Link>
            <Link to="progress" className={set_Active("/settings/progress")}>
              Настройки учета прогресса
            </Link>
          </div>
          <div className={styles.line2}>
            <Link to="donate" className={set_Active("/settings/donate")}>
              Поддержать автора монеткой
            </Link>
            <div onClick={() => setIsOpenLogout(true)}>Выйти</div>
          </div>
        </nav>
      )}
      <div className={styles.mainBlock}>
        <div className={styles.content}>
          <Outlet></Outlet>
        </div>
      </div>
      <ModalWindowLogout
        isOpen={isOpenLogout}
        onClose={() => setIsOpenLogout(false)}
      ></ModalWindowLogout>
    </div>
  );
}

export default Settings;

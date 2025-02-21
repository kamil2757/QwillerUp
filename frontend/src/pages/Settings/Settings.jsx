import { useState } from "react";
import styles from "./Settings.module.scss";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import ModalWindowLogout from "../../components/ModalWindowLogout/ModalWindowLogout";

function Settings() {
  const location = useLocation().pathname;
  const [isOpenLogout, setIsOpenLogout] = useState(false);

  function set_Active(path) {
    if (location == path) {
      return styles.active;
    }
  }

  return (
    <div className={styles.block_Settings}>
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

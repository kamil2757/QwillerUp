import styles from "./Settings.module.scss";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";

function Settings() {
  const location = useLocation().pathname;

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
        <div>
          Выйти
        </div>
      </nav>
      <div className={styles.mainBlock}>
        <div className={styles.content}>
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
}

export default Settings;

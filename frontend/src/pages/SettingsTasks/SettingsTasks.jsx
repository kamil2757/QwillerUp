import styles from "./SettingsTasks.module.scss";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";

function SettingsTasks() {
  const location = useLocation().pathname;

  function set_Active(path) {
    if (location == path) {
      return styles.active;
    }
  }
  return (
    <div className={styles.block_settingsTasks}>
      <h1>Задачи</h1>
      <p>При создании нового плана на дни, текущая цель на день будет удалена и заменена на новые задачи</p>
      <nav className={styles.nav}>
        <Link to="format1" className={set_Active("/settings/tasks/format1")}>
          Постоянный план
        </Link>
        <Link to="format2" className={set_Active("/settings/tasks/format2")}>
          Гибкое расписание
        </Link>
      </nav>
      <div className={styles.content}>
        <Outlet></Outlet>
      </div>
    </div>
  );
}

export default SettingsTasks;

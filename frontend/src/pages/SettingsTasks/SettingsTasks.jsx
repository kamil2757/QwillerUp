import { useContext, useEffect, useState } from "react";
import styles from "./SettingsTasks.module.scss";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import UserContext from "../../contexts/UserContext";

function SettingsTasks() {
  const location = useLocation().pathname;
  const [tasks, setTasks] = useState(null);
  const { UpdateTokens, userData, domain, protocol } = useContext(UserContext);

  useEffect(() => {
    async function getTasks(params) {
      const response = await fetch(
        `${protocol}://${domain}/api/goals/get-tasks/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks)
        console.log(data);
      } else {
        UpdateTokens(getTasks);
      }
    }

    getTasks();
  }, []);

  function set_Active(path) {
    if (location == path) {
      return styles.active;
    }
  }
  if (tasks) {
    return (
      <div className={styles.block_settingsTasks}>
        <h1>Задачи</h1>
        <p>
          При создании нового плана на дни, текущая цель на день будет удалена и
          заменена на новые задачи
        </p>
        <nav className={styles.nav}>
          <Link to="format1" className={set_Active("/settings/tasks/format1")}>
            Постоянный план
          </Link>
          <Link to="format2" className={set_Active("/settings/tasks/format2")}>
            Гибкое расписание
          </Link>
        </nav>
        <div className={styles.content}>
          <Outlet context={{ tasks }}></Outlet>
        </div>
      </div>
    );
  }
}

export default SettingsTasks;

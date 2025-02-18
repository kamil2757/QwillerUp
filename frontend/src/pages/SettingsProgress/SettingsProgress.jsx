import styles from "./SettingsProgress.module.scss";
import { Link, NavLink } from "react-router-dom";
import Button from "../../components/Button/Button";
import arrow_down from "../../assets/arrow_down.svg";

function SettingsProgress() {
  return (
    <div className={styles.block_settingsProgress}>
      <h1>Настройки учета прогресса</h1>
      <form action="">
        <div className={styles.progressCheck}>
          <label htmlFor="progressCheck">Формат отображения времени</label>
          <div className={styles.select_block}>
            <select name="progressCheck" id="">
              <option value="hours_minutes">часы и минуты</option>
              <option value="minutes">только минуты</option>
            </select>
          </div>
        </div>
        <div className={styles.btn_block}>
          <Button>Применить</Button>
        </div>
      </form>
    </div>
  );
}

export default SettingsProgress;

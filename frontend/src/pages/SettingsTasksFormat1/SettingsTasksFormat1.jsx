import styles from "./SettingsTasksFormat1.module.scss";
import { Link, useLocation } from "react-router-dom";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import { useState } from "react";

function SettingsTasksFormat1() {
  const [taskVolume, setTaskVolume] = useState(2);
  const [TotalTime, setTotalTime] = useState({
    hours: 0,
    minutes: 0,
  });

  function handleChange(e) {
    if (taskVolume == e.target.parentElement.id) {
      setTaskVolume(taskVolume + 1);
    }

    if (taskVolume - 1 == e.target.parentElement.id && e.target.value == "") {
      setTaskVolume(taskVolume - 1);
    }
  }
  function handleChangeNumber(e) {
    const hours_arr = document.querySelectorAll(`.${styles.hours}`);
    const minutes_arr = document.querySelectorAll(`.${styles.minutes}`);

    let time_minutes = 0;
    hours_arr.forEach((item) => {
      if (item) {
        time_minutes += Number(item.firstElementChild.value) * 60;
        console.log(time_minutes);
      }
    });

    minutes_arr.forEach((item) => {
      if (item) {
        time_minutes += Number(item.firstElementChild.value);
        console.log(time_minutes);
      }
    });

    setTotalTime({
      hours: Math.floor(time_minutes / 60),
      minutes: time_minutes % 60,
    });
  }

  return (
    <div className={styles.block_settingsTasksFormat1}>
      <div className={styles.block_inputs}>
        {Array.from({ length: taskVolume }, (_, index) => (
          <div className={styles.field} key={index}>
            <div className={styles.input_task} id={index + 1}>
              <Input placeholder="Введите занятие" onChange={handleChange} />
            </div>

            <div className={styles.time_inputes}>
              <div className={styles.hours}>
                <Input
                  placeholder="0"
                  onChange={handleChangeNumber}
                  type="number"
                />
                <p>ч</p>
              </div>
              <div className={styles.minutes}>
                <Input
                  placeholder="0"
                  onChange={handleChangeNumber}
                  type="number"
                />
                <p>мин</p>
              </div>
            </div>
          </div>
        ))}

        <div className={styles.total_time}>
          Cуммарное время цели на каждый день: {TotalTime.hours}ч{" "}
          {TotalTime.minutes}мин
        </div>

        <Link to="/main">
          <Button width="100%">Создать новый план</Button>
        </Link>
      </div>
    </div>
  );
}

export default SettingsTasksFormat1;

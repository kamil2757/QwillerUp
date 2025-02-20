import styles from "./CreateFormat2.module.scss";
import { Link } from "react-router-dom";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import { useState } from "react";

function CreateFormat2() {
  const [taskVolume, setTaskVolume] = useState({
    Понедельник: 2,
    Вторник: 2,
    Среда: 2,
    Четверг: 2,
    Пятница: 2,
    Суббота: 2,
    Воскресенье: 2,
  });
  const [TotalTime, setTotalTime] = useState({
    Понедельник: { hours: 0, minutes: 0 },
    Вторник: { hours: 0, minutes: 0 },
    Среда: { hours: 0, minutes: 0 },
    Четверг: { hours: 0, minutes: 0 },
    Пятница: { hours: 0, minutes: 0 },
    Суббота: { hours: 0, minutes: 0 },
    Воскресенье: { hours: 0, minutes: 0 },
  });

  const week = [
    [1, "Понедельник"],
    [2, "Вторник"],
    [3, "Среда"],
    [4, "Четверг"],
    [5, "Пятница"],
    [6, "Суббота"],
    [7, "Воскресенье"],
  ];

  function handleChange(e, day_name) {
    if (taskVolume[day_name] == e.target.parentElement.className) {
      console.log(day_name);
      setTaskVolume((prevTaskVolume) => ({
        ...prevTaskVolume,
        [day_name]: prevTaskVolume[day_name] + 1,
      }));
    }

    if (
      taskVolume[day_name] - 1 == e.target.parentElement.className &&
      e.target.value == ""
    ) {
      setTaskVolume((prevTaskVolume) => ({
        ...prevTaskVolume,
        [day_name]: prevTaskVolume[day_name] - 1,
      }));
    }
  }

  function handleChangeNumber(day) {
    const hours_arr = document.querySelectorAll(`.hours${day[0]}`);
    const minutes_arr = document.querySelectorAll(`.minutes${day[0]}`);

    let time_minutes = 0;
    hours_arr.forEach((item) => {
      if (item) {
        time_minutes += Number(item.firstElementChild.value) * 60;
      }
    });

    minutes_arr.forEach((item) => {
      if (item) {
        time_minutes += Number(item.firstElementChild.value);
      }
    });

    setTotalTime((prevTotalTime) => ({
      ...prevTotalTime,
      [day[1]]: {
        hours: Math.floor(time_minutes / 60),
        minutes: time_minutes % 60,
      },
    }));
  }

  return (
    <div className={styles.block_createFormat1}>
      <div className={styles.content}>
        <h1>Гибкое расписание</h1>
        <p>
          Напиши в каждый день направления, которые хочешь изучать, и укажи,
          сколько времени готов уделять каждому из них
        </p>

        <div className={styles.days}>
          {week.map((day) => (
            <div className={styles.block_inputs} key={day[0]}>
              <p>{day[1]}</p>
              {Array.from({ length: taskVolume[day[1]] }, (_, index) => (
                <div className={styles.field} key={index}>
                  <div className={index + 1}>
                    <Input
                      placeholder="Введите занятие"
                      onChange={(e) => handleChange(e, day[1])}
                    />
                  </div>
                  <div className={`${styles.inp_time} hours${day[0]}`}>
                    <Input
                      placeholder="0"
                      onChange={() => handleChangeNumber(day)}
                      type="number"
                    />
                    <p>ч</p>
                  </div>
                  <div className={`${styles.inp_time} minutes${day[0]}`}>
                    <Input
                      placeholder="0"
                      onChange={() => handleChangeNumber(day)}
                      type="number"
                    />
                    <p>мин</p>
                  </div>
                </div>
              ))}

              <div className={styles.total_time}>
                Cуммарное время цели день: {TotalTime[day[1]].hours}ч{" "}
                {TotalTime[day[1]].minutes}
                мин
              </div>
            </div>
          ))}
        </div>
        <div className={styles.button_block}>
          <Link to="/main">
            <Button width="100%">Готова</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CreateFormat2;

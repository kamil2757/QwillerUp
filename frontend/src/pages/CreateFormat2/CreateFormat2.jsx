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
    hours: 0,
    minutes: 0,
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
                  <div className={`${styles.inp_time} ${styles.hours}`}>
                    <Input
                      placeholder="0"
                      onChange={handleChangeNumber}
                      type="number"
                    />
                    <p>ч</p>
                  </div>
                  <div className={`${styles.inp_time} ${styles.minutes}`}>
                    <Input
                      placeholder="0"
                      onChange={handleChangeNumber}
                      type="number"
                    />
                    <p>мин</p>
                  </div>
                </div>
              ))}

              <div className={styles.total_time}>
                Cуммарное время цели день: {TotalTime.hours}ч{" "}
                {TotalTime.minutes}
                мин
              </div>
            </div>
          ))}
        </div>
        <Link to='/main'>
          <Button width="1200px">Готова</Button>
        </Link>
      </div>
    </div>
  );
}

export default CreateFormat2;

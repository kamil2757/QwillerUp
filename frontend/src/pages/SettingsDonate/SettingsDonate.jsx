import styles from "./SettingsDonate.module.scss";
import { Link, NavLink } from "react-router-dom";
import Button from "../../components/Button/Button";
import { useState, useRef } from "react";

function SettingsDonate() {
  const refTextAbout = useRef(null);
  function changeTextAbout(num_text = 0) {
    if (num_text == 0) {
      refTextAbout.current.innerText =
        'Вам откроется доступ к интересным фактам и аналитике вашей продуктивности, а также уникальная медаль "Партнёр", которая подчеркнёт ваш вклад в развитие проекта!';
    } else if (num_text == 1) {
      refTextAbout.current.innerText =
        "Узнай свой самый продуктивный месяц — когда ты добился наибольших успехов и используй этот опыт для новых достижений!";
    } else if (num_text == 2) {
      refTextAbout.current.innerText =
        "Получи свою годовую карту продуктивности, узнай, в какие месяцы ты работал усерднее всего, а когда мог позволить себе немного расслабиться!";
    } else if (num_text == 3) {
      refTextAbout.current.innerText = `Получите уникальную медаль "Партнёр", которая будет подчёркивать вашу неоценимую помощь проекту и вклад в его развитие!`;
    } else if (num_text == 4) {
      refTextAbout.current.innerText = `Узнай свой самый долгий стрик — когда ты занимался каждый день без перерывов и достигал новых высот!`;
    } else if (num_text == 5) {
      refTextAbout.current.innerText = `Узнай, какой день был у тебя самым продуктивным! Может, ты посвятил 6, 8, а может, целых 10 часов на достижение своих целей?`;
    }
  }

  return (
    <div className={styles.block_settingsDonate}>
      <div className={styles.info}>
        <h1>Поддержать автора монеткой</h1>
        <p>
          QwillerUp – это не продукт крупной компании и не стартап с командой
          разработчиков. Этот сайт создал я один – обычный 10-классник, который
          хотел сделать что-то полезное для себя и других
        </p>
        <p>
          Если вам нравится QwillerUp и вы хотите, чтобы он развивался дальше,
          вы можете <span>поддержать проект монеткой</span>
        </p>
      </div>

      <div className={styles.donate_block}>
        <h1>Бонусы за поддержку</h1>
        <div className={styles.bonuses}>
          <div
            className={styles.bonus1}
            onMouseEnter={() => changeTextAbout(1)}
            onMouseLeave={() => changeTextAbout()}
          >
            <p>Твой самый продуктивный месяц</p>
          </div>
          <div
            className={styles.bonus2}
            onMouseEnter={() => changeTextAbout(2)}
            onMouseLeave={() => changeTextAbout()}
          >
            <p>Годовая карта продуктивности</p>
          </div>
          <div className={styles.bonus3}>
            <div
              className={styles.bonus3_1}
              onMouseEnter={() => changeTextAbout(3)}
              onMouseLeave={() => changeTextAbout()}
            >
              <p>Медаль “партнер”</p>
            </div>
            <div
              className={styles.bonus3_2}
              onMouseEnter={() => changeTextAbout(4)}
              onMouseLeave={() => changeTextAbout()}
            >
              <p>Твой самый долгий стрик</p>
            </div>
          </div>
          <div
            className={styles.bonus4}
            onMouseEnter={() => changeTextAbout(5)}
            onMouseLeave={() => changeTextAbout()}
          >
            <p>Самый продуктивный день</p>
          </div>
        </div>
        <div className={styles.about_bonuses}>
          <p ref={refTextAbout}>
            Вам откроется доступ к интересным фактам и аналитике вашей
            продуктивности, а также уникальная медаль "Партнёр", которая
            подчеркнёт ваш вклад в развитие проекта!
          </p>
        </div>
        <Button format={3}>Поддержать</Button>
      </div>
    </div>
  );
}

export default SettingsDonate;

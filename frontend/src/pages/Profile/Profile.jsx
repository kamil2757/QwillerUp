import styles from "./Profile.module.scss";
import no_avatar from "../../assets/no_avatar.png";
import experience from "../../assets/experience.svg";
import ice from "../../assets/ice.svg";
import flame from "../../assets/flame.svg";
import medal_1_1 from "../../assets/1.1.svg";
import medal_3_3 from "../../assets/3.3.svg";
import medal_2_2 from "../../assets/2.2.svg";
import settings from "../../assets/settings.svg";
import Button from "../../components/Button/Button";
import BarChartProfile from "../../components/BarChart/BarChart";
import { Link } from "react-router-dom";
import ModalWindowCheckLevel from "../../components/ModalWindowCheckLevel/ModalWindowCheckLevel";
import ModalWindowCheckMedals from "../../components/ModalWindowCheckMedals/ModalWindowCheckMedals";

import ProgressBar from "../../components/ProgressBar/ProgressBar";
import { useState } from "react";

function Profile() {
  const [modalLevelIsOpen, setModalLevelIsOpen] = useState(false);
  const [modalMedalsIsOpen, setModalMedalsIsOpen] = useState(false);

  return (
    <div className={styles.block_profile}>
      <div className={styles.block1_info}>
        <Link to="/settings/profile">
          <img src={settings} alt="" className={styles.settings} />
        </Link>
        <img src={no_avatar} alt="" className={styles.avatar} />
        <div className={styles.block1_info__info}>
          <h1>Kamil</h1>
          <p className={styles.aboutUser}>
            У тебя пока нет описания, но ты можешь добавить его в настройках
          </p>

          <p className={styles.level}>25 уровень</p>
          <div
            className={styles.experience_block}
            onClick={() => setModalLevelIsOpen(true)}
          >
            <img src={experience} alt="" />
            <ProgressBar percent="60" width="46vw" />
            <p>60/100</p>
          </div>
        </div>
      </div>
      <div className={styles.block2_info}>
        <div className={styles.fireStreak_info}>
          <div className={styles.items}>
            <div className={styles.flames}>
              <img src={flame} alt="" />
              <p>4</p>
            </div>
            <div className={styles.ice}>
              <img src={ice} alt="" />
              <p>1</p>
            </div>
          </div>
          <div className={styles.text}>
            Лед поможет тебе сохранить огненную серию, если ты будешь отдыхать.
            Ты можешь получать его за достижение нового уровня!
          </div>
        </div>
        <div className={styles.maininfo}>
          <div className={styles.medals}>
            <div className={styles.content}>
              <div className={styles.medal}>
                <img src={medal_1_1} alt="" />
                <p>Бронзовая медаль "Начало пути"</p>
              </div>
              <div className={styles.medal}>
                <img src={medal_3_3} alt="" />
                <p>Золотая медаль "Неутомимый"</p>
              </div>
              <div className={styles.medal}>
                <img src={medal_2_2} alt="" />
                <p>Серебряная медаль "Пламя" </p>
              </div>
            </div>
            <Button
              width="100%"
              format={2}
              onClick={() => setModalMedalsIsOpen(true)}
            >
              Медали
            </Button>
          </div>
          <div className={styles.chart}>
            <div className={styles.chart_wrapper}>
              <BarChartProfile />
            </div>
          </div>
        </div>
      </div>

      <ModalWindowCheckLevel
        isOpen={modalLevelIsOpen}
        onClose={() => setModalLevelIsOpen(false)}
      ></ModalWindowCheckLevel>

      <ModalWindowCheckMedals
        isOpen={modalMedalsIsOpen}
        onClose={() => setModalMedalsIsOpen(false)}
      ></ModalWindowCheckMedals>
    </div>
  );
}

export default Profile;

import styles from "./Profile.module.scss";
import no_avatar from "../../assets/no_avatar.png";
import experience from "../../assets/experience.svg";
import ice from "../../assets/ice.svg";
import flame from "../../assets/flame.svg";
import medal_1_1 from "../../assets/1.1.svg";
import medal_1_2 from "../../assets/1.2.svg";
import medal_1_3 from "../../assets/1.3.svg";

import medal_2_1 from "../../assets/2.1.svg";
import medal_2_2 from "../../assets/2.2.svg";
import medal_2_3 from "../../assets/2.3.svg";

import medal_3_1 from "../../assets/3.1.svg";
import medal_3_2 from "../../assets/3.2.svg";
import medal_3_3 from "../../assets/3.3.svg";

import medal_4_1 from "../../assets/4.1.svg";
import settings from "../../assets/settings.svg";
import Button from "../../components/Button/Button";
import BarChartProfile from "../../components/BarChart/BarChartProfile";
import { Link } from "react-router-dom";
import ModalWindowCheckLevel from "../../components/ModalWindowCheckLevel/ModalWindowCheckLevel";
import ModalWindowCheckMedals from "../../components/ModalWindowCheckMedals/ModalWindowCheckMedals";

import ProgressBar from "../../components/ProgressBar/ProgressBar";
import { useContext, useEffect, useState } from "react";
import UserContext from "../../contexts/UserContext";

function Profile() {
  const [modalLevelIsOpen, setModalLevelIsOpen] = useState(false);
  const [modalMedalsIsOpen, setModalMedalsIsOpen] = useState(false);
  const [adaptive, setAdaptive] = useState(false);
  const { UpdateTokens, userData } = useContext(UserContext);
  const [userDetailData, setUserDetailData] = useState(null);
  const medals = {
    "1.1.svg": medal_1_1,
    "1.2.svg": medal_1_2,
    "1.3.svg": medal_1_3,

    "2.1.svg": medal_2_1,
    "2.2.svg": medal_2_2,
    "2.3.svg": medal_2_3,

    "3.1.svg": medal_3_1,
    "3.2.svg": medal_3_2,
    "3.3.svg": medal_3_3,

    "4.1.svg": medal_4_1,
  };

  async function GetDetailInfoUser() {
    const response = await fetch(
      "http://127.0.0.1:8000/api/users/detailUserInfo/",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log("data:");
      console.log(data);
      setUserDetailData(data);
    } else {
      UpdateTokens(GetDetailInfoUser);
    }
  }
  useEffect(() => {
    GetDetailInfoUser();
  }, []);

  useEffect(() => {
    console.log("userDetailData:");
    console.log(userDetailData);
  }, [userDetailData]);

  useEffect(() => {
    function handleResize() {
      setAdaptive(window.innerWidth <= 1035);
    }

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!modalMedalsIsOpen) {
      GetDetailInfoUser();
    }
  }, [modalMedalsIsOpen]);

  if (!userDetailData) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.block_profile}>
      <div className={styles.block1_info}>
        <div className={styles.settings}>
          <Link to="/settings/profile">
            <img src={settings} alt="" />
          </Link>
        </div>
        <div className={styles.avatar}>
          <img src={no_avatar} alt="" />
        </div>
        <div className={styles.block1_info__info}>
          <h1>{userData.username}</h1>
          <p className={styles.aboutUser}>
            {userData.description
              ? userData.description
              : "У тебя пока нет описания, но ты можешь добавить его в настройках"}
          </p>

          {/* <p className={styles.level}>{userData.level} уровень</p>
          <div
            className={styles.experience_block}
            onClick={() => setModalLevelIsOpen(true)}
          >
            <img src={experience} alt="" />
            <div className={styles.brogressBar_block}>
              <ProgressBar percent="60" width="100%" />
            </div>
            <p>60/100</p>
          </div> */}
        </div>
      </div>
      <div className={styles.block2_info}>
        <div className={styles.fireStreak_info}>
          <div className={styles.items}>
            <div className={styles.flames}>
              <img src={flame} alt="" />
              <p>{userDetailData.streak_count}</p>
            </div>
            <div className={styles.ice}>
              <img src={ice} alt="" />
              <p>{userDetailData.ice_count}</p>
            </div>
          </div>
          <div className={styles.text}>
            Лед поможет тебе сохранить огненную серию, если ты будешь отдыхать.
            Ты можешь получать его за достижение нового уровня!
          </div>
        </div>
        <div className={styles.maininfo}>
          <div
            className={styles.medals}
            onClick={() => {
              adaptive ? setModalMedalsIsOpen(true) : "";
            }}
          >
            <div className={styles.content}>
              {userDetailData.medals.map((medal) => (
                <div className={styles.medal} key={medal.id}>
                  <img src={medals[medal.img]} alt={medal.title} />
                  <p>{medal.title}</p>
                </div>
              ))}
            </div>
            {!adaptive && (
              <Button
                width="100%"
                format={2}
                onClick={() => setModalMedalsIsOpen(true)}
              >
                Медали
              </Button>
            )}
          </div>
          <div className={styles.chart}>
            <div className={styles.chart_wrapper}>
              <BarChartProfile data={userDetailData.days} />
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

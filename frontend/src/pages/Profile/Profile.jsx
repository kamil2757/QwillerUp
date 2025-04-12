import styles from "./Profile.module.scss";
import no_avatar from "../../assets/no_avatar.png";
import experience from "../../assets/experience.svg";
import ice from "../../assets/ice.svg";
import flame from "../../assets/flame.svg";
import extinct_flame from "../../assets/extinct_flame.svg";
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
import ModalWindowNewMedal from "../../components/ModalWindowNewMedal/ModalWindowNewMedal";

import ProgressBar from "../../components/ProgressBar/ProgressBar";
import { useContext, useEffect, useState } from "react";
import UserContext from "../../contexts/UserContext";
import ContentLoader from "react-content-loader";

function Profile() {
  const [modalLevelIsOpen, setModalLevelIsOpen] = useState(false);
  const [modalMedalsIsOpen, setModalMedalsIsOpen] = useState(false);
  const [modalNewMedalIsOpen, setModalNewMedalIsOpen] = useState(false);
  const [adaptive, setAdaptive] = useState(false);
  const { UpdateTokens, userData, domain, protocol, authorized } = useContext(UserContext);
  const [userDetailData, setUserDetailData] = useState(null);
  const [newMedal, setNewMedal] = useState();
  const avatarURL = userData.photo ? userData.photo : no_avatar;
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
      `${protocol}://${domain}/api/users/detailUserInfo/`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      setUserDetailData(data);
      setModalNewMedalIsOpen(Boolean(data.new_medal));
      setNewMedal(data.new_medal);
    } else {
      UpdateTokens();
    }
  }
  useEffect(() => {
    if (authorized == true) {
      GetDetailInfoUser();
    }
  }, []);

  useEffect(() => {
    function handleResize() {
      setAdaptive(window.innerWidth <= 1035);
    }

    handleResize();

    window.addEventListener("resize", handleResize);
    console.log(userData.photo);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!userDetailData) {
    if (adaptive) {
      return (
        <div className={styles.ContentLoaderBlock}>
          <ContentLoader
            speed={1.5}
            width="100%"
            height="100vh"
            viewBox="0 0 100% 100%"
            backgroundColor="#2f3864"
            foregroundColor="#6876bb"
            style={{ width: "100%", height: "100vh" }}
          >
            {/* <rect x="18%" y="60%" rx="0" ry="0" width="1%" height="0" /> */}
            <rect x="0%" y="2%" rx="30" ry="30" width="100%" height="23%" />
            <rect x="0%" y="26%" rx="20" ry="20" width="100%" height="8%" />
            <rect x="0%" y="35%" rx="20" ry="20" width="100%" height="15%" />
            <rect x="0%" y="51%" rx="16" ry="16" width="100%" height="4%" />
            <rect x="0%" y="56%" rx="20" ry="20" width="100%" height="20%" />
          </ContentLoader>
        </div>
      );
    } else {
      return (
        <div className={styles.ContentLoaderBlock}>
          <ContentLoader
            speed={1.5}
            width="100%"
            height="100vh"
            viewBox="0 0 100% 100%"
            backgroundColor="#2f3864"
            foregroundColor="#6876bb"
            style={{ width: "100%", height: "100vh" }}
          >
            {/* <rect x="18%" y="5%" rx="0" ry="0" width="1%" height="0" /> */}
            <rect x="0%" y="2%" rx="60" ry="60" width="100%" height="38%" />
            <rect x="0%" y="42%" rx="20" ry="20" width="100%" height="10%" />
            <rect x="0%" y="54%" rx="20" ry="20" width="44%" height="26%" />
            <rect x="45%" y="54%" rx="20" ry="20" width="55%" height="34%" />
            <rect x="0%" y="82%" rx="20" ry="20" width="44%" height="6%" />
          </ContentLoader>
        </div>
      );
    }
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
          <img src={avatarURL} alt="" />
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
              {userDetailData?.streak_active && <img src={flame} alt="" />}
              {!userDetailData?.streak_active && (
                <img src={extinct_flame} alt="" />
              )}
              <p>{userDetailData.streak_count}</p>
            </div>
            <div className={styles.ice}>
              <img src={ice} alt="" />
              <p>{userDetailData.ice_count}</p>
            </div>
          </div>
          <div className={styles.text}>
            Лед поможет тебе сохранить огненную серию
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
              {userDetailData.medals.length > 0 ? (
                userDetailData.medals.map((medal) => (
                  <div className={styles.medal} key={medal.id}>
                    <img src={medals[medal.img]} alt={medal.title} />
                    <p>{medal.title}</p>
                  </div>
                ))
              ) : (
                <div className={styles.text_withoutMedals}>
                  У тебя ещё нет медалей, но всё впереди! Будь активным
                  пользователем QwillerUp, достигай своих целей и зарабатывай
                  заслуженные награды!
                </div>
              )}
            </div>
            <div className={styles.btn_block}>
              <Button
                width="100%"
                format={2}
                onClick={() => setModalMedalsIsOpen(true)}
              >
                Медали
              </Button>
            </div>
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
      <ModalWindowNewMedal
        isOpen={modalNewMedalIsOpen}
        onClose={() => setModalNewMedalIsOpen(false)}
        medal_data={newMedal}
      ></ModalWindowNewMedal>
    </div>
  );
}

export default Profile;

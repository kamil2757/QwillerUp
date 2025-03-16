import styles from "./SettingsProfile.module.scss";
import { Link, NavLink } from "react-router-dom";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { useContext, useState } from "react";
import no_avatar from "../../assets/no_avatar.png";
import UserContext from "../../contexts/UserContext";

function SettingsProfile() {
  const { UpdateTokens, userData, domain } = useContext(UserContext);
  const [nickname, setNickname] = useState(userData.username);
  const [about, setAbout] = useState(userData.description);
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  async function handlerSubmit(e) {
    e.preventDefault();

    async function editUserInfo() {
      try {
        const response = await fetch(
          `http://${domain}/api/users/editUserInfo/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            body: JSON.stringify({
              username: nickname.trim(),
              about: about.trim(),
            }),
          }
        );

        const data = await response.json();

        console.log(data);

        if (data["message"] && !response.ok) {
          setError(data["message"]);
        } else if (!response.ok) {
          UpdateTokens();
        } else {
          setSuccess(data["message"]);
        }
      } catch (err) {
        console.log(err);
      }
    }

    editUserInfo();
  }

  return (
    <div className={styles.block_settingsProfile}>
      <h1>Редактирование профиля</h1>
      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}
      <form action="" onSubmit={handlerSubmit}>
        <div className={styles.nickname}>
          <p>Ваш никнейм</p>
          <Input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>
        <div className={styles.about}>
          <p>О вас</p>
          <Input
            type="textarea"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          />
        </div>
        <div className={styles.avatar}>
          {/* <p>Аватарка</p> */}
          {/* <div className={styles.changeAvatar_block}>
            <div className={styles.content}>
              <input
                type="file"
                className={styles.avatarUpload}
                accept="image/*"
                id="avatarUpload_id"
                onChange={handleFileChange}
              />
              <img src={image ? image : no_avatar} alt="" />
              <div className={styles.btns_avatar}>
                <label
                  htmlFor="avatarUpload_id"
                  className={styles.avatarButton}
                >
                  Выбрать фото
                </label>
                {image ? <p onClick={() => setImage(null)}>Сбросить</p> : <p className={styles.blocked}>Сбросить</p>}
              </div>
            </div>
          </div> */}
        </div>
        <Button>Применить</Button>
      </form>
    </div>
  );
}

export default SettingsProfile;

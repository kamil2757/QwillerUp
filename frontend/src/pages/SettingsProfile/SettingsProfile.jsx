import styles from "./SettingsProfile.module.scss";
import { Link, NavLink } from "react-router-dom";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { useState } from "react";
import no_avatar from "../../assets/no_avatar.png";

function SettingsProfile() {
  const [nickname, setNickname] = useState("Kamil");
  const [about, setAbout] = useState(
    "У тебя пока нет описания, но ты можешь добавить его в настройках"
  );
  const [image, setImage] = useState(null);
  
  function handleFileChange(event){
    const file = event.target.files[0]
    if (file){
      const reader = new FileReader()
      reader.onload = () => {
        setImage(reader.result)
      };
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className={styles.block_settingsProfile}>
      <h1>Редактирование профиля</h1>
      <form action="">
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
          <p>Аватарка</p>
          <div className={styles.changeAvatar_block}>
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
          </div>
        </div>
        <Button>Применить</Button>
      </form>
    </div>
  );
}

export default SettingsProfile;

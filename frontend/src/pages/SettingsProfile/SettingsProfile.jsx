import styles from "./SettingsProfile.module.scss";
import { Link, NavLink } from "react-router-dom";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { useContext, useEffect, useState } from "react";
import no_avatar from "../../assets/no_avatar.png";
import UserContext from "../../contexts/UserContext";

function SettingsProfile() {
  const {
    UpdateTokens,
    userData,
    domain,
    protocol,
    authorized,
    setFileProfileSettings,
    fileProfileSettings,
    imageProfileSettings,
    setImageProfileSettings,
  } = useContext(UserContext);
  const [nickname, setNickname] = useState(
    localStorage.inpUsername ? localStorage.inpUsername : userData.username
  );
  const [about, setAbout] = useState(
    localStorage.inpAbout ? localStorage.inpAbout : userData.description
  );
  const [image, setImage] = useState(imageProfileSettings);
  const [file, setFile] = useState(fileProfileSettings);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [deletePhoto, setDeletePhoto] = useState(false);
  const [avatarURL, setAvatarURL] = useState(
    userData.photo ? userData.photo : no_avatar
  );

  function handleFileChange(event) {
    setDeletePhoto(false);
    const selectedFile = event.target.files[0];

    const correct_photoTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];
    if (!correct_photoTypes.includes(selectedFile.type)) {
      setError("Недопустимый формат фото. Разрешены JPG, PNG и WebP");
      return;
    } else if (selectedFile.size > 5 * 1024 * 1024) {
      console.log(selectedFile.size);
      setError("Файл слишком большой. Максимум 5MB");
    } else {
      setError(null);
    }

    console.log(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        setFile(selectedFile);
      };
      reader.readAsDataURL(selectedFile);
    }
  }

  function handleDeletePhoto() {
    setImage(null);
    setAvatarURL(no_avatar);
    setFile(null);
    setDeletePhoto(true);
  }

  async function editUserInfo() {
    try {
      const formData = new FormData();
      formData.append("username", nickname.trim());
      formData.append("about", about.trim());
      formData.append("deletePhoto", deletePhoto);
      if (file) {
        console.log(file);
        formData.append("photo", file);
      }
      const response = await fetch(
        `${protocol}://${domain}/api/users/editUserInfo/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      console.log(data);

      if (data["message"] && !response.ok) {
        setError(data["message"]);
        setSuccess(null);
      } else if (!response.ok) {
        localStorage.setItem("inpUsername", nickname);
        localStorage.setItem("inpAbout", about);
        setFileProfileSettings(file);
        setImageProfileSettings(image);
        UpdateTokens();
      } else {
        setError(null);
        setSuccess(data["message"]);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function handlerSubmit(e) {
    e.preventDefault();
    await editUserInfo();
  }

  useEffect(() => {
    if (localStorage.inpUsername && localStorage.inpAbout) {
      console.log("Еще разок");
      localStorage.removeItem("inpUsername");
      localStorage.removeItem("inpAbout");
      setFileProfileSettings(null);
      setImageProfileSettings(null)
      editUserInfo();
    }
  }, []);

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
          <p>Аватарка</p>
          <div className={styles.changeAvatar_block}>
            <div className={styles.content}>
              <input
                type="file"
                className={styles.avatarUpload}
                accept="image/jpeg,image/jpg,image/png,image/webp"
                id="avatarUpload_id"
                onChange={handleFileChange}
              />
              <img
                src={image ? image : avatarURL ? avatarURL : no_avatar}
                alt=""
              />
              <div className={styles.btns_avatar}>
                <label
                  htmlFor="avatarUpload_id"
                  className={styles.avatarButton}
                >
                  Выбрать фото
                </label>
                <p onClick={handleDeletePhoto}>Сбросить</p>
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

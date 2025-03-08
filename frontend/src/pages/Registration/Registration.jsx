import styles from "./Registration.module.scss";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import UserContext from "../../contexts/UserContext";

function Registration() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [blockedButton, setBlockedButton] = useState(true);
  const { setUserData, setAuthorized, authorized } = useContext(UserContext);
  const [error, setError] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    setBlockedButton(!(username && email && password && password2));
  }, [username, password, password2, email]);

  async function RegistrationUser(e) {
    e.preventDefault();

    if (!(username || password || password2 || email)) {
      setError("Все поля обязательны для заполнения");
      return;
    }
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/users/register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username.trim(),
            email: email.trim(),
            password: password.trim(),
            password2: password2.trim(),
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        const userData = data.data
        console.log(data)
        setUserData(userData);
        for (let key in userData) {
          localStorage.setItem(key, userData[key]);
        }
        localStorage.setItem("access_token", data.access_token)
        localStorage.setItem("refresh_token", data.refresh_token)
        console.log(authorized)
        navigate("/choose-format");
        await setAuthorized(true);
      } else {
        console.log(data);
        setError(
          data.email?.[0]
            ? data.email?.[0]
            : data.username?.[0]
            ? data.username?.[0]
            : data.password?.[0]
            ? data.password?.[0]
            : data.password2?.[0]
            ? data.password2?.[0]
            : data.detail || data.non_field_errors?.[0] || "Ошибка авторизации"
        );
      }
    } catch (err) {
      console.log(err);
      setError("Ошибка соединения с сервером. Проверьте интернет.");
    }
  }

  return (
    <section className={styles.registration_block}>
      <div className={styles.content}>
        <h1>Регистрация</h1>
        <form action="" onSubmit={RegistrationUser}>
          <div>
            {error && <div className={styles.error}>{error}</div>}
            <p>Никнейм</p>
            <Input
              placeholder="Никнейм пользователя"
              type="username"
              autoComplete="off"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              value={username}
            />
          </div>
          <div>
            <p>Эл-почта</p>
            <Input
              placeholder="Электронная почта"
              type="email"
              autoComplete="off"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
            />
          </div>
          <div>
            <p>Пароль</p>
            <Input
              placeholder="password"
              type="password"
              autoComplete="new-password"
              name="new-password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
          <div>
            <p>Проверка пароля</p>
            <Input
              placeholder="Повторите свой пароль"
              type="password"
              autoComplete="off"
              onChange={(e) => {
                setPassword2(e.target.value);
              }}
              value={password2}
            />
          </div>
          <div className={styles.btn_block}>
            <Button blocked={blockedButton} width="100%">
              Зарегистрироваться
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Registration;

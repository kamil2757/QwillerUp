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
  const { setUserData } = useContext(UserContext);
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
            username: username,
            email: email,
            password: password,
            password2: password2,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        console.log(data);
        setUserData(data);
        for (let key in data) {
          localStorage.setItem(key, data[key]);
        }
        navigate("/main");
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
              name="username"
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
              name="email"
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
              name="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              value={password}
            />
          </div>
          <div>
            <p>Проверка пароля</p>
            <Input
              placeholder="Повторите свой пароль"
              name="password2"
              onChange={(e) => {
                setPassword2(e.target.value);
              }}
              value={password2}
            />
          </div>
          <div className={styles.btn_block}>
            <Button blocked={blockedButton} width="100%">
              Войти
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Registration;

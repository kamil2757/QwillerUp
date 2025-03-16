import styles from "./Login.module.scss";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserContext from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [blockedButton, setBlockedButton] = useState(true);
  const { setUserData, setAuthorized, authorized, domain } = useContext(UserContext);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!username || !password) {
      setError("Оба поля обязательны для заполнения");
      setBlockedButton(true);
      return;
    }

    try {
      const response = await fetch(`https://${domain}/api/users/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setUserData(data);
        for (let key in data) {
          localStorage.setItem(key, data[key]);

          if (key == "access") {
            localStorage.setItem('access_token', data[key]);
          }
          if (key == "refresh") {
            localStorage.setItem('refresh_token', data[key]);
          }
        }
        await setAuthorized(true);
        navigate("/main");
      } else {
        setError(
          data.detail || data.non_field_errors?.[0] || "Ошибка авторизации"
        );
      }
    } catch (err) {
      setError("Ошибка соединения с сервером. Попробуйте еще раз.");
    }
  }

  return (
    <section className={styles.login_block}>
      <div className={styles.content}>
        <h1>Вход</h1>
        <form onSubmit={handleSubmit} autoComplete="off">
          {error && <div className={styles.error}>{error}</div>}
          <div>
            <p>Никнейм</p>
            <Input
              placeholder="Никнейм пользователя"
              type="username"
              onChange={(e) => {
                setUsername(e.target.value);
                setBlockedButton(e.target.value && password ? false : true);
              }}
              value={username}
            />
          </div>
          <div>
            <p>Пароль</p>
            <Input
              placeholder="Пароль пользователя"
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
                setBlockedButton(username && e.target.value ? false : true);
              }}
              value={password}
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

export default Login;

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
  const { setUserData } = useContext(UserContext);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!username || !password) {
      setError("Оба поля обязательны для заполнения");
      setBlockedButton(true);
      return;
    }

    console.log("login");
    try {
      const response = await fetch("http://127.0.0.1:8000/api/users/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setUserData(data);
        console.log(data);
        for (let key in data) {
          localStorage.setItem(key, data[key]);
        }
        navigate("/main");
      } else {
        setError(data.non_field_errors[0]);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className={styles.login_block}>
      <div className={styles.content}>
        <h1>Вход</h1>
        <form onSubmit={handleSubmit}>
          {error && <div className={styles.error}>{error}</div>}
          <div>
            <p>Никнейм</p>
            <Input
              placeholder="Никнейм пользователя"
              name="username"
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
              name="password"
              onChange={(e) => {
                setPassword(e.target.value);
                setBlockedButton(username && e.target.value ? false : true);
              }}
              value={password}
            />
          </div>
          <div className={styles.btn_block}>
            <Button blocked={blockedButton} width="100%" typr="submit">
              Войти
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;

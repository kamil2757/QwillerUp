import styles from "./Login.module.scss";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className={styles.login_block}>
      <div className={styles.content}>
        <h1>Вход</h1>
        <form action="">
          <div className={styles.error}>Ошибка</div>
          <div>
            <p>Никнейм</p>
            <Input
              placeholder="Никнейм пользователя"
              name="username"
              onChange={handleChange}
              value={formData.username}
            />
          </div>
          <div>
            <p>Пароль</p>
            <Input
              placeholder="Пароль пользователя"
              name="password"
              onChange={handleChange}
              value={formData.password}
            />
          </div>
          <div className={styles.btn_block}>
            <Link to='/choose-format'>
              <Button blocked={true} width="100%">Войти</Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;

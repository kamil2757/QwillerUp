import styles from "./Registration.module.scss";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import UserContext from "../../contexts/UserContext";

function Registration() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });
  const {setUserData} = useContext(UserContext);
  const [error, setError] = useState(null)
 
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  async function RegistrationUser() {
    console.log("register");
    try {
      const response = await fetch("http://127.0.0.1:8000/api/users/register/", {
        method: "POST",
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          password2: formData.password2
        }),
      });
      const data = await response.json();
      console.log(data)
      setUserData(data)
      for (let key in data){
        localStorage.setItem(key, data[key])
      }
    } catch (err) {
      console.log('error: ' + err);
    }
  }

  return (
    <div className={styles.registration_block}>
      <div className={styles.content}>
        <h1>Регистрация</h1>
        <form action="">
          <div>
            <div className={styles.error}>Ошибка</div>
            <p>Никнейм</p>
            <Input
              placeholder="Никнейм пользователя"
              name="username"
              onChange={handleChange}
              value={formData.username}
            />
          </div>
          <div>
            <p>Эл-почта</p>
            <Input
              placeholder="Электронная почта"
              name="email"
              onChange={handleChange}
              value={formData.email}
            />
          </div>
          <div>
            <p>Пароль</p>
            <Input
              placeholder="password"
              name="password"
              onChange={handleChange}
              value={formData.password}
            />
          </div>
          <div>
            <p>Проверка пароля</p>
            <Input
              placeholder="Повторите свой пароль"
              name="password2"
              onChange={handleChange}
              value={formData.password2}
            />
          </div>
          <div className={styles.btn_block}>
            <Link to='/choose-format'>
              <Button width="100%" onClick={() => RegistrationUser()}>Зарегистрироваться</Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Registration;

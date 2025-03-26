import { Link } from "react-router-dom";
import styles from "./Footer.module.scss";

function Footer() {
  return (
    <div className={styles.footer_block}>
      <div className={styles.copyright}>
        <p>© 2025 QwillerUp</p>
      </div>
      <div className={styles.info_block}>
        <div>
          <a href="#about">О проекте</a>
          <a href="https://t.me/ia_kamil" target="_blank">
            Связаться
          </a>
        </div>
        <div>
          <a href="https://www.youtube.com/@dip2986/videos" target="_blank">
            Youtube-канал
          </a>
          <a href="https://t.me/hzchotytpisat_Dip" target="_blank">
            Telegram-канал
          </a>
        </div>
        <div>
          <Link
            to="/settings/profile"
          >
            <p>Настройки</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Footer;

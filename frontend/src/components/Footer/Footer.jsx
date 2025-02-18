import styles from './Footer.module.scss'

function Footer(){
    return (
        <div className={styles.footer_block}>
            <div className={styles.copyright}>
                <p>© 2025 LearnUp</p>
            </div>
            <div className={styles.info_block}>
                <div>
                    <a href='#about'>О проекте</a>
                    <a href='https://t.me/ia_kamil' target="_blank">Связаться</a>
                </div>
                <div>
                    <a href='https://www.youtube.com/@dip2986/videos' target="_blank">Youtube-канал</a>
                    <a href='https://t.me/hzchotytpisat_Dip' target="_blank">Telegram-канал</a>
                </div>
                <div>
                    <a href='' target="_blank">Настройки</a>
                </div>
            </div>
        </div>
    )
}

export default Footer
import React from 'react';
import style from './NotActive.module.css';
import { useTranslation} from 'react-i18next';


const NotActive = () => {
    const { t, i18n } = useTranslation();

    return (
        <div className={style.NotActive}>
            <h1>🗺️ {t('global.name')}</h1>
            <p className={style.info}>
                {t('500.dev')}
                <br />
                Follow <a href={`http://${t('global.info_page')}`}>{t('global.info_page')}</a> to see updates.
            </p>
        </div>
    );
}

export default NotActive;

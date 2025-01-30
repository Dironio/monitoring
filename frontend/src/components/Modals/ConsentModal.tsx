import { useState, useEffect } from 'react';
import './ConsentModal.css';

const ConsentModal = () => {
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const hasConsented = localStorage.getItem('userConsent');
        if (!hasConsented) {
            setShowModal(true);
        }
    }, []);

    const handleConsent = () => {
        localStorage.setItem('userConsent', 'true');
        setShowModal(false);
    };

    if (!showModal) return null;

    return (
        <div className="consent-modal-overlay">
            <div className="consent-modal">
                <div className="consent-modal-content">
                    <h2 className="consent-modal-title">Уведомление о конфиденциальности</h2>
                    <div className="consent-modal-text">
                        <p>
                            Мы заботимся о вашей конфиденциальности и хотим быть максимально прозрачными
                            в вопросах обработки ваших данных. Используя этот сайт, вы соглашаетесь
                            с обработкой ваших данных в соответствии с нашими Условиями использования.
                        </p>
                        <p>
                            <strong>Важная информация:</strong>
                        </p>
                        <ul>
                            <li>Веб-сайт собирает только необходимые данные для улучшения работы сервиса</li>
                            <li>Данные не передаются третьим лицам</li>
                            {/* <li>Вся информация обрабатывается безопасно и в соответствии с законом о защите персональных данных</li> */}
                            {/* <li>Вы можете управлять своими настройками конфиденциальности в любое время</li> */}
                        </ul>
                        <p className="consent-modal-policy">
                            Нажимая кнопку «Принять», вы подтверждаете, что {' '}
                            {/* что ознакомлены с нашей политикой конфиденциальности и */}
                            согласны с обработкой ваших данных.
                        </p>
                    </div>
                    <div className="button-container">
                        <button
                            className="consent-button"
                            onClick={handleConsent}
                            aria-label="Принять условия обработки данных"
                        >
                            Принять
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConsentModal;
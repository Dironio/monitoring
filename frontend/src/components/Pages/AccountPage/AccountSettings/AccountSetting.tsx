import { useState } from 'react';
import './AccountSetting.css';
import { useAccountSettingForm } from '../../../../hooks/useAccountSettingForm';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


const AccountSetting: React.FC = () => {
    const navigate = useNavigate();
    const {
        formData,
        isEditable,
        handleChange,
        toggleEditable,
        saveForm,
        resetForm,
    } = useAccountSettingForm({
        firstName: "Иван",
        lastName: "Иванов",
        email: "ivanov@example.com",
        username: "ivanov",
        password: "",
        confirmPassword: "",
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isEditable) {
            saveForm();
            navigate('/account');
            navigate(0)
        } else {
            toggleEditable();
        }
    };


    return (
        <main>
            <div className="wrapper">
                <div className="bg-white">
                    <div className="main-header">
                        {isEditable ? (
                            <button
                                className="settings-btn"

                                onClick={resetForm}
                                type="button"
                            >
                                <img
                                    src="/assets/arrow.svg"
                                    alt="Назад"
                                    className="toggle-btn-arrow"
                                />
                            </button>) : (
                            <Link to="/account"
                                className="settings-btn"
                                type="button"
                            >
                                <img
                                    src="/assets/arrow.svg"
                                    alt="Назад"
                                    className="toggle-btn-arrow"
                                />
                            </Link>)}
                        <p className="main-header__logo">Настройки аккаунта</p>
                    </div>


                    <form className="auth__items" onSubmit={handleSubmit}>
                        <div className="item-initials">
                            <div className="initials__name">
                                <p className="inititals__first-name">Имя</p>
                                <input
                                    type="text"
                                    className="inititals__name-input"
                                    name="firstName"
                                    placeholder="Иван"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    disabled={!isEditable}
                                />
                            </div>
                            <div className="initials__name">
                                <p className="inititals__first-name">Фамилия</p>
                                <input
                                    type="text"
                                    className="inititals__name-input"
                                    name="lastName"
                                    placeholder="Иванов"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    disabled={!isEditable}
                                />
                            </div>
                        </div>

                        <div className="item-initials">
                            <div className="initials__name">
                                <p className="inititals__first-name">Эл. почта</p>
                                <input
                                    type="email"
                                    className="inititals__name-input"
                                    name="email"
                                    placeholder="ivanov@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={!isEditable}
                                />
                            </div>
                            <div className="initials__name">
                                <p className="inititals__first-name">Логин</p>
                                <input
                                    type="text"
                                    className="inititals__name-input"
                                    name="username"
                                    placeholder="ivanov"
                                    value={formData.username}
                                    onChange={handleChange}
                                    disabled={!isEditable}
                                />
                            </div>
                        </div>

                        <div className="item-initials">
                            <div className="initials__name">
                                <p className="inititals__first-name">Пароль</p>
                                <input
                                    type="password"
                                    className="inititals__name-input"
                                    name="password"
                                    placeholder="*****"
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={!isEditable}
                                />
                            </div>
                            <div className="initials__name">
                                <p className="inititals__first-name">Повторите пароль</p>
                                <input
                                    type="password"
                                    className="inititals__name-input"
                                    name="confirmPassword"
                                    placeholder="*****"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    disabled={!isEditable}
                                />
                            </div>
                        </div>

                        <div className="auth__signup">
                            <button type="submit" className="auth__signup-btn">
                                {isEditable ? "Сохранить" : "Редактировать"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>

    );
}

export default AccountSetting;
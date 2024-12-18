import React, { useState } from "react";
import "./AuthPage.css";
import { useAuthForm } from "../../../hooks/useAuthForm";
import { useAuth } from "../../../hooks/useAuth";
import { config } from "dotenv";

// config({ path: "./.env" });


// Не знаю, может сделать разделение хуков на регу и логин, может проблема в дотенв, потестить
//исправить стили ошибок
const AuthPage: React.FC = () => {
    const [isSignUp, setIsSignUp] = useState(true);
    const { formData, errors, handleChange, validateForm } = useAuthForm(isSignUp);
    const { handleAuth, loading, authErrors } = useAuth();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) return;
        handleAuth(isSignUp, formData);
    };

    return (
        <main className="main">
            <div className="wrapper">
                <div className="bg-white-auth">
                    <h2 className="auth__title">
                        {isSignUp ? "Регистрация аккаунта" : "Вход в аккаунт"}
                    </h2>
                    <form className="auth__items" onSubmit={handleSubmit}>
                        {isSignUp && (
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
                                    />
                                </div>
                            </div>
                        )}


                        <div className="item-initials">
                            {isSignUp && (
                                <div className="initials__name">
                                    <p className="inititals__first-name">Эл. почта</p>
                                    <input
                                        type="email"
                                        className="inititals__name-input"
                                        name="email"
                                        placeholder="ivanov@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required={isSignUp}
                                    />
                                    {errors.email && <span className="error">{errors.email}</span>}
                                </div>

                            )}
                            <div className="initials__name">
                                <p className="inititals__first-name">Логин</p>
                                <input
                                    type="text"
                                    className="inititals__name-input"
                                    name="username"
                                    placeholder="ivanov"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
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
                                    required
                                />
                            </div>
                            {isSignUp && (
                                <div className="initials__name">
                                    <p className="inititals__first-name">Повторите пароль</p>
                                    <input
                                        type="password"
                                        className="inititals__name-input"
                                        name="confirmPassword"
                                        placeholder="*****"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            )}
                        </div>

                        <div className="auth__signup">
                            <button type="submit" className="auth__signup-btn">
                                {isSignUp ? "Зарегистрироваться" : "Войти"}
                            </button>
                        </div>
                    </form>

                    <p className="auth__question">
                        {isSignUp ? "Уже есть аккаунт?" : "Нет аккаунта?"}
                    </p>
                    <div className="auth__login">
                        <button
                            className="auth__login-p"
                            onClick={() => setIsSignUp((prev) => !prev)}
                        >
                            {isSignUp ? "Войти" : "Регистрация"}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default AuthPage;

import "./AuthPage.css";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../../../hooks/useAuth";
import { schemaLogin, schemaSignUp } from "../../../models/validationSchemas";
import InputField from "./InputField";


interface IFormInputs {
    firstName?: string;
    lastName?: string;
    email?: string;
    username: string;
    password: string;
    confirmPassword?: string;
}

const AuthPage: React.FC = () => {
    const [isSignUp, setIsSignUp] = useState(true);
    const { handleAuth, loading, authErrors } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
        trigger,
    } = useForm<IFormInputs>({
        resolver: yupResolver(isSignUp ? schemaSignUp : schemaLogin),
        mode: "onBlur",
    });

    const onSubmit: SubmitHandler<IFormInputs> = (data) => {
        handleAuth(isSignUp, data);
    };

    const handleFieldBlur = async (fieldName: keyof IFormInputs) => {
        await trigger(fieldName);
    };

    // JSX:
    return (
        <main className="main">
            <div className="wrapper">
                <div className="bg-white-auth">
                    <h2 className="auth__title">
                        {isSignUp ? "Регистрация аккаунта" : "Вход в аккаунт"}
                    </h2>
                    <form className="auth__items" onSubmit={handleSubmit(onSubmit)}>
                        {isSignUp && (
                            <div className="item-initials">
                                <InputField
                                    label="Имя"
                                    name="firstName"
                                    placeholder="Введите имя"
                                    error={errors.firstName}
                                    register={register}
                                    onBlur={() => handleFieldBlur("firstName")}
                                />
                                <InputField
                                    label="Фамилия"
                                    name="lastName"
                                    placeholder="Введите фамилию"
                                    error={errors.lastName}
                                    register={register}
                                    onBlur={() => handleFieldBlur("lastName")}
                                />
                            </div>
                        )}
                        <div className="item-initials">
                            {isSignUp && (
                                <InputField
                                    label="Эл. почта"
                                    name="email"
                                    type="email"
                                    placeholder="Введите email"
                                    error={errors.email}
                                    register={register}
                                    onBlur={() => handleFieldBlur("email")}
                                />
                            )}
                            <InputField
                                label="Логин"
                                name="username"
                                placeholder="Введите логин"
                                error={errors.username}
                                register={register}
                                onBlur={() => handleFieldBlur("username")}
                            />
                        </div>
                        <div className="item-initials">
                            <InputField
                                label="Пароль"
                                name="password"
                                type="password"
                                placeholder="Введите пароль"
                                error={errors.password}
                                register={register}
                                onBlur={() => handleFieldBlur("password")}
                            />
                            {isSignUp && (
                                <InputField
                                    label="Подтвердите пароль"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="Повторите пароль"
                                    error={errors.confirmPassword}
                                    register={register}
                                    onBlur={() => handleFieldBlur("confirmPassword")}
                                />
                            )}
                        </div>
                        <div className="auth__signup">
                            <button
                                type="submit"
                                className="auth__signup-btn"
                                disabled={loading}
                            >
                                {loading ? "Загрузка..." : isSignUp ? "Зарегистрироваться" : "Войти"}
                            </button>
                        </div>
                        {authErrors && authErrors.general && (
                            <div className="auth__error">{authErrors.general}</div>
                        )}
                    </form>
                    <p className="auth__question">
                        {isSignUp ? "Уже есть аккаунт?" : "Нет аккаунта?"}
                    </p>
                    <div className="auth__login">
                        <button
                            type="button"
                            className="auth__login-btn"
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

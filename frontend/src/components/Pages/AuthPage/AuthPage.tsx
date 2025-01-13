import "./AuthPage.css";
// import React, { useState } from "react";
// import { useForm, SubmitHandler } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { useAuth } from "../../../hooks/useAuth";

// interface IFormInputs {
//     firstName?: string;
//     lastName?: string;
//     email?: string;
//     username: string;
//     password: string;
//     confirmPassword?: string;
// }

// const schemaSignUp = yup.object().shape({
//     firstName: yup.string().optional(),
//     lastName: yup.string().optional(),
//     email: yup.string().email("Некорректный email").required("Обязательное поле"),
//     username: yup.string().required("Обязательное поле"),
//     password: yup.string().min(6, "Минимум 6 символов").required("Обязательное поле"),
//     confirmPassword: yup
//         .string()
//         .oneOf([yup.ref("password")], "Пароли должны совпадать")
//         .required("Подтвердите пароль"),
// });

// const schemaLogin = yup.object().shape({
//     username: yup.string().required("Обязательное поле"),
//     password: yup.string().min(6, "Минимум 6 символов").required("Обязательное поле"),
// });

// //исправить стили ошибок
// const AuthPage: React.FC = () => {
//     const [isSignUp, setIsSignUp] = useState(true);
//     const { handleAuth, loading, authErrors } = useAuth();

//     const {
//         register,
//         handleSubmit,
//         formState: { errors },
//     } = useForm<IFormInputs>({
//         resolver: yupResolver(isSignUp ? schemaSignUp : schemaLogin),
//     });

//     const onSubmit: SubmitHandler<IFormInputs> = (data) => {
//         handleAuth(isSignUp, data);
//     };

//     return (
//         <main className="main">
//             <div className="wrapper">
//                 <div className="bg-white-auth">
//                     <h2 className="auth__title">
//                         {isSignUp ? "Регистрация аккаунта" : "Вход в аккаунт"}
//                     </h2>
//                     <form className="auth__items" onSubmit={handleSubmit(onSubmit)}>
//                         {isSignUp && (
//                             <div className="item-initials">
//                                 <div className="initials__name">
//                                     <p className="inititals__first-name">Имя</p>
//                                     <input
//                                         type="text"
//                                         className="inititals__name-input"
//                                         {...register("firstName")}
//                                         placeholder="Иван"
//                                     />
//                                     {errors.firstName && <span className="error">{errors.firstName.message}</span>}
//                                 </div>
//                                 <div className="initials__name">
//                                     <p className="inititals__first-name">Фамилия</p>
//                                     <input
//                                         type="text"
//                                         className="inititals__name-input"
//                                         {...register("lastName")}
//                                         placeholder="Иванов"
//                                     />
//                                     {errors.lastName && <span className="error">{errors.lastName.message}</span>}
//                                 </div>
//                             </div>
//                         )}
//                         <div className="item-initials">
//                             {isSignUp && (
//                                 <div className="initials__name">
//                                     <p className="inititals__first-name">Эл. почта</p>
//                                     <input
//                                         type="email"
//                                         className="inititals__name-input"
//                                         {...register("email")}
//                                         placeholder="ivanov@example.com"
//                                     />
//                                     {errors.email && <span className="error">{errors.email.message}</span>}
//                                 </div>
//                             )}
//                             <div className="initials__name">
//                                 <p className="inititals__first-name">Логин</p>
//                                 <input
//                                     type="text"
//                                     className="inititals__name-input"
//                                     {...register("username")}
//                                     placeholder="ivanov"
//                                 />
//                                 {errors.username && <span className="error">{errors.username.message}</span>}
//                             </div>
//                         </div>
//                         <div className="item-initials">
//                             <div className="initials__name">
//                                 <p className="inititals__first-name">Пароль</p>
//                                 <input
//                                     type="password"
//                                     className="inititals__name-input"
//                                     {...register("password")}
//                                     placeholder="*****"
//                                 />
//                                 {errors.password && <span className="error">{errors.password.message}</span>}
//                             </div>
//                             {isSignUp && (
//                                 <div className="initials__name">
//                                     <p className="inititals__first-name">Повторите пароль</p>
//                                     <input
//                                         type="password"
//                                         className="inititals__name-input"
//                                         {...register("confirmPassword")}
//                                         placeholder="*****"
//                                     />
//                                     {errors.confirmPassword && <span className="error">{errors.confirmPassword.message}</span>}
//                                 </div>
//                             )}
//                         </div>
//                         <div className="auth__signup">
//                             <button
//                                 type="submit"
//                                 className="auth__signup-btn"
//                                 disabled={loading}
//                             >
//                                 {loading ? "Загрузка..." : isSignUp ? "Зарегистрироваться" : "Войти"}
//                             </button>
//                         </div>
//                         {authErrors.general && <div className="auth__error">{authErrors.general}</div>}
//                     </form>
//                     <p className="auth__question">
//                         {isSignUp ? "Уже есть аккаунт?" : "Нет аккаунта?"}
//                     </p>
//                     <div className="auth__login">
//                         <button
//                             type="button"
//                             className="auth__login-p"
//                             onClick={() => setIsSignUp((prev) => !prev)}
//                         >
//                             {isSignUp ? "Войти" : "Регистрация"}
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </main>
//     );
// };

// export default AuthPage;




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
    const [isSignUp, setIsSignUp] = useState(true); // Флаг для переключения между регистрацией и входом
    const { handleAuth, loading, authErrors } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
        trigger,
    } = useForm<IFormInputs>({
        resolver: yupResolver(isSignUp ? schemaSignUp : schemaLogin), // Используем соответствующую схему
        mode: "onBlur", // Валидация при покидании поля
    });

    const onSubmit: SubmitHandler<IFormInputs> = (data) => {
        handleAuth(isSignUp, data);
    };

    const handleFieldBlur = async (fieldName: keyof IFormInputs) => {
        // Активируем проверку для отдельного поля
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
                        {/* Имя и фамилия, если режим регистрации */}
                        {isSignUp && (
                            <div className="item-initials">
                                {/* Имя */}
                                <InputField
                                    label="Имя"
                                    name="firstName"
                                    placeholder="Введите имя"
                                    error={errors.firstName}
                                    register={register}
                                    onBlur={() => handleFieldBlur("firstName")}
                                />
                                {/* Фамилия */}
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
                        {/* Email и логин на одной линии */}
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
                        {/* Пароль и подтверждение пароля на одной линии */}
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
                        {/* Кнопка отправки */}
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

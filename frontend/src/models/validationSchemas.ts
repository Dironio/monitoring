import * as yup from "yup";
import { checkAvailability } from "../hooks/useValidation";

export const schemaSignUp = yup.object().shape({
    firstName: yup
        .string()
        .min(2, "Указано меньше 2 символов")
        .max(50, "Указано больше 50 символов")
        .matches(/^[А-Яа-яA-Za-z\s-]+$/, "Имя может содержать только буквы, дефис и пробелы")
        .optional(),

    lastName: yup
        .string()
        .min(2, "Указано меньше 2 символов")
        .max(50, "Указано больше 50 символов")
        .matches(/^[А-Яа-яA-Za-z\s-]+$/, "Фамилия может содержать только буквы, дефис и пробелы")
        .optional(),

    email: yup
        .string()
        .email("Некорректный email")
        .required("Обязательное поле")
        .test("email-available", "Эта почта уже зарегистрирована", async function (value) {
            if (!value) return true;
            try {
                const response = await checkAvailability(undefined, value);
                return !!response.results.email;
            } catch (err) {
                console.error("Ошибка проверки доступности email:", err);
                return false;
            }
        }),

    username: yup
        .string()
        .required("Обязательное поле")
        .min(3, "Логин должен содержать минимум 3 символа")
        .max(30, "Логин должен содержать максимум 30 символов")
        .matches(/^[a-zA-Z0-9_-]+$/, "Логин может содержать только буквы, цифры, дефис и нижнее подчеркивание")
        .test("username-available", "Этот логин уже занят", async function (value) {
            if (!value) return true;
            try {
                const response = await checkAvailability(value, undefined);
                return !!response.results.username;
            } catch (err) {
                console.error("Ошибка проверки доступности username:", err);
                return false;
            }
        }),

    password: yup
        .string()
        .min(6, "Минимум 6 символов")
        .required("Обязательное поле")
        .matches(
            /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/,
            "Должна быть минимум одна буква"
        ),

    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], "Пароли должны совпадать")
        .required("Подтвердите пароль"),
});

export const schemaLogin = yup.object().shape({
    username: yup.string().required("Обязательное поле"),
    password: yup.string().min(6, "Минимум 6 символов").required("Обязательное поле"),
});

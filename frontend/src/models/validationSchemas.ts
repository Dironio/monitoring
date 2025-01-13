// import * as yup from "yup";
// import { checkAvailability } from "../hooks/useValidation";

// export const schemaSignUp = yup.object().shape({
//     firstName: yup
//         .string()
//         .min(2, "Указано меньше 2 символов")
//         .max(50, "Указано больше 50 символов")
//         .matches(/^[А-Яа-яA-Za-z\s-]+$/, "Имя может содержать только буквы, дефис и пробелы")
//         .optional(),

//     lastName: yup
//         .string()
//         .min(2, "Указано меньше 2 символов")
//         .max(50, "Указано больше 50 символов")
//         .matches(/^[А-Яа-яA-Za-z\s-]+$/, "Фамилия может содержать только буквы, дефис и пробелы")
//         .optional(),

//     email: yup
//         .string()
//         .email("Некорректный email")
//         .required("Обязательное поле")
//         .test("email-available", "Эта почта уже зарегистрирована", async function (value) {
//             if (!value) return true;
//             try {
//                 const response = await checkAvailability(undefined, value);
//                 return !!response.results.email;
//             } catch (err) {
//                 console.error("Ошибка проверки доступности email:", err);
//                 return false;
//             }
//         }),

//     username: yup
//         .string()
//         .required("Обязательное поле")
//         .min(3, "Логин должен содержать минимум 3 символа")
//         .max(30, "Логин должен содержать максимум 30 символов")
//         .matches(/^[a-zA-Z0-9_-]+$/, "Логин может содержать только буквы, цифры, дефис и нижнее подчеркивание")
//         .test("username-available", "Этот логин уже занят", async function (value) {
//             if (!value) return true;
//             try {
//                 const response = await checkAvailability(value, undefined);
//                 return !!response.results.username;
//             } catch (err) {
//                 console.error("Ошибка проверки доступности username:", err);
//                 return false;
//             }
//         }),

//     password: yup
//         .string()
//         .min(6, "Минимум 6 символов")
//         .required("Обязательное поле")
//         .matches(
//             /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/,
//             "Должна быть минимум одна буква"
//         ),

//     confirmPassword: yup
//         .string()
//         .oneOf([yup.ref("password")], "Пароли должны совпадать")
//         .required("Подтвердите пароль"),
// });

// export const schemaLogin = yup.object().shape({
//     username: yup.string().required("Обязательное поле"),
//     password: yup.string().min(6, "Минимум 6 символов").required("Обязательное поле"),
// });










import * as yup from "yup";
import { checkAvailability } from "../hooks/useValidation";

// Базовые схемы для повторяющихся правил
const nameSchema = yup
    .string()
    .min(2, "Указано меньше 2 символов")
    .max(50, "Указано больше 50 символов")
    .matches(/^[А-Яа-яA-Za-z\s-]+$/, "Может содержать только буквы, дефис и пробелы");

const passwordSchema = yup
    .string()
    .min(6, "Минимум 6 символов")
    .matches(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/,
        "Должна быть минимум одна буква"
    );

// Схема для настроек профиля
export const schemaSettings = yup.object().shape({
    firstName: nameSchema.optional(),
    lastName: nameSchema.optional(),

    email: yup
        .string()
        .email("Некорректный email")
        .required("Обязательное поле")
        .test("email-available", "Эта почта уже зарегистрирована", async function (value) {
            if (!value) return true;
            if (value === this.parent.originalEmail) return true;
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
            if (value === this.parent.originalUsername) return true;
            try {
                const response = await checkAvailability(value, undefined);
                return !!response.results.username;
            } catch (err) {
                console.error("Ошибка проверки доступности username:", err);
                return false;
            }
        }),

    // Текущий пароль для подтверждения изменений
    currentPassword: yup
        .string()
        .required("Введите текущий пароль для подтверждения изменений"),

    // Новый пароль (опционально)
    newPassword: passwordSchema.optional(),

    // Подтверждение нового пароля
    confirmNewPassword: yup
        .string()
        .test("passwords-match", "Пароли должны совпадать", function (value) {
            return !this.parent.newPassword || value === this.parent.newPassword;
        })
        .test("required-if-new-password", "Подтвердите новый пароль", function (value) {
            return !this.parent.newPassword || !!value;
        }),

    // Оригинальные значения для проверки изменений
    originalEmail: yup.string(),
    originalUsername: yup.string(),
});

// Схема для регистрации
export const schemaSignUp = yup.object().shape({
    firstName: nameSchema.optional(),
    lastName: nameSchema.optional(),

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

    password: passwordSchema.required("Обязательное поле"),

    confirmPassword: yup
        .string()
        .test("passwords-match", "Пароли должны совпадать", function (value) {
            return value === this.parent.password;
        })
        .required("Подтвердите пароль"),
});

// Схема для входа
export const schemaLogin = yup.object().shape({
    username: yup.string().required("Обязательное поле"),
    password: yup.string().required("Обязательное поле"),
});

// Типы для TypeScript
export interface IFormInputs {
    firstName?: string;
    lastName?: string;
    email?: string;
    username: string;
    password?: string;
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
    confirmNewPassword?: string;
    originalEmail?: string;
    originalUsername?: string;
}


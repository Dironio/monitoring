import { useState } from "react";

export const useAuthForm = (isSignUp: boolean) => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === "username" && value.length < 4) {
            setErrors((prev) => ({ ...prev, username: "Логин должен быть от 4 символов" }));
        } else if (name === "email" && !/^\S+@\S+\.\S+$/.test(value)) {
            setErrors((prev) => ({ ...prev, email: "Введите корректный email" }));
        } else if (name === "password" && value.length < 6) {
            setErrors((prev) => ({ ...prev, password: "Пароль должен быть от 6 символов" }));
        } else if (name === "confirmPassword" && value !== formData.password) {
            setErrors((prev) => ({ ...prev, confirmPassword: "Пароли не совпадают" }));
        } else {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const newErrors = { username: "", email: "", password: "", confirmPassword: "" };
        if (formData.username.length < 4) newErrors.username = "Логин должен быть от 4 символов";
        if (!/^\S+@\S+\.\S+$/.test(formData.email))
            newErrors.email = "Введите корректный email";
        if (formData.password.length < 6) newErrors.password = "Пароль должен быть от 6 символов";
        if (isSignUp && formData.password !== formData.confirmPassword)
            newErrors.confirmPassword = "Пароли не совпадают";

        setErrors(newErrors);

        return Object.values(newErrors).every((err) => err === "");
    };

    return {
        formData,
        errors,
        handleChange,
        validateForm,
    };
};
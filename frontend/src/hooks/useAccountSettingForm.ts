import { useState } from "react";

export const useAccountSettingForm = (initialValues: any) => {
    const [formData, setFormData] = useState(initialValues);
    const [isEditable, setIsEditable] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({
            ...prev,
            [name]: value,
        }));
    };

    const toggleEditable = () => {
        setIsEditable((prev) => !prev);
    };

    const saveForm = () => {
        console.log("Данные сохранены:", formData);
        setIsEditable(false);
    };

    const resetForm = () => {
        setFormData(initialValues);
        setIsEditable(false);
    };

    return {
        formData,
        isEditable,
        handleChange,
        toggleEditable,
        saveForm,
        resetForm,
    };
};

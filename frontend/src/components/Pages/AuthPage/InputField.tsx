import React from "react";
import { FieldError } from "react-hook-form";

interface InputFieldProps {
    label: string;
    name: string;
    type?: string;
    placeholder: string;
    error?: FieldError | string;
    register: any;
    onBlur: () => void;
    disabled?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
    label,
    name,
    type = "text",
    placeholder,
    error,
    register,
    onBlur,
    disabled,
}) => {
    const errorMessage =
        typeof error === "string"
            ? error
            : error?.message;

    return (
        <div className="input-field">
            <p className="input-label">{label}</p>
            <div className="input-container">
                <input
                    type={type}
                    className={`input-control ${errorMessage ? "input-error" : ""}`}
                    placeholder={placeholder}
                    {...register(name)}
                    onBlur={onBlur}
                />
            </div>
            <div className={`error-message ${errorMessage ? "visible" : ""}`}>
                {errorMessage || "\u00A0"}
            </div>
        </div>
    );
};

export default InputField;

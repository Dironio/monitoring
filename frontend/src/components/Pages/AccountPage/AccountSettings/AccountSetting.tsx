import { useEffect, useMemo, useState } from 'react';
import './AccountSetting.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { User } from '../../../../models/user.model';
import InputField from '../../AuthPage/InputField';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { schemaSettings } from '../../../../models/validationSchemas';
import { IUpdateUserData, userService } from '../../../../hooks/useUpdate';

// interface AccountSettingProps {
//     user: User | null;
//     loading: boolean;
//     onUpdateUser: (data: UpdateUserData) => Promise<void>;
// }

// interface FormInputs {
//     firstName: string;
//     lastName: string;
//     email: string;
//     username: string;
//     currentPassword: string;
//     newPassword: string;
//     confirmNewPassword: string;
// }

// interface UpdateUserData {
//     first_name: string;
//     last_name: string;
//     email?: string;
//     username?: string;
//     current_password?: string;
//     new_password?: string;
// }

// interface ISettingsFormInputs {
//     firstName: string;
//     lastName: string;
//     email: string;
//     username: string;
//     currentPassword: string;
//     newPassword: string;
//     confirmNewPassword: string;
//     originalEmail: string;
//     originalUsername: string;
// }

interface AccountSettingProps {
    user: User | null;
    loading: boolean;
}

interface ISettingsFormInputs {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
    originalEmail: string;
    originalUsername: string;
}

const AccountSettings: React.FC<AccountSettingProps> = ({ user, loading }) => {
    const navigate = useNavigate();
    const [isEditable, setIsEditable] = useState(false);
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        trigger,
        reset,
        watch,
    } = useForm<ISettingsFormInputs>({
        resolver: yupResolver(schemaSettings) as any,
        mode: "onBlur",
        defaultValues: {
            firstName: user?.first_name || "",
            lastName: user?.last_name || "",
            email: user?.email || "",
            username: user?.username || "",
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
            originalEmail: user?.email || "",
            originalUsername: user?.username || "",
        },
    });

    const formValues = watch();

    const hasChanges = useMemo(() => {
        return (
            formValues.firstName !== user?.first_name ||
            formValues.lastName !== user?.last_name ||
            formValues.email !== user?.email ||
            formValues.username !== user?.username ||
            !!formValues.newPassword
        );
    }, [formValues, user]);

    const onSubmit = async (data: ISettingsFormInputs) => {
        if (!isEditable) {
            setIsEditable(true);
            return;
        }

        if (isEditable && hasChanges && user) {
            try {
                setSubmitError(null);
                const updateData: IUpdateUserData = {
                    id: user.id,
                    first_name: data.firstName,
                    last_name: data.lastName,
                    email: data.email !== user.email ? data.email : undefined,
                    username: data.username !== user.username ? data.username : undefined,
                    current_password: data.currentPassword || undefined,
                    new_password: data.newPassword || undefined,
                };

                if (data.newPassword && !data.currentPassword) {
                    setSubmitError('Для изменения пароля необходимо ввести текущий пароль');
                    return;
                }

                await userService.updateUser(updateData);
                setIsEditable(false);
                navigate('/account');
                navigate(0);
            } catch (error) {
                if (error instanceof Error) {
                    setSubmitError(error.message);
                } else {
                    setSubmitError('Произошла ошибка при обновлении данных');
                }
            }
        }
    };

    const handleCancel = () => {
        setIsEditable(false);
        setShowPasswordFields(false);
        setSubmitError(null);
        reset();
    };
    return (
        <main>
            <div className="wrapper">
                <div className="bg-white">
                    <div className="settings-wrapper">
                        <div className="main-header">
                            {isEditable ? (
                                <button
                                    className="settings-btn"
                                    onClick={handleCancel}
                                    type="button"
                                >
                                    <img
                                        src="/assets/arrow.svg"
                                        alt="Назад"
                                        className="toggle-btn-arrow"
                                    />
                                </button>
                            ) : (
                                <Link to="/account" className="settings-btn">
                                    <img
                                        src="/assets/arrow.svg"
                                        alt="Назад"
                                        className="toggle-btn-arrow"
                                    />
                                </Link>
                            )}
                            <p className="main-header__logo">Настройки аккаунта</p>
                        </div>

                        <form className="auth__items" onSubmit={handleSubmit(onSubmit)}>
                            <div className="item-initials">
                                <InputField
                                    label="Имя"
                                    name="firstName"
                                    placeholder={user?.first_name || "Введите имя"}
                                    error={errors.firstName}
                                    register={register}
                                    onBlur={() => trigger("firstName")}
                                    disabled={!isEditable}
                                    value={user?.first_name}
                                />
                                <InputField
                                    label="Фамилия"
                                    name="lastName"
                                    placeholder={user?.last_name || "Введите фамилию"}
                                    error={errors.lastName}
                                    register={register}
                                    onBlur={() => trigger("lastName")}
                                    disabled={!isEditable}
                                    value={user?.last_name}
                                />
                            </div>

                            <div className="item-initials">
                                <InputField
                                    label="Эл. почта"
                                    name="email"
                                    type="email"
                                    placeholder={user?.email || "Введите email"}
                                    error={errors.email}
                                    register={register}
                                    onBlur={() => trigger("email")}
                                    disabled={!isEditable}
                                    value={user?.email}
                                />
                                <InputField
                                    label="Логин"
                                    name="username"
                                    placeholder={user?.username || "Введите логин"}
                                    error={errors.username}
                                    register={register}
                                    onBlur={() => trigger("username")}
                                    disabled={!isEditable}
                                    value={user?.username}
                                />
                            </div>

                            {isEditable && (
                                <>
                                    <div className="item-initials">
                                        <InputField
                                            label="Текущий пароль"
                                            name="currentPassword"
                                            type="password"
                                            placeholder="Введите текущий пароль"
                                            error={errors.currentPassword}
                                            register={register}
                                            onBlur={() => trigger("currentPassword")}
                                        />
                                    </div>

                                    <div className="item-initials">
                                        <InputField
                                            label="Новый пароль"
                                            name="newPassword"
                                            type="password"
                                            placeholder="Введите новый пароль"
                                            error={errors.newPassword}
                                            register={register}
                                            onBlur={() => trigger("newPassword")}
                                        />
                                        <InputField
                                            label="Подтвердите новый пароль"
                                            name="confirmNewPassword"
                                            type="password"
                                            placeholder="Повторите новый пароль"
                                            error={errors.confirmNewPassword}
                                            register={register}
                                            onBlur={() => trigger("confirmNewPassword")}
                                        />
                                    </div>
                                </>
                            )}

                            {submitError && (
                                <div className="error-message">{submitError}</div>
                            )}

                            <div className="auth__signup">
                                <button
                                    type="button"
                                    className="auth__signup-btn"
                                    onClick={() => {
                                        if (!isEditable) {
                                            setIsEditable(true);
                                        } else {
                                            handleSubmit(onSubmit)();
                                        }
                                    }}
                                    disabled={isEditable && !hasChanges}
                                >
                                    {isEditable ? "Сохранить" : "Редактировать"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default AccountSettings;
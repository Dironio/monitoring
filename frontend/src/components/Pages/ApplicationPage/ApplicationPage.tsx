import React, { useState } from "react"
import { Link } from "react-router-dom";
import './ApplicationPage.css';

const ApplicationPage: React.FC = () => {
    const [selectedForm, setSelectedForm] = useState<"site" | "brand" | null>(null);
    const [formData, setFormData] = useState({
        siteUrl: "https://example.com",
        email: "user@example.com",
        brandName: "",
        inn: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({
            siteUrl: "https://example.com",
            email: "user@example.com",
            brandName: "",
            inn: "",
        });
        setSelectedForm(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Отправлено:", formData);
        alert("Заявка отправлена!");
        resetForm();
    };

    return (
        <main>
            <div className="wrapper">
                <div className="bg-white">
                    {/* Заголовок */}
                    {/* <div className="main-header">
                        <button
                            className="toggle-btn"
                            onClick={resetForm}
                            type="button"
                        >
                            <img
                                src="/assets/arrow.svg"
                                alt="Назад"
                                className="toggle-btn-arrow"
                            />
                        </button>
                        <p className="main-header__logo">Заявка</p>
                    </div> */}

                    {selectedForm && (
                        <div className="main-header">
                            <button
                                className="toggle-btn"
                                onClick={resetForm}
                                type="button"
                            >
                                <img
                                    src="/assets/arrow.svg"
                                    alt="Назад"
                                    className="toggle-btn-arrow"
                                />
                            </button>
                            <p className="main-header__logo">Заявка на {
                                selectedForm ? ("регистрацию аккаунта владельца веб-сайта")
                                    :
                                    ("регистрацию аккаунта аналлитика")}</p>
                        </div>
                    )}



                    {!selectedForm ? (
                        <div className="form-selection">

                            <div className="main-header">
                                {/* <Link to="/account"
                                className="settings-btn"
                                type="button"
                            >
                                <img
                                    src="/assets/arrow.svg"
                                    alt="Назад"
                                    className="toggle-btn-arrow"
                                />
                            </Link>

                            <p className="form-selection-title">Выберите форму заявки</p> */}

                                <Link to="/account"
                                    className="settings-btn"
                                    type="button"
                                >
                                    <img
                                        src="/assets/arrow.svg"
                                        alt="Назад"
                                        className="toggle-btn-arrow"
                                    />
                                </Link>
                                <p className="form-selection-title">Заявки</p>
                            </div>
                            <ul className="form-selection-list">
                                <li
                                    className="form-selection-item"
                                    onClick={() => setSelectedForm("site")}
                                >
                                    Отслеживание сайта
                                </li>
                                <li
                                    className="form-selection-item"
                                    onClick={() => setSelectedForm("brand")}
                                >
                                    Отслеживание товаров
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <form className="application-form" onSubmit={handleSubmit}>
                            {selectedForm === "site" && (
                                <>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="siteUrl">
                                            Адрес сайта
                                        </label>
                                        <input
                                            type="text"
                                            id="siteUrl"
                                            name="siteUrl"
                                            className="form-input"
                                            placeholder="https://example.com"
                                            value={formData.siteUrl}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="email">
                                            Email для обращения
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            className="form-input"
                                            placeholder="user@example.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </>
                            )}

                            {selectedForm === "brand" && (
                                <>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="siteUrl">
                                            Адрес сайта
                                        </label>
                                        <input
                                            type="text"
                                            id="siteUrl"
                                            name="siteUrl"
                                            className="form-input"
                                            placeholder="https://example.com"
                                            value={formData.siteUrl}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="brandName">
                                            Ваш бренд
                                        </label>
                                        <input
                                            type="text"
                                            id="brandName"
                                            name="brandName"
                                            className="form-input"
                                            placeholder="Ваш бренд"
                                            value={formData.brandName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="inn">
                                            ИНН
                                        </label>
                                        <input
                                            type="text"
                                            id="inn"
                                            name="inn"
                                            className="form-input"
                                            placeholder="1234567890"
                                            value={formData.inn}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="email">
                                            Email для обращения
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            className="form-input"
                                            placeholder="user@example.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </>
                            )}

                            <div className="form-actions">
                                <button type="button" className="form-btn cancel" onClick={resetForm}>
                                    Отмена
                                </button>
                                <button type="submit" className="form-btn submit">
                                    Сохранить
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </main>
    );

}

export default ApplicationPage;
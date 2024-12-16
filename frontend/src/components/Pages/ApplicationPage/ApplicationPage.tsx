import React from "react"
import { Link } from "react-router-dom";

const ApplicationPage: React.FC = () => {
    return (

        <main>
            <div className="wrapper">
                <div className="bg-white">
                    <div className="main-header">
                        <p className="main-header__logo">Оставьте заявку</p>
                    </div>

                    <div className="main-header">
                        <p className="main-header__logo">Хотите отслеживать свой сайт? Укажите как с вами связаться и адрес вашего сайта</p>



                    </div>

                    <form action="">
                        <div className="item-initials">
                            <div className="initials__name">
                                <p className="inititals__first-name">адрес сайта</p>
                                <input
                                    type="text"
                                    className="inititals__name-input"
                                    name="firstName"
                                    placeholder="Иван"
                                // value={formData.firstName}
                                // onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="item-initials">
                            <div className="initials__name">
                                <p className="inititals__first-name">email для обращения</p>
                                <input
                                    type="text"
                                    className="inititals__name-input"
                                    name="lastName"
                                    placeholder="Иванов"
                                // value={formData.lastName}
                                // onChange={handleChange}
                                />
                                <button>Оставить</button>
                            </div>
                        </div>
                    </form>

                    <div className="main-header">
                        <p className="main-header__logo">Ваш сайт уже добавлен и вы хотите отслеживать свои товары? Оставьте заявку ниже</p>



                    </div>

                    <form action="">
                        <div className="item-initials">
                            <div className="initials__name">
                                <p className="inititals__first-name">адрес сайта</p>
                                <input
                                    type="text"
                                    className="inititals__name-input"
                                    name="firstName"
                                    placeholder="Иван"
                                // value={formData.firstName}
                                // onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="item-initials">
                            <div className="initials__name">
                                <p className="inititals__first-name">Ваш бренд</p>
                                <input
                                    type="text"
                                    className="inititals__name-input"
                                    name="lastName"
                                    placeholder="Иванов"
                                // value={formData.lastName}
                                // onChange={handleChange}
                                />

                            </div>
                            <div className="initials__name">
                                <p className="inititals__first-name">ИНН</p>
                                <input
                                    type="text"
                                    className="inititals__name-input"
                                    name="lastName"
                                    placeholder="Иванов"
                                // value={formData.lastName}
                                // onChange={handleChange}
                                />

                            </div>
                        </div>

                        <div className="item-initials">
                            <div className="initials__name">
                                <p className="inititals__first-name">email для обращения</p>
                                <input
                                    type="text"
                                    className="inititals__name-input"
                                    name="firstName"
                                    placeholder="Иван"
                                // value={formData.firstName}
                                // onChange={handleChange}
                                />
                                <button>Оставить</button>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </main>
    )
}

export default ApplicationPage;
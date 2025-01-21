import './UnknowPage.css';
import { Link, useNavigate } from 'react-router-dom';

const UnknownPage: React.FC = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };
    return (
        <div className="wrapper">
            <div className="bg-white">
                <div className="unknow-main">
                    <div className='unknow-pg'>
                        <h1 className='unknow-pg__item'>404</h1>
                        <p className='unknow-pg__item'>Страница не найдена</p>
                        
                        {/* ЗАТЕСТИТЬ! */}
                        <button
                            onClick={handleGoBack}
                            className='unknow-pg__go-back'
                        >
                            Вернуться назад
                        </button>

                        <Link to="/">
                            <button className='unknow-pg__btn'>
                                Вернуться на главную
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UnknownPage;
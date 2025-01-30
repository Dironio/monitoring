import { useState, useEffect } from 'react';
import './RatingModal.css';
import { User } from '../../models/user.model';
import { sendFeedback } from '../utils/rating.form';

interface RatingModalProps {
    user: User | null;
    loading: boolean;
}

const RatingModal: React.FC<RatingModalProps> = ({ user, loading }) => {
    const [showModal, setShowModal] = useState(false);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [selectedRating, setSelectedRating] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const hasCompletedSurvey = localStorage.getItem('serviceRatingSurveyCompleted');

        if (!hasCompletedSurvey) {
            const timer = setTimeout(() => {
                setShowModal(true);
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleRatingClick = (rating: number) => {
        setSelectedRating(rating);
        localStorage.setItem('serviceRatingSurveyCompleted', 'true');
        localStorage.setItem('serviceRating', rating.toString());
        setIsSubmitted(true);
    };

    const handleClose = () => {
        if (isSubmitted) {
            setShowModal(false);
        }
    };

    const handleSubmit = async (rating: number) => {
        try {
            setError(null);

            await sendFeedback({
                user,
                rating,
                pageUrl: window.location.href,
                sessionId: localStorage.getItem('sessionId') || 'unknown',
                userAgent: navigator.userAgent
            });

            localStorage.setItem('serviceRatingSurveyCompleted', 'true');
            setIsSubmitted(true);

        } catch (error) {
            setError('Произошла ошибка при отправке оценки. Пожалуйста, попробуйте позже.');
            console.error('Error submitting rating:', error);
        }
    };

    if (!showModal) return null;

    return (
        <div className="rating-modal">
            <div className="rating-modal__overlay" />
            <div className="rating-modal__content">
                {isSubmitted && (
                    <button
                        onClick={handleClose}
                        className="rating-modal__close-btn"
                    >
                        <svg
                            className="rating-modal__close-icon"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                )}
                {!isSubmitted ? (
                    <>
                        <h2 className="rating-modal__title">
                            Оцените работоспособность сервиса
                        </h2>
                        <div className="rating-modal__scale">
                            {[...Array(10)].map((_, index) => {
                                const rating = index + 1;
                                return (
                                    <button
                                        key={rating}
                                        className={`rating-modal__button ${hoveredRating >= rating ? 'rating-modal__button--hovered' : ''
                                            } ${hoveredRating === rating ? 'rating-modal__button--active' : ''}`}
                                        onMouseEnter={() => setHoveredRating(rating)}
                                        onMouseLeave={() => setHoveredRating(0)}
                                        onClick={() => handleSubmit(rating)}
                                    >
                                        {rating}
                                    </button>
                                );
                            })}
                        </div>
                        <p className="rating-modal__hint">
                            {hoveredRating ? (
                                <span className="rating-modal__hint--highlighted">
                                    {hoveredRating} из 10
                                </span>
                            ) : (
                                'Выберите оценку'
                            )}
                        </p>
                    </>
                ) : (
                    <div className="rating-modal__success">
                        <div className="rating-modal__success-icon">
                            <svg
                                className="rating-modal__success-icon-svg"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <h3 className="rating-modal__success-title">
                            Спасибо за вашу оценку!
                        </h3>
                        <p className="rating-modal__success-text">
                            Ваш отзыв помогает нам становиться лучше
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RatingModal;
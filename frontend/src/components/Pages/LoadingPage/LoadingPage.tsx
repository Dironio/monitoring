const LoadingPage = () => {
    return (
        <div className="wrapper">
            <div className="bg-white">
                <div className="loading-main">
                    <div className="loading-content">
                        <div className="loading-pulse"></div>
                        <div className="loading-text">
                            <div className="loading-text__title">Загрузка</div>
                            <div className="loading-dots">
                                <span>.</span>
                                <span>.</span>
                                <span>.</span>
                            </div>
                        </div>
                    </div>
                    <div className="loading-skeleton">
                        <div className="skeleton-item"></div>
                        <div className="skeleton-item skeleton-item--short"></div>
                        <div className="skeleton-button"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadingPage;
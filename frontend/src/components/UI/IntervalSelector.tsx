interface IntervalSelectorProps {
    interval: 'month' | 'week';
    setInterval: (interval: 'month' | 'week') => void;
}

const IntervalSelector: React.FC<IntervalSelectorProps> = ({ interval, setInterval }) => {
    return (
        <div className="interval-selector">
            <button
                onClick={() => setInterval('week')}
                className={interval === 'week' ? 'active' : ''}
            >
                Неделя
            </button>
            <button
                onClick={() => setInterval('month')}
                className={interval === 'month' ? 'active' : ''}
            >
                Месяц
            </button>
        </div>
    );
};

export default IntervalSelector;
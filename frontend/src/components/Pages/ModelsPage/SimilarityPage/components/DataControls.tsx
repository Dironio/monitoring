import { Dispatch, SetStateAction } from 'react';

// type ColorByOption = 'eventType' | 'time' | 'page';

interface DateRange {
    start: Date | null;
    end: Date | null;
}

interface DataControlsProps {
    colorBy: ColorByOption;
    setColorBy: Dispatch<SetStateAction<ColorByOption>>;
    dateRange: DateRange;
    setDateRange: Dispatch<SetStateAction<DateRange>>;
}

type ColorByOption = 'eventType' | 'time' | 'page' | 'segment';

interface DateRange {
    start: Date | null;
    end: Date | null;
}

interface DataControlsProps {
    colorBy: ColorByOption;
    setColorBy: Dispatch<SetStateAction<ColorByOption>>;
    dateRange: DateRange;
    setDateRange: Dispatch<SetStateAction<DateRange>>;
}

export const DataControls = ({
    colorBy,
    setColorBy,
    dateRange,
    setDateRange
}: DataControlsProps) => {
    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value ? new Date(e.target.value) : null;
        setDateRange(prev => ({
            ...prev,
            start: newDate
        }));
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value ? new Date(e.target.value) : null;
        setDateRange(prev => ({
            ...prev,
            end: newDate
        }));
    };

    return (
        <div className="control-group">
            <div className="control-group">
                <label className="control-label">Цвет по:</label>
                <select
                    className="control-select"
                    value={colorBy}
                    onChange={(e) => setColorBy(e.target.value as ColorByOption)}
                >
                    <option value="eventType">Тип события</option>
                    <option value="time">Время суток</option>
                    <option value="page">URL страницы</option>
                    <option value="segment">Сегмент пользователя</option>
                </select>
            </div>

            <div className="control-group">
                <label className="control-label">Диапазон дат:</label>
                <input
                    type="datetime-local"
                    className="control-input"
                    value={dateRange.start?.toISOString().slice(0, 16) || ''}
                    onChange={handleStartDateChange}
                />
                <span>до</span>
                <input
                    type="datetime-local"
                    className="control-input"
                    value={dateRange.end?.toISOString().slice(0, 16) || ''}
                    onChange={handleEndDateChange}
                />
            </div>
        </div>
    );
};
import React from 'react';
import Select from 'react-select';

export interface TimeUnitOption {
    value: 'minute' | 'hour' | 'day' | 'month' | 'week';
    label: string;
}

interface TimeUnitSelectorProps {
    value: TimeUnitOption;
    onChange: (option: TimeUnitOption | null) => void;
}

const timeUnitOptions: TimeUnitOption[] = [
    { value: 'minute', label: 'По минутам' },
    { value: 'hour', label: 'По часам' },
    { value: 'day', label: 'По дням' },
    { value: 'week', label: 'По неделям' }
];

export const TimeUnitSelector: React.FC<TimeUnitSelectorProps> = ({ value, onChange }) => {
    return (
        <Select
            value={value}
            onChange={onChange}
            options={timeUnitOptions}
            className="time-unit-selector"
            placeholder="Выберите временной интервал"
        />
    );
};
import { forwardRef, ReactHTMLElement, useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import './CustomSelect.css';

export interface SelectOption {
    value: string | number;
    label: string;
}

export interface CustomSelectProps {
    options: SelectOption[];
    value?: string | number | (string | number)[];
    onChange: (value: string | number | (string | number)[]) => void;
    placeholder?: string;
    loading?: boolean;
    className?: string;
    name?: string;
    error?: string;
    searchable?: boolean;
    multiSelect?: boolean;
    maxItems?: number;
    onMenuOpen?: () => void;
    onMenuClose?: () => void;
    menuIsOpen?: boolean;
    // children?: HTMLDivElement;
}

const CustomSelect = forwardRef<HTMLDivElement, CustomSelectProps>(({
    options,
    value,
    onChange,
    placeholder = "Выберите значение",
    loading = false,
    className = "",
    name,
    error,
    searchable = false,
    multiSelect = false,
    maxItems,
    onMenuOpen,
    onMenuClose,
    menuIsOpen
}, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const selectRef = useRef<HTMLDivElement>(null);
    const optionsRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchQuery('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (value && name) {
            localStorage.setItem(name, JSON.stringify({
                value,
                label: multiSelect
                    ? options.filter(opt => (value as (string | number)[]).includes(opt.value)).map(opt => opt.label)
                    : options.find(opt => opt.value === value)?.label
            }));
        }
    }, [value, name]);

    useEffect(() => {
        if (isOpen && searchable && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen, searchable]);

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getDisplayValue = () => {
        if (loading) return "Загрузка...";
        if (!value) return placeholder;

        if (multiSelect) {
            const selectedValues = value as (string | number)[];
            const selectedLabels = options
                .filter(opt => selectedValues.includes(opt.value))
                .map(opt => opt.label);

            if (selectedLabels.length === 0) return placeholder;
            if (selectedLabels.length === 1) return selectedLabels[0];
            return `Выбрано: ${selectedLabels.length}`;
        }

        return options.find(opt => opt.value === value)?.label || placeholder;
    };

    const handleOptionClick = (optionValue: string | number) => {
        if (multiSelect) {
            const currentValues = (value as (string | number)[]) || [];
            let newValues: (string | number)[];

            if (currentValues.includes(optionValue)) {
                newValues = currentValues.filter(v => v !== optionValue);
            } else {
                if (maxItems && currentValues.length >= maxItems) {
                    return;
                }
                newValues = [...currentValues, optionValue];
            }

            onChange(newValues);
        } else {
            onChange(optionValue);
            setIsOpen(false);
        }
        setSearchQuery('');
    };

    return (
        <div className={`custom-select ${className}`} ref={ref}>
            <div
                className={`
            custom-select__trigger
            ${loading ? 'custom-select__trigger--disabled' : ''}
            ${isOpen ? 'custom-select__trigger--open' : ''}
            ${error ? 'custom-select__trigger--error' : ''}
        `}
                onClick={() => !loading && setIsOpen(!isOpen)}
            >
                <span className={`custom-select__value ${!value ? 'custom-select__value--placeholder' : ''}`}>
                    {getDisplayValue()}
                </span>
                <svg
                    className={`custom-select__arrow ${isOpen ? 'custom-select__arrow--open' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </div>

            {error && <div className="custom-select__error">{error}</div>}

            <CSSTransition
                in={isOpen && !loading}
                timeout={200}
                classNames="custom-select__options-animation"
                unmountOnExit
                nodeRef={optionsRef}
            >
                <div ref={optionsRef} className="custom-select__options">
                    {searchable && (
                        <div className="custom-select__search">
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Поиск..."
                                className="custom-select__search-input"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    )}

                    <div className="custom-select__options-list">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.value}
                                    className={`
                                custom-select__option
                                ${multiSelect
                                            ? (value as (string | number)[])?.includes(option.value)
                                                ? 'custom-select__option--selected'
                                                : ''
                                            : value === option.value
                                                ? 'custom-select__option--selected'
                                                : ''
                                        }
                            `}
                                    onClick={() => handleOptionClick(option.value)}
                                >
                                    {multiSelect && (
                                        <span className="custom-select__option-checkbox">
                                            {(value as (string | number)[])?.includes(option.value) && '✓'}
                                        </span>
                                    )}
                                    {option.label}
                                </div>
                            ))
                        ) : (
                            <div className="custom-select__no-results">
                                Ничего не найдено
                            </div>
                        )}
                    </div>
                </div>
            </CSSTransition>
        </div>
    );
})

CustomSelect.displayName = 'CustomSelect';

export default CustomSelect;

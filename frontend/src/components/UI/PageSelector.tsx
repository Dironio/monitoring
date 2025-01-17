import * as Select from "@radix-ui/react-select";
import "./PageSelector.css";

interface PageOption {
    value: string;
    label: string;
}

interface PageSelectorProps {
    pages: PageOption[];
    selectedPage: PageOption | null;
    onPageChange: (option: PageOption | null) => void;
    isDisabled: boolean;
}

const PageSelector: React.FC<PageSelectorProps> = ({
    pages,
    selectedPage,
    onPageChange
}) => {
    return (
        <div className="page-selector-container">
            <Select.Root
                value={selectedPage?.value}
                onValueChange={(value) => {
                    const selected = pages.find(page => page.value === value) || null;
                    onPageChange(selected);
                }}
            >
                <Select.Trigger className="page-selector-trigger">
                    <Select.Value placeholder="Select a page...">
                        {selectedPage?.label || "Select a page..."}
                    </Select.Value>
                    <Select.Icon className="page-selector-icon">
                        <ChevronDownIcon />
                    </Select.Icon>
                </Select.Trigger>

                <Select.Portal>
                    <Select.Content className="page-selector-content">
                        <Select.ScrollUpButton className="page-selector-scroll-button">
                            <ChevronUpIcon />
                        </Select.ScrollUpButton>

                        <Select.Viewport className="page-selector-viewport">
                            {pages.map((page) => (
                                <Select.Item
                                    key={page.value}
                                    value={page.value}
                                    className="page-selector-item"
                                >
                                    <Select.ItemText>{page.label}</Select.ItemText>
                                    <Select.ItemIndicator className="page-selector-item-indicator">
                                        <CheckIcon />
                                    </Select.ItemIndicator>
                                </Select.Item>
                            ))}
                        </Select.Viewport>

                        <Select.ScrollDownButton className="page-selector-scroll-button">
                            <ChevronDownIcon />
                        </Select.ScrollDownButton>
                    </Select.Content>
                </Select.Portal>
            </Select.Root>
        </div>
    );
};

export default PageSelector;


//костыль
const ChevronDownIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

const ChevronUpIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <polyline points="18 15 12 9 6 15" />
    </svg>
);

const CheckIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

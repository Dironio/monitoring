import React, { useState, Children, ReactElement } from 'react';

interface TabProps {
    children: React.ReactNode;
}

export const Tab: React.FC<TabProps> = ({ children }) => {
    return <>{children}</>;
};

interface TabPanelProps {
    children: React.ReactNode;
}

export const TabPanel: React.FC<TabPanelProps> = ({ children }) => {
    return <div className="py-4">{children}</div>;
};

interface TabListProps {
    children: React.ReactNode;
}

export const TabList: React.FC<TabListProps> = ({ children }) => {
    return <div className="flex border-b border-gray-200">{children}</div>;
};

interface TabsProps {
    children: React.ReactNode;
    defaultIndex?: number;
}

export const Tabs: React.FC<TabsProps> = ({
    children,
    defaultIndex = 0
}) => {
    const [activeIndex, setActiveIndex] = useState<number>(defaultIndex);

    // Separate the different types of children
    const childrenArray = Children.toArray(children);

    const tabList = childrenArray.find(
        child => React.isValidElement(child) && child.type === TabList
    ) as ReactElement | undefined;

    const tabPanels = childrenArray.filter(
        child => React.isValidElement(child) && child.type === TabPanel
    ) as ReactElement[];

    // Get the tabs from the TabList
    const tabs = tabList ? Children.toArray(tabList.props.children) : [];

    return (
        <div>
            <div className="flex border-b border-gray-200">
                {tabs.map((tab, index) => (
                    React.isValidElement(tab) && (
                        <button
                            key={index}
                            className={`px-4 py-2 font-medium text-sm focus:outline-none ${activeIndex === index
                                    ? 'border-b-2 border-blue-500 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            onClick={() => setActiveIndex(index)}
                        >
                            {tab.props.children}
                        </button>
                    )
                ))}
            </div>

            <div className="mt-2">
                {tabPanels[activeIndex]}
            </div>
        </div>
    );
};
import React, { useState, useEffect, useRef } from 'react';
import * as Select from '@radix-ui/react-select';
import { ChevronDown } from 'lucide-react';
import './ChipsNavigation.css';

export interface NavItem {
    path: string;
    label: string;
}

interface ChipsNavigationProps {
    items: NavItem[];
    onNavigate: (path: string) => void;
    currentPath: string;
    className?: string;
    breakpoints?: {
        mobile?: number;
        tablet?: number;
        laptop?: number;
        desktop?: number;
    };
    visibleItems?: {
        mobile?: number;
        tablet?: number;
        laptop?: number;
        desktop?: number;
    };
}

const DEFAULT_BREAKPOINTS = {
    mobile: 480,
    tablet: 768,
    laptop: 1024,
    desktop: 1280,
};

const DEFAULT_VISIBLE_ITEMS = {
    mobile: 2,
    tablet: 3,
    laptop: 4,
    desktop: Infinity,
};

const ChipsNavigation: React.FC<ChipsNavigationProps> = ({
    items,
    onNavigate,
    currentPath,
    className = '',
    breakpoints: userBreakpoints,
    visibleItems: userVisibleItems,
}) => {
    const navRef = useRef<HTMLUListElement>(null);
    const [visibleNavItems, setVisibleNavItems] = useState<NavItem[]>(items);
    const [hiddenNavItems, setHiddenNavItems] = useState<NavItem[]>([]);
    const [shouldShowSelect, setShouldShowSelect] = useState(true);

    const breakpoints = { ...DEFAULT_BREAKPOINTS, ...userBreakpoints };
    const visibleItems = { ...DEFAULT_VISIBLE_ITEMS, ...userVisibleItems };

    const getMaxVisibleItems = (containerWidth: number): number => {
        if (containerWidth <= breakpoints.mobile) {
            return visibleItems.mobile;
        } else if (containerWidth <= breakpoints.tablet) {
            return visibleItems.tablet;
        } else if (containerWidth <= breakpoints.laptop) {
            return visibleItems.laptop;
        } else {
            return visibleItems.desktop;
        }
    };

    const swapActiveItemToVisible = (
        currentVisible: NavItem[],
        currentHidden: NavItem[],
        activePath: string
    ) => {
        const activeInHiddenIndex = currentHidden.findIndex(item => item.path === activePath);

        if (activeInHiddenIndex !== -1) {
            const lastNonActiveVisibleIndex = [...currentVisible].reverse()
                .findIndex(item => item.path !== activePath);

            if (lastNonActiveVisibleIndex !== -1) {
                const actualIndex = currentVisible.length - 1 - lastNonActiveVisibleIndex;
                const activeItem = currentHidden[activeInHiddenIndex];
                const itemToHide = currentVisible[actualIndex];

                const newVisible = [...currentVisible];
                const newHidden = [...currentHidden];

                newVisible[actualIndex] = activeItem;
                newHidden[activeInHiddenIndex] = itemToHide;

                return { newVisible, newHidden };
            }
        }

        return { newVisible: currentVisible, newHidden: currentHidden };
    };

    const calculateVisibleItems = () => {
        if (!navRef.current) return;

        const navContainer = navRef.current;
        const containerWidth = navContainer.offsetWidth;
        const SELECT_WIDTH = 100;
        const GAP_WIDTH = 20;

        const maxItems = getMaxVisibleItems(containerWidth);

        let currentWidth = 0;
        let visible: NavItem[] = [];
        let hidden: NavItem[] = [];

        const firstItemWidth = navContainer.children[0]?.getBoundingClientRect().width || 0;
        visible.push(items[0]);
        currentWidth += firstItemWidth + GAP_WIDTH;

        for (let i = 1; i < items.length; i++) {
            const itemWidth = navContainer.children[i]?.getBoundingClientRect().width || 0;

            if (currentWidth + itemWidth + SELECT_WIDTH + GAP_WIDTH <= containerWidth &&
                visible.length < maxItems) {
                visible.push(items[i]);
                currentWidth += itemWidth + GAP_WIDTH;
            } else {
                hidden.push(items[i]);
            }
        }

        const result = swapActiveItemToVisible(visible, hidden, currentPath);
        setVisibleNavItems(result.newVisible);
        setHiddenNavItems(result.newHidden);
        setShouldShowSelect(result.newHidden.length > 0);
    };

    const handleSelectChange = (value: string) => {
        if (value) {
            onNavigate(value);
            setTimeout(calculateVisibleItems, 0);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            requestAnimationFrame(calculateVisibleItems);
        };

        window.addEventListener('resize', handleResize);
        setTimeout(calculateVisibleItems, 100);

        return () => window.removeEventListener('resize', handleResize);
    }, [items, currentPath]);

    return (
        <nav className={`chips-navigation ${className}`}>
            <ul className="nav-list" ref={navRef}>
                {visibleNavItems.map((item) => (
                    <li key={item.path}>
                        <button
                            onClick={() => onNavigate(item.path)}
                            className={`nav-item ${item.path === currentPath ? 'selected' : ''}`}
                        >
                            {item.label}
                        </button>
                    </li>
                ))}
                {shouldShowSelect && hiddenNavItems.length > 0 && (
                    <li className="nav-select">
                        <Select.Root onValueChange={handleSelectChange}>
                            <Select.Trigger className="nav-item select-trigger">
                                <Select.Value placeholder="Ещё" />
                                <Select.Icon className="select-icon">
                                    <ChevronDown size={20} />
                                </Select.Icon>
                            </Select.Trigger>

                            <Select.Portal>
                                <Select.Content className="select-content" position="popper" sideOffset={5}>
                                    <Select.Viewport className="select-viewport">
                                        {hiddenNavItems.map((item) => (
                                            <Select.Item
                                                key={item.path}
                                                value={item.path}
                                                className={`select-item ${item.path === currentPath ? 'selected' : ''}`}
                                            >
                                                <Select.ItemText>{item.label}</Select.ItemText>
                                            </Select.Item>
                                        ))}
                                    </Select.Viewport>
                                </Select.Content>
                            </Select.Portal>
                        </Select.Root>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default ChipsNavigation;
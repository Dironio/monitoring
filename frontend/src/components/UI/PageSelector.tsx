// import * as Select from "@radix-ui/react-select";
// import "./PageSelector.css";

// interface PageOption {
//     value: string;
//     label: string;
// }

// interface PageSelectorProps {
//     pages: PageOption[];
//     selectedPage: PageOption | null;
//     onPageChange: (option: PageOption | null) => void;
//     isDisabled: boolean;
// }

// const PageSelector: React.FC<PageSelectorProps> = ({
//     pages,
//     selectedPage,
//     onPageChange
// }) => {
//     return (
//         <div className="page-selector-container">
//             <Select.Root
//                 value={selectedPage?.value}
//                 onValueChange={(value) => {
//                     const selected = pages.find(page => page.value === value) || null;
//                     onPageChange(selected);
//                 }}
//             >
//                 <Select.Trigger className="page-selector-trigger">
//                     <Select.Value placeholder="Select a page...">
//                         {selectedPage?.label || "Select a page..."}
//                     </Select.Value>
//                     <Select.Icon className="page-selector-icon">
//                         <ChevronDownIcon />
//                     </Select.Icon>
//                 </Select.Trigger>

//                 <Select.Portal>
//                     <Select.Content className="page-selector-content">
//                         <Select.ScrollUpButton className="page-selector-scroll-button">
//                             <ChevronUpIcon />
//                         </Select.ScrollUpButton>

//                         <Select.Viewport className="page-selector-viewport">
//                             {pages.map((page) => (
//                                 <Select.Item
//                                     key={page.value}
//                                     value={page.value}
//                                     className="page-selector-item"
//                                 >
//                                     <Select.ItemText>{page.label}</Select.ItemText>
//                                     <Select.ItemIndicator className="page-selector-item-indicator">
//                                         <CheckIcon />
//                                     </Select.ItemIndicator>
//                                 </Select.Item>
//                             ))}
//                         </Select.Viewport>

//                         <Select.ScrollDownButton className="page-selector-scroll-button">
//                             <ChevronDownIcon />
//                         </Select.ScrollDownButton>
//                     </Select.Content>
//                 </Select.Portal>
//             </Select.Root>
//         </div>
//     );
// };

// export default PageSelector;


// //костыль
// const ChevronDownIcon = () => (
//     <svg
//         xmlns="http://www.w3.org/2000/svg"
//         width="24"
//         height="24"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//     >
//         <polyline points="6 9 12 15 18 9" />
//     </svg>
// );

// const ChevronUpIcon = () => (
//     <svg
//         xmlns="http://www.w3.org/2000/svg"
//         width="24"
//         height="24"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//     >
//         <polyline points="18 15 12 9 6 15" />
//     </svg>
// );

// const CheckIcon = () => (
//     <svg
//         xmlns="http://www.w3.org/2000/svg"
//         width="24"
//         height="24"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//     >
//         <polyline points="20 6 9 17 4 12" />
//     </svg>
// );









import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { SiteSelection } from './SiteSelection';

export interface PageOption {
    value: string;
    label: string;
}

interface PageSelectorProps {
    selectedPage: PageOption | null;
    selectedSite: SiteSelection | null;
    onPageChange: (page: PageOption | null) => void;
}

const PageSelector: React.FC<PageSelectorProps> = ({ selectedSite,
    selectedPage,
    onPageChange }) => {
    const [pages, setPages] = useState<PageOption[]>([]);
    // const [selectedPage, setSelectedPage] = useState<{ value: string; label: string } | null>(null);
    // const [selectedPage, setSelectedPage] = useState<PageOption | null>(() => {
    //     const savedPage = localStorage.getItem('selectedPage');
    //     return savedPage ? JSON.parse(savedPage) : null;
    // });
    const savedSite = localStorage.getItem('selectedSite');
    const site = savedSite ? JSON.parse(savedSite) : null;

    const fetchPages = async () => {
        if (!site) return;

        try {
            const response = await axios.get<string[]>(
                `${process.env.REACT_APP_API_URL}/events/pages?web_id=${site.value}`,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    }
                }
            );

            const pageOptions = response.data.map(page => ({
                value: page,
                label: page
            }));

            setPages(pageOptions);
        } catch (error) {
            console.error("Ошибка загрузки страниц", error);
            setPages([]);
        }
    };

    useEffect(() => {
        fetchPages();
    }, [selectedSite]);


    // const handlePageChange = (selected: { value: string; label: string } | null) => {
    //     setSelectedPage(selected);
    //     if (onPageChange) {
    //         onPageChange(selected);
    //     }
    //     if (selected) {
    //         localStorage.setItem('selectedPage', JSON.stringify(selected));
    //     }
    // };

    // useEffect(() => {
    //     fetchPages();
    //     // Сбрасываем выбранную страницу при смене сайта
    //     setSelectedPage(null);
    //     localStorage.removeItem('selectedPage');
    // }, [selectedSite]);
    return (
        <div className="selector-container">
            <img
                src="/assets/burger.svg"
                alt=""
                className="selector-icon"
            />
            <Select
                value={selectedPage}
                options={pages}
                onChange={onPageChange}
                isDisabled={!selectedSite}
                isSearchable={true}
                placeholder="Выберите страницу"
                className="custom-select-container"
                classNamePrefix="custom-select"
            />
        </div>
    );
};

export default PageSelector;
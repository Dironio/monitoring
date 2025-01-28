import { User } from '../models/user.model';
import { useFetchUser } from './useCurrentUser';
import { useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

const EVENT_TYPES = {
    page_view: 1,
    click: 2,
    form_submit: 3,
    scroll: 4,
    mouse_move: 5,
    input_change: 6,
    video_play: 7,
    video_pause: 8,
    video_watch_complete: 9,
    hover: 10,
    add_to_cart: 11,  //сделать обработку
    product_view: 12, //анл
    checkout_start: 13, //мб добавить
    purchase_complete: 14, //мб добавить
    error: 15,
    login: 16,
    logout: 17,
    sign_up: 18,
    share: 19,
    download: 20,
    rate: 21,
    comment: 22,
    like: 23, //мб добавить
    page_unload: 24,
};

const generateSessionId = (): string => {
    const sessionId = Math.random().toString(36).substring(2);
    localStorage.setItem('session_id', sessionId);
    localStorage.setItem('session_start', Date.now().toString());
    localStorage.setItem('session_duration', '0');
    return sessionId;
};

const getSessionId = (): string => {
    let sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
        sessionId = generateSessionId();
    }
    return sessionId;
};

const getUserAgent = (): {
    userAgent: string;
    browser: string;
    browserVersion: string;
    os: string;
    platform: string;
    language: string;
} => {
    const ua = window.navigator;
    const userAgent = ua.userAgent;

    const browserMatch = userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i);
    const browser = browserMatch ? browserMatch[1].toLowerCase() : 'unknown';
    const browserVersion = browserMatch ? browserMatch[2] : 'unknown';

    let os = 'unknown';
    if (userAgent.indexOf('Win') !== -1) os = 'Windows';
    else if (userAgent.indexOf('Mac') !== -1) os = 'MacOS';
    else if (userAgent.indexOf('Linux') !== -1) os = 'Linux';
    else if (userAgent.indexOf('Android') !== -1) os = 'Android';
    else if (userAgent.indexOf('iOS') !== -1) os = 'iOS';

    return {
        userAgent: userAgent,
        browser: browser,
        browserVersion: browserVersion,
        os: os,
        platform: ua.platform,
        language: ua.language
    };
};

const clearSession = () => {
    localStorage.removeItem('session_id');
    localStorage.removeItem('session_start');
    localStorage.removeItem('session_duration');
    localStorage.removeItem('geolocation_data');
};

const updateSessionDuration = () => {
    const sessionStart = parseInt(localStorage.getItem('session_start') || '0', 10);
    const currentDuration = parseInt(localStorage.getItem('session_duration') || '0', 10);
    const additionalDuration = Math.floor((Date.now() - sessionStart) / 1000);
    localStorage.setItem('session_duration', (currentDuration + additionalDuration).toString());
    localStorage.setItem('session_start', Date.now().toString());
};

const getSessionDuration = (): number => {
    updateSessionDuration();
    return parseInt(localStorage.getItem('session_duration') || '0', 10);
};

const getGeolocation = async (): Promise<{ country?: string; city?: string } | null> => {
    const savedGeolocation = localStorage.getItem('geolocation_data');
    if (savedGeolocation) {
        return JSON.parse(savedGeolocation);
    }

    try {
        const response = await fetch('https://ipinfo.io/json');
        if (!response.ok) throw new Error('Не удалось получить геолокацию');
        const data = await response.json();
        localStorage.setItem('geolocation_data', JSON.stringify(data));
        return data;
    } catch (error) {
        console.error('Ошибка получения геолокации:', error);
        return null;
    }
};

const sendAnalytics = async (
    eventId: number,
    eventData: Record<string, any>,
    user?: User | null,
    useGeolocation: boolean = false
) => {
    const session_id = getSessionId();
    const timestamp = new Date().toISOString();
    const totalDuration = getSessionDuration();
    const user_agent = getUserAgent();

    let geolocation = null;
    if (useGeolocation) {
        geolocation = await getGeolocation();
    }

    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/events`, {
            event_id: Number(eventId),
            event_data: { ...eventData, duration: totalDuration },
            timestamp,
            session_id,
            web_id: 1,
            user_id: user?.id || null,
            page_url: window.location.href,
            referrer: document.referrer,
            geolocation,
            user_agent,
        });
    } catch (error) {
        console.error('Ошибка отправки аналитики:', error);
    }
};

export const useAnalytics = () => {
    const { user } = useFetchUser();
    const scrollThrottleRef = useRef<NodeJS.Timeout | null>(null);
    const lastHoveredElement = useRef<string | null>(null);
    const lastInputValues = useRef<Map<string, string>>(new Map());

    const handleFormSubmit = useCallback((event: SubmitEvent) => {
        const form = event.target as HTMLFormElement;
        sendAnalytics(EVENT_TYPES.form_submit, {
            form_id: form.id || null,
            form_action: form.action || null,
            form_method: form.method || null,
        }, user);
    }, [user]);

    const handleVideoEvents = useCallback((event: Event) => {
        const video = event.target as HTMLVideoElement;
        const eventType = event.type;

        const videoEventTypes: { [key: string]: number } = {
            'play': EVENT_TYPES.video_play,
            'pause': EVENT_TYPES.video_pause,
            'ended': EVENT_TYPES.video_watch_complete
        };

        if (videoEventTypes[eventType]) {
            sendAnalytics(videoEventTypes[eventType], {
                video_src: video.src,
                video_duration: video.duration,
                current_time: video.currentTime
            }, user);
        }
    }, [user]);

    const handleInputChange = useCallback((event: Event) => {
        const target = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
        const inputIdentifier = target.id || target.name || target.className;
        const currentValue = target.value;

        if (lastInputValues.current.get(inputIdentifier) !== currentValue) {
            lastInputValues.current.set(inputIdentifier, currentValue);

            sendAnalytics(EVENT_TYPES.input_change, {
                input_type: target.type || target.tagName.toLowerCase(),
                input_id: target.id || null,
                input_name: target.name || null,
                field_type: getFieldType(target),
                is_required: target.required,
                has_validation: hasValidation(target),
                value_length: currentValue.length
            }, user);
        }
    }, [user]);

    const handleError = useCallback((event: ErrorEvent | PromiseRejectionEvent) => {
        sendAnalytics(EVENT_TYPES.error, {
            error_type: event instanceof ErrorEvent ? 'runtime' : 'promise',
            error_message: event instanceof ErrorEvent ? event.message : event.reason,
            error_stack: event instanceof ErrorEvent ? event.error?.stack : undefined,
            page_url: window.location.href,
            timestamp: new Date().toISOString()
        }, user);
    }, [user]);

    const getFieldType = (element: HTMLElement): string => {
        if (element instanceof HTMLInputElement) {
            return element.type;
        }
        if (element instanceof HTMLSelectElement) {
            return 'select';
        }
        if (element instanceof HTMLTextAreaElement) {
            return 'textarea';
        }
        return 'unknown';
    };

    const hasValidation = (element: HTMLElement): boolean => {
        if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
            const validationProps = ['minLength', 'maxLength'];

            if (element instanceof HTMLInputElement) {
                validationProps.push('pattern', 'min', 'max', 'step');
            }

            return validationProps.some(prop =>
                (element as any)[prop] !== null &&
                (element as any)[prop] !== undefined
            );
        }
        return false;
    };

    const getPageRegion = (x: number, y: number): string => {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const xRegion = x < windowWidth / 3 ? 'left' :
            x < (windowWidth * 2 / 3) ? 'center' : 'right';
        const yRegion = y < windowHeight / 3 ? 'top' :
            y < (windowHeight * 2 / 3) ? 'middle' : 'bottom';

        return `${yRegion}-${xRegion}`;
    };

    const handleAuthEvent = useCallback((eventType: number, userData: any) => {
        sendAnalytics(eventType, {
            user_id: userData?.id,
            auth_method: userData?.authMethod,
            timestamp: new Date().toISOString()
        }, user);
    }, [user]);

    const trackAuth = {
        login: (userData: any) => handleAuthEvent(EVENT_TYPES.login, userData),
        logout: (userData: any) => handleAuthEvent(EVENT_TYPES.logout, userData),
        signUp: (userData: any) => handleAuthEvent(EVENT_TYPES.sign_up, userData)
    };

    const handleHover = useCallback((event: MouseEvent) => {
        const target = event.target as HTMLElement;
        const elementId = target.id || target.className || target.tagName;

        if (elementId !== lastHoveredElement.current) {
            lastHoveredElement.current = elementId;
            sendAnalytics(EVENT_TYPES.hover, {
                element_id: target.id || null,
                element_tag: target.tagName,
                element_class: target.className || null,
            }, user);
        }
    }, [user]);

    useEffect(() => {
        const sessionId = getSessionId();

        sendAnalytics(EVENT_TYPES.page_view, {}, user, true);

        const handleClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            sendAnalytics(EVENT_TYPES.click, {
                x: event.clientX,
                y: event.clientY,
                tag: target.tagName,
                id: target.id || null,
                classes: target.className || null,
                text: target.innerText?.slice(0, 100) || null,
            }, user);
        };

        const handleScroll = () => {
            if (scrollThrottleRef.current) {
                clearTimeout(scrollThrottleRef.current);
            }

            scrollThrottleRef.current = setTimeout(() => {
                const scrollTop = window.scrollY || document.documentElement.scrollTop;
                const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrollPercentage = (scrollTop / scrollHeight) * 100;

                sendAnalytics(EVENT_TYPES.scroll, {
                    scrollTop,
                    scrollPercentage: Math.min(scrollPercentage, 100),
                }, user);
            }, 500);
        };

        const handleBeforeUnload = () => {
            updateSessionDuration();
            sendAnalytics(EVENT_TYPES.page_unload, {
                duration: getSessionDuration()
            }, user, true);
            clearSession();
        };

        document.addEventListener('click', handleClick);
        document.addEventListener('scroll', handleScroll);
        document.addEventListener('mouseover', handleHover);
        document.addEventListener('submit', handleFormSubmit as EventListener);
        window.addEventListener('beforeunload', handleBeforeUnload);

        document.querySelectorAll('video').forEach(video => {
            video.addEventListener('play', handleVideoEvents);
            video.addEventListener('pause', handleVideoEvents);
            video.addEventListener('ended', handleVideoEvents);
        });

        return () => {
            document.removeEventListener('click', handleClick);
            document.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mouseover', handleHover);
            document.removeEventListener('submit', handleFormSubmit as EventListener);
            window.removeEventListener('beforeunload', handleBeforeUnload);

            document.querySelectorAll('video').forEach(video => {
                video.removeEventListener('play', handleVideoEvents);
                video.removeEventListener('pause', handleVideoEvents);
                video.removeEventListener('ended', handleVideoEvents);
            });

            if (scrollThrottleRef.current) {
                clearTimeout(scrollThrottleRef.current);
            }
        };
    }, [user, handleFormSubmit, handleVideoEvents, handleHover]);
};

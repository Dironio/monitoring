import { useEffect } from 'react';
import { User } from '../models/user.model';
import axios from 'axios';
import { useFetchUser } from './useCurrentUser';

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
    add_to_cart: 11,
    product_view: 12,
    checkout_start: 13,
    purchase_complete: 14,
    error: 15,
    login: 16,
    logout: 17,
    sign_up: 18,
    share: 19,
    download: 20,
    rate: 21,
    comment: 22,
    like: 23,
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

const clearSession = () => {
    localStorage.removeItem('session_id');
    localStorage.removeItem('session_start');
    localStorage.removeItem('session_duration');
};

const updateSessionDuration = () => {
    const sessionStart = parseInt(localStorage.getItem('session_start') || '0', 10);
    const currentDuration = parseInt(localStorage.getItem('session_duration') || '0', 10);
    const additionalDuration = Math.floor((Date.now() - sessionStart) / 1000);
    localStorage.setItem('session_duration', (currentDuration + additionalDuration).toString());
    localStorage.setItem('session_start', Date.now().toString());
};

const getSessionDuration = (): number => {
    return parseInt(localStorage.getItem('session_duration') || '0', 10);
};

const getGeolocation = async (): Promise<{ country?: string; city?: string } | null> => {
    try {
        const response = await fetch('https://ipinfo.io/json');
        if (!response.ok) throw new Error('Не удалось получить геолокацию');
        return await response.json();
    } catch (error) {
        console.error('Ошибка получения геолокации:', error);
        return null;
    }
};

const sendAnalytics = async (
    eventId: number,
    eventData: Record<string, any>,
    user?: User | null,
    duration?: number
) => {
    const session_id = getSessionId();
    const totalDuration = duration || getSessionDuration();
    const timestamp = new Date().toISOString();
    const geolocation = await getGeolocation();

    try {
        console.log('Отправляемые данные:', {
            event_id: Number(eventId),
            event_data: { ...eventData, duration: totalDuration },
            timestamp,
            session_id,
            web_id: 1,
            user_id: user?.id || null,
            page_url: window.location.href,
            referrer: document.referrer,
            geolocation,
        });

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
        }, {
            headers: { 'Content-Type': 'application/json' },
        });

        console.log("Ответ:", response.data);
    } catch (error) {
        console.error('Ошибка отправки аналитики:', error);
    }
};

export const useAnalytics = () => {
    const { user } = useFetchUser();

    useEffect(() => {
        const sessionId = getSessionId();
        const startTime = Date.now();

        const resetSessionTimeout = () => {
            updateSessionDuration();
        };

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
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercentage = (scrollTop / scrollHeight) * 100;

            sendAnalytics(EVENT_TYPES.scroll, {
                scrollTop,
                scrollPercentage: Math.min(scrollPercentage, 100),
            }, user);
        };

        const handleBeforeUnload = () => {
            updateSessionDuration();
            const duration = getSessionDuration();
            sendAnalytics(EVENT_TYPES.page_unload, { duration }, user);
            clearSession();
        };

        document.addEventListener('mousemove', resetSessionTimeout);
        document.addEventListener('keydown', resetSessionTimeout);
        document.addEventListener('click', handleClick);
        document.addEventListener('scroll', handleScroll);
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            document.removeEventListener('mousemove', resetSessionTimeout);
            document.removeEventListener('keydown', resetSessionTimeout);
            document.removeEventListener('click', handleClick);
            document.removeEventListener('scroll', handleScroll);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [user]);
};

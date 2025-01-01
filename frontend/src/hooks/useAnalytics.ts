import { useEffect } from 'react';

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
    return sessionId;
};

const getSessionId = (): string => {
    let sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
        sessionId = generateSessionId();
    }
    return sessionId;
};

const getGeolocation = async (): Promise<{ country?: string; city?: string } | null> => {
    try {
        const response = await fetch('https://ipapi.co/json/');
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
    userId?: number
) => {
    const session_id = getSessionId();
    const timestamp = new Date().toISOString();
    const geolocation = await getGeolocation();

    try {
        await fetch(`${process.env.REACT_APP_API_URL}/events`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                event_id: eventId,
                event_data: eventData,
                timestamp,
                session_id,
                user_id: userId || null,
                page_url: window.location.href,
                referrer: document.referrer,
                geolocation,
            }),
        });
    } catch (error) {
        console.error('Ошибка отправки аналитики:', error);
    }
};

export const useAnalytics = (userId?: number) => {
    useEffect(() => {
        const session_id = getSessionId();
        const startTime = Date.now();

        const handleClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            sendAnalytics(EVENT_TYPES.click, {
                x: event.clientX,
                y: event.clientY,
                tag: target.tagName,
                id: target.id || null,
                classes: target.className || null,
                text: target.innerText?.slice(0, 100) || null,
            }, userId);
        };

        const handleBeforeUnload = () => {
            const duration = Math.floor((Date.now() - startTime) / 1000);
            sendAnalytics(EVENT_TYPES.page_unload, { duration }, userId);
        };

        let sessionTimeout: NodeJS.Timeout;
        const resetSessionTimeout = () => {
            clearTimeout(sessionTimeout);
            sessionTimeout = setTimeout(() => {
                const duration = Math.floor((Date.now() - startTime) / 1000);
                sendAnalytics(EVENT_TYPES.page_unload, { sessionEnd: true, duration }, userId);
            }, 15 * 60 * 1000); // подумать, мб уменьшить
        };

        document.addEventListener('mousemove', resetSessionTimeout);
        document.addEventListener('keydown', resetSessionTimeout);
        document.addEventListener('click', handleClick);
        window.addEventListener('beforeunload', handleBeforeUnload);

        sendAnalytics(EVENT_TYPES.page_view, {}, userId);

        return () => {
            clearTimeout(sessionTimeout);
            document.removeEventListener('mousemove', resetSessionTimeout);
            document.removeEventListener('keydown', resetSessionTimeout);
            document.removeEventListener('click', handleClick);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [userId]);
};
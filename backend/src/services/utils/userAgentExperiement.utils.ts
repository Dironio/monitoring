interface Browser {
    name: string;
    version: string;
}

export interface FormattedUserAgent {
    browser: Browser;
    os: string;
    device: string;
}

export const parseUserAgent = (userAgent: string): FormattedUserAgent => {
    const ua = userAgent.toLowerCase();
    let browser: Browser = {
        name: '',
        version: ''
    };
    let os = '';
    let device = 'Desktop';

    if (ua.includes('yabrowser')) {
        browser.name = 'Yandex';
        const match = ua.match(/yabrowser\/(\d+\.\d+)/);
        browser.version = match ? match[1] : '';
    } else if (ua.includes('chrome')) {
        browser.name = 'Chrome';
        const match = ua.match(/chrome\/(\d+\.\d+)/);
        browser.version = match ? match[1] : '';
    } else if (ua.includes('firefox')) {
        browser.name = 'Firefox';
        const match = ua.match(/firefox\/(\d+\.\d+)/);
        browser.version = match ? match[1] : '';
    } else if (ua.includes('safari') && !ua.includes('chrome')) {
        browser.name = 'Safari';
        const match = ua.match(/version\/(\d+\.\d+)/);
        browser.version = match ? match[1] : '';
    }

    if (ua.includes('windows')) {
        os = 'Windows';
    } else if (ua.includes('macintosh') || ua.includes('mac os')) {
        os = 'MacOS';
    } else if (ua.includes('linux')) {
        os = 'Linux';
    } else if (ua.includes('android')) {
        os = 'Android';
        device = 'Mobile';
    } else if (ua.includes('iphone') || ua.includes('ipad')) {
        os = 'iOS';
        device = ua.includes('ipad') ? 'Tablet' : 'Mobile';
    }

    return {
        browser,
        os,
        device
    };
};
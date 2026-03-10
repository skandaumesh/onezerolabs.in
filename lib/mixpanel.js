import mixpanel from 'mixpanel-browser';

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

const isEnabled = Boolean(MIXPANEL_TOKEN);

if (isEnabled && typeof window !== 'undefined') {
    mixpanel.init(MIXPANEL_TOKEN, {
        debug: process.env.NODE_ENV !== 'production',
        track_pageview: true,
        persistence: 'localStorage',
        autocapture: true,
        record_sessions_percent: 100,
    });
}

export const Mixpanel = {
    identify: (id) => {
        if (isEnabled && typeof window !== 'undefined') mixpanel.identify(id);
    },
    alias: (id) => {
        if (isEnabled && typeof window !== 'undefined') mixpanel.alias(id);
    },
    track: (name, props) => {
        if (isEnabled && typeof window !== 'undefined') mixpanel.track(name, props);
    },
    people: {
        set: (props) => {
            if (isEnabled && typeof window !== 'undefined') mixpanel.people.set(props);
        },
    },
};

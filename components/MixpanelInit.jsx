'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Mixpanel } from '@/lib/mixpanel';

export default function MixpanelInit() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Track page views on route change
        Mixpanel.track('Page View', {
            path: pathname,
            url: window.location.href,
        });
    }, [pathname, searchParams]);

    return null;
}

import './bootstrap';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import React from 'react';

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.jsx');
        const path = `./Pages/${name}.jsx`;
        const loader = pages[path];
        if (!loader) {
            throw new Error(`Inertia page not found: ${name}`);
        }
        return loader();
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});

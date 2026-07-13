import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg 
            {...props} 
            viewBox="0 0 24 24" 
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Tomato Stem & Leaves */}
            <path d="M12 2a1 1 0 0 1 .993.883L13 3v1.17c1.78.22 3.32.96 4.41 2.05a1 1 0 0 1-1.42 1.41C15.11 6.75 13.7 6.13 12 6.02V8a1 1 0 0 1-1.993.117L10 8V6.02C8.3 6.13 6.89 6.75 6.01 7.63a1 1 0 1 1-1.42-1.41C5.68 5.13 7.22 4.39 9 4.17V3a1 1 0 0 1 1-1h2zm0 6c4.97 0 9 3.58 9 8s-4.03 8-9 8-9-3.58-9-8 4.03-8 9-8z" />
        </svg>
    );
}

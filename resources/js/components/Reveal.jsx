import { useEffect, useRef, useState } from 'react';

/**
 * Reveal — плавное появление элемента при попадании во вьюпорт.
 * direction: 'up' | 'left' | 'right' | 'zoom'
 * delay: задержка в ms (для каскадных анимаций)
 * as: тег (по умолчанию div)
 */
export default function Reveal({ children, direction = 'up', delay = 0, as: Tag = 'div', className = '', ...rest }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        if (typeof IntersectionObserver === 'undefined') {
            setVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setVisible(true);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <Tag
            ref={ref}
            className={`reveal reveal--${direction}${visible ? ' reveal--visible' : ''}${className ? ` ${className}` : ''}`}
            style={{ '--reveal-delay': `${delay}ms` }}
            {...rest}
        >
            {children}
        </Tag>
    );
}

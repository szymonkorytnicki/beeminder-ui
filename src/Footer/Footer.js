import css from './Footer.module.css'

export function Footer({ children }) {
    return <footer className={css.footer}>{children}</footer>
}

export function FooterLink({ to, children, component, ...props }) {
    const Component = component ?? 'a'
    return (
        <Component
            to={Component !== 'a' ? to : undefined}
            href={Component === 'a' ? to : undefined}
            className={css.footerLink}
            {...props}
        >
            {children}
        </Component>
    )
}

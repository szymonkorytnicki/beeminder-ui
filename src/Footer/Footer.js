import css from './Footer.module.css'

export function Footer({ children }) {
    return <footer className={css.footer}>{children}</footer>
}

export function FooterLink({ to, children }) {
    return (
        <a href={to} className={css.footerLink} target="_blank">
            {children}
        </a>
    )
}

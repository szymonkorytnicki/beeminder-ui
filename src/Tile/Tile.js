import css from './Tile.module.css'
import classNames from 'classnames'

export function Tile({ className, color, split, center, component, ...props }) {
    const Component = component ? component : 'div'
    return (
        <Component
            {...props}
            className={classNames(
                css.tile,
                split && css.tileSplit,
                color && css[color],
                center && css.center,
                className
            )}
        />
    )
}

// TODO big? maybe more size opts
export function TileTitle({ className, big, component, ...props }) {
    const Component = component ? component : 'h1'
    return (
        <Component
            {...props}
            className={classNames(css.title, big && css.titleBig, className)}
        />
    )
}

export function TileHeader({ className, component, ...props }) {
    const Component = component ? component : 'header'
    return (
        <Component {...props} className={classNames(css.header, className)} />
    )
}

export function TileFooter({ className, center, component, ...props }) {
    const Component = component ? component : 'footer'
    return (
        <Component
            {...props}
            className={classNames(css.footer, center && css.center, className)}
        />
    )
}

export function TilePledge({ className, component, ...props }) {
    // TODO terrible name
    const Component = component ? component : 'div'
    return (
        <Component {...props} className={classNames(css.pledge, className)} />
    )
}

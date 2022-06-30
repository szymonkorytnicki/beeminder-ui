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
export function TileTitle({ className, big, colored, component, ...props }) {
    const Component = component ? component : 'h1'
    return (
        <Component
            {...props}
            className={classNames(
                css.title,
                big && css.titleBig,
                colored && css.coloredTitle,
                className
            )}
        />
    )
}
export function TileTitleDescription({ className, component, ...props }) {
    const Component = component ? component : 'span'
    return (
        <Component
            {...props}
            className={classNames(css.titleDescription, className)}
        />
    )
}

export function TileHeader({ className, component, ...props }) {
    const Component = component ? component : 'header'
    return (
        <Component {...props} className={classNames(css.header, className)} />
    )
}

export function TileContent({ className, center, component, ...props }) {
    const Component = component ? component : 'div'
    return (
        <Component
            {...props}
            className={classNames(css.content, center && css.center, className)}
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

export function TileStat({ label, value, onClick }) {
    return (
        <div className={css.stat} onClick={onClick}>
            <div className={css.statLabel}>{label}</div>
            <div>{value}</div>
        </div>
    )
}

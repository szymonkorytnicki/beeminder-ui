import {useQuery} from 'react-query';
import './GoalsWidget.css';
import {FAKE_DATA} from './FAKE_DATA';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

function fetchGoals() {
    return fetch(
        `https://www.beeminder.com/api/v1/users/${process.env.REACT_APP_BEEMINDER_USERNAME}/goals.json?auth_token=${process.env.REACT_APP_BEEMINDER_APIKEY}`
    ).then(r => r.json());
}

export function GoalsWidget() {
    const { isLoading, isError, data } = useQuery(['goals'], () => fetchGoals());

    useEffect(() => {
        if (data) {
            window.localStorage.setItem('beeminder-ui-items', data.filter(g => !g.secret).length);
        }
    }, [data]);


    if (isError) {
        return "Loading error";
    }

    return <div className="goals">
    {(isLoading ? FAKE_DATA : data.filter(goal => !goal.secret)).map(goal => {
        return <Goal key={goal.slug} {...goal}/>
    })}
    </div>
}

function Goal({slug, roadstatuscolor, curval, safebuf, todayta, gunits}) {
    return <Link to={"/g/" + slug}  className={`goal goal--${slug} goal--${roadstatuscolor}`}>
        <span className='goal__slug'>{slug}</span>
        {/* <header className='goal__topbar'>{curval} {gunits} {todayta ? "●" : ""}</header> */}
        <header className='goal__topbar'>{todayta ? "●" : ""}</header>
        <footer className='goal__footer'>{getSafebufCopy(safebuf)} </footer>
    </Link>
}

function getSafebufCopy(num) {
    if (num === 0) {
        return 'due today';
    }
    if (num === 1) {
        return 'due tomorrow';
    }
    return num + ' days';
}
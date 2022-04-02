import {useQuery} from 'react-query';
import './GoalsWidget.css';
import {FAKE_DATA} from './FAKE_DATA';
import { useEffect } from 'react';

function fetchGoals() {
    return fetch(
        `https://www.beeminder.com/api/v1/users/${process.env.REACT_APP_BEEMINDER_USERNAME}/goals.json?auth_token=${process.env.REACT_APP_BEEMINDER_APIKEY}`
    ).then(r => r.json());
}

export function GoalsWidget() {
    const { isLoading, isError, data } = useQuery(['goals'], () => fetchGoals());


    useEffect(() => {
        if (data) {
            window.localStorage.setItem('beeminder-ui-items', data.length);
        }
    }, [data]);


    if (isError) {
        return "Loading error";
    }

    return <div className="goals">
    {(isLoading ? FAKE_DATA : data).map(goal => {
        return <Goal key={goal.slug} {...goal}/>
    })}
    </div>
}

function Goal({slug, roadstatuscolor, curval, limsum, todayta, gunits}) {
    return <div className={`goal goal--${slug} goal--${roadstatuscolor}`}>
        {slug} 
        <header className='goal__topbar'>{curval} {gunits} {todayta ? "●" : ""}</header>
        <footer className='goal__footer'>{limsum}</footer>
    </div>
}
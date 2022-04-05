import { useParams } from "react-router";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import './GoalPage.css';
import { formatRelative } from 'date-fns';

const BASE_DATE = new Date();

function fetchGoal(slug) {
    return fetch(
        `https://www.beeminder.com/api/v1/users/${process.env.REACT_APP_BEEMINDER_USERNAME}/goals/${slug}.json?auth_token=${process.env.REACT_APP_BEEMINDER_APIKEY}`
    ).then(r => r.json());
}

export function GoalPage() {
    const {goalSlug} = useParams();
    const { isLoading, isError, data } = useQuery(['goal-' + goalSlug], () => fetchGoal(goalSlug));

    if (isError) {
        return "Loading error";
    }

    if (isLoading) {
        // TODO render some sweet placeholder
        return <>
            <h1><Link to="/">{process.env.REACT_APP_BEEMINDER_USERNAME}</Link> / {goalSlug}</h1>
        </>
    }
    
    return <>
        <h1><Link to="/">{process.env.REACT_APP_BEEMINDER_USERNAME}</Link> / {goalSlug}</h1>
        {/* <div className="goal-page__graph-wrapper">
        <img src={data.graph_url} alt="Graph" className="goal-page__graph"/>
        </div> */}
        
        {data.recent_data.map(datapoint => {
            return <div key={datapoint.created_at}>{datapoint.comment} <span className="datapoint__light">{formatRelative(new Date(datapoint.created_at), BASE_DATE)}</span></div>
        })}
    </>
}
// todo add some utility like tailwind or bootstrap to not reinvent layout and typgraphy
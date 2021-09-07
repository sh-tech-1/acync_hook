import React, {useState} from 'react';
import {
    useAsyncTask,
    useAsyncCombineSeq,
    useAsyncTaskDelay,
    useAsyncRun,
    useAsyncTaskFetch
} from "react-hooks-async";
import logo from './logo.svg';
import './App.css';

const fetchUser = async ({signal}, id) => {
    const response = await fetch(`https://api.github.com/users/${id}`, {signal});
    const data = await response.json();
    return data;
}

const Err = ({error}) => <div>Error: {error.name} {error.message}</div>;

const Loading = ({abort}) => <div>Loading...
    <button onClick={abort}>Abort</button>
</div>;
const GetUser = ({id}) => {
    const task = useAsyncTask(fetchUser);
    useAsyncRun(task, id);
    const {pending, error, result, abort} = task
    if (pending) return <div>Loading...
        <button onClick={abort}>Abort</button>
    </div>;
    if (error) return <div>Error: {error.name} {error.message}</div>;
    return <div>Name: {result.url}</div>;

}

const GitHubSearch = ({query}: any) => {
    const url = `https://api.github.com/search/repositories?q=${query}`
    const delayTask = useAsyncTaskDelay(500);
    const fetchTask = useAsyncTaskFetch(url);
    const combinedTask = useAsyncCombineSeq(delayTask, fetchTask);
    useAsyncRun(combinedTask);
    if (delayTask.pending) return <div>Waiting...</div>;
    if (fetchTask.error) return <Err error={fetchTask.error}/>;
    if (fetchTask.pending) return <Loading abort={fetchTask.abort}/>;
    // return (
    // <ul>
    //     {fetchTask.result.items.map(({id, name, html_url}) => (
    //         <li key={id}><a target="_blank" href={html_url}>{name}</a></li>
    //     ))}
    // </ul>
    // );
};

function App() {
    const [query, setQuery] = useState('');

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <div>
                    <GetUser id={'defunkt'}/>
                </div>
                <div>
                    Query:
                    <input value={query} onChange={e => setQuery(e.target.value)}/>
                    {query && <GitHubSearch query={query}/>}
                </div>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
}

export default App;

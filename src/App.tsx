import Search from "./componentns/Search.tsx";
import {useState, useEffect, ReactNode} from "react";

// API - Application programming Interface - a set of rules that allows one software application to talk to another
const API_BASE_URL= 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
    method:'GET',
    headers:{
        accept: 'application/json',
        Authorization: `Bearer  ${API_KEY}`

    }

}

function P(props: { className: string, children: ReactNode }) {
    return null;
}

const App = () => {
    const [searchTerm, setsearchTerm] = useState<string>('');

    const [errorMessage, setErrorMessage] = useState<string>("");

    const fetchMovies = async()=>{

        try{
            const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

            const response = await fetch(endpoint,API_OPTIONS);
        }catch(error){
            console.log(`Error fetching movies. ${error}`);
        setErrorMessage("Error fetcing movies. pLease tyr again later");
        }
    }

    useEffect(()=>{
        fetchMovies();

    },[])

    return (
        <main>
            <div className={'pattern'}/>
           <div className={'wrapper'}>
            <header>
                <img src='./hero.png' alt='Hero Banner'/>
                <h1>Find <span className={'text-gradient'}>Movies</span> You'll Enjoy Without the Hassle</h1>

                <Search searchTerm={searchTerm} setsearchTerm={setsearchTerm} />


            </header>

        <section className={'all-movies'}>
            <h2>All MOvies</h2>

            {errorMessage && <P className={'text-red-500'}>{errorMessage}</P>}
        </section>

           </div>
        </main>
    )
}
export default App

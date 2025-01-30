import Search from "./componentns/Search.tsx";
import {useState, useEffect, } from "react";
import Spinner from "./componentns/Spinner.tsx";


const API_BASE_URL= 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.TMDB_API_KEY;





const App = () => {
    const [searchTerm, setsearchTerm] = useState<string>('');

    const [errorMessage, setErrorMessage] = useState<string>("");

    const [movieList, setMovielist] =useState([]);

    const [isLoading, setIsLoading] = useState<boolean>(false);



    const fetchMovies = async()=>{
        setIsLoading(true);
        setErrorMessage('');

        try{
            const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

            // const response = await fetch(endpoint, {headers})

            const headers = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${API_KEY}`,
                }
            };

const response = await fetch(endpoint, headers);
            console.log(response)
            if(!response.ok){
                console.log('error occured');
                throw new Error('Failed to fetch movies');
            }
            const data = await response.json();
            // console.log(data)

            if(data.Response === 'false'){

                setErrorMessage(data.Error || 'failed to fetch movies');
                setMovielist([]);
                return;
            }
setMovielist((data.results))
        }catch(error){
            console.log(`Error fetching movies. ${error}`);
        setErrorMessage("Error fetcing movies. pLease tyr again later");
        }
        finally{
            setIsLoading(false);
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
            <h2 className={"mt-[40px]"}>All MOvies</h2>

            {/*{errorMessage && <P className={'text-red-500'}>{errorMessage}</P>}*/}
            {isLoading ? (
                <Spinner/>
            ) :
            errorMessage ? (
                <p className={'text-red-500'}>{errorMessage}</p>
            ) :
                (
                    <ul>
                        {movieList.map((movie)=>(
                            <p key ={movie.id} className={'text-white'}>{movie.title}</p>
                        ))}
                    </ul>
                )}

        </section>

           </div>
        </main>
    )
}
export default App

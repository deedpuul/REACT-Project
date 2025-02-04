import { Client, Databases, ID, Query } from "appwrite";

const DATABASE_ID = import.meta.env.VITE_APPRWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPRWRITE_COLLECTION_ID;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

const client = new Client()
.setEndpoint('https://cloud.appwrite.io/v1')
.setProject(PROJECT_ID)

const database = new Databases(client)

interface Movie {
    id: number;
    title: string;
    vote_average: number;
    poster_path: string;
    release_date: string;
    original_language: string;
  }

interface TrendingMovie {
    $id: string;
    title: string;
    poster_url: string;
    count: number;
}

export const updateSearchCount = async(searchTerm: string, movie: Movie) => {
    // console.log(PROJECT_ID, DATABASE_ID, COLLECTION_ID);
// use appwrite sdk to check if  the search term exists in the database
try{
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.equal('searchTerm', searchTerm),
    ])
    if(result.documents.length > 0){
        const doc = result.documents[0];
        await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
            count: doc.count + 1,
        })
    }else{
        await database.createDocument(DATABASE_ID,COLLECTION_ID,ID.unique(),{
            searchTerm,
            count:1,
            movie_id:movie.id,
            poster_url:`https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        })
    }
}catch(error){
    
    console.error('error in appwrite' , error);
}

}
export const getTrendingMovies = async ()=>{
    try{
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID,[
            Query.limit(5),
            Query.orderDesc("count")
        ])
        return result.documents;
    }
    catch(error){
        console.log(error);
    }

}
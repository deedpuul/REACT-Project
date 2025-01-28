

// const person ={
//    name: "John",
//    age: 25,
//    location: "New York",
// }
// const{name, age, location} = person; destructuring in js


const Search = ({searchTerm,setsearchTerm} : {searchTerm: string, setsearchTerm :  React.Dispatch<React.SetStateAction<string>> }) => {
    return (
<div className={'search'}>
    <div>
        <img src={'search.svg'} alt={'Search'} />

        <input
            type={'text'}
            placeholder={'Search through thousands of movies'}
            value={searchTerm}
            onChange={(e)=>setsearchTerm(e.target.value)}
            />
    </div>
</div>    )
}
export default Search




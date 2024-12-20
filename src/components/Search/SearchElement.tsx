import React from "react";


interface Props{
    type:"users"|'prods',
    name:string,
}
const SearchElement:React.FC<Props> = ({type,name}) => {
    return (
        <div className="search-item">
            <div className='search-prop'>
                <p>{name}</p>
            </div>
        </div>
    )
}
export default SearchElement;

import React, {useEffect} from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../css/searchPages.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import {User} from "../../types/userType";
import SearchElement from "../../components/Search/SearchElement";

const UserSearch: React.FC = () => {
    const [search, setSearch] = React.useState<string>("");
    const [users, setUsers] = React.useState<string[]>([]);
    const handleSearch = () =>{
        if (search.trim() !== "") {
            setUsers((prevUsers) => [...prevUsers, search.trim()]);
            setSearch(""); // Limpa o campo após adicionar
            console.log("search: ", search);
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter") {
            e.preventDefault(); // Previne a quebra de linha no textarea
            handleSearch(); // Chama a função handleSearch
        }
    };

    return (
        <html>
            <Header/>
            <div className='search-main'>
                <div className='search-content'>
                    {/*<p>Pesquisar Usuarios: </p>*/}
                    <textarea
                        rows={1}
                        placeholder={"Pesquisar Usuários"}
                        onChange={(e)=> setSearch(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button className='search-button' onClick={handleSearch}>
                        <FontAwesomeIcon icon={faMagnifyingGlass}></FontAwesomeIcon>
                    </button>
                </div>
                <div className='search-content search-itens'>
                    {users.map((user,key) => (
                        <SearchElement key={key} type={'users'} name={user}/>
                    ))}
                </div>
            </div>
            <Footer/>
        </html>
    )
}
export default UserSearch;

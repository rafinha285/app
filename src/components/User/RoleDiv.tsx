import React from "react";
import {UserRole} from "../../types/types";


interface props{
    role:UserRole
}
const RoleDiv:React.FC<props> = ({role}) =>{
    return(
        <div className="role-div">
            <p>{role}</p>
        </div>
    )
}
export default RoleDiv
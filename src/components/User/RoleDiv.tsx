import React from "react";
import { roles } from "../../types/types";


interface props{
    role:roles
}
const RoleDiv:React.FC<props> = ({role}) =>{
    return(
        <div className="role-div">
            <p>{role}</p>
        </div>
    )
}
export default RoleDiv
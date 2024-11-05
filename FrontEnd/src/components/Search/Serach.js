import React, { useEffect, useState } from "react";
import "./Search.css";
import Axios from "axios";
import { AuthorInfo } from "../../pages/AuthorInfo/AuthorInfo";

import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";




export function Search() {
    const [SerachTerm, setSerachTerm] = useState("");
    const [usersarray, setusersarray] = useState("");

    useEffect(() => {
        Axios.get(`http://localhost:3001/user`).then((response) => {
            console.log('resp' + JSON.stringify(response.data))
            const responsedata = (response.data);
            setusersarray(responsedata)
            console.log(response.data)
        });
    }, []);


    return (
        <>
            <input class="Nav_searchWR" type="text" placeholder="🔎 Serch" onChange={(event) => {
                setSerachTerm(event.target.value);
            }} />
            {SerachTerm == "" ? <></> : <div className="search-results">
                {usersarray.filter((val) => {
                    if (SerachTerm !== "") {
                        if (val.Name.toLocaleLowerCase().includes(SerachTerm.toLocaleLowerCase())) {
                            return val;
                        }
                    }
                }).map((val, key) => {
                    return (
                        <AuthorInfo authorid={val.id} ></AuthorInfo>
                    );
                })
                }
            </div>}
        </>
    );
}



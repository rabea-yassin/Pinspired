import React, { useEffect, useState } from "react";
import "./Gridcontaner.css";
import { Card } from "../../components/Card/Card";




export function Gridcontaner(props) {



    const [postsarray, setpostsarray] = useState([props.array]);



    return (

        <div className="gridCentered">
        {props.array.map((val, key) => {
            //we need to get is this user have save this post or not and then select to add save or un save
            return (
            <Card
                id={val.picpath}  >
              </Card>
            );
        })}
    </div>
    );
}



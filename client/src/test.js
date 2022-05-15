import React from "react";
import {useEffect} from "react";
import {loadModel} from "./universalSentenceEncoder";
import {determineRelatednessOfSentences} from "./universalSentenceEncoder";



function Test() {

    useEffect(()=>{
        loadModel();
        },
        []
    )

    const str1 = "this is text";
    const str2 = "THis is STRING";
    const str3 = "apple";
    const arr = [str1,str2,str3];
    const some = determineRelatednessOfSentences(arr,1);

    console.log(some);
    console.log(some.toString());

    const determine= () => {
        determineRelatednessOfSentences(arr,1).then((res) => {
            console.log(res);
        });
    }


    return(
        <div>
        <h1>TEST</h1>
        <button onClick={determine}>hey</button>
        </div>
    )
}


export default Test;


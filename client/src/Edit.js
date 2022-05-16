import React, {useEffect, useState} from "react";
import profilepic from "./simpson.jpg";
import "./edit.css"
import {
    getQAPIMethod,
    createQAPIMethod,
    deleteQByIdAPIMethod,
    updateQAPIMethod,
}    from "./api/client";

function Edit(){

    const [questions,setQuestions] = useState([]);

    useEffect(()=>{
            const q1 = {
                text: "New Question",
                type: "1",
                date: Date(),
                answer: "",
            }
            const q = [];
            q.push(q1);
            setQuestions(q);
        },
        []
    )

    const insertQuestion = () => {
        const newQ = {
            text: "New Question",
            type: "1",
            date: Date(),
            answer: "",
        }
        const clonedData = [...questions];
        clonedData.push(newQ);
        setQuestions(clonedData);
        console.log("inserted");
        console.log(questions);
        console.log(clonedData);
    };

    const deleteQuestion = (q) => {
        const clonedData = [...questions];
        const index = clonedData.indexOf(q);
        if (index > -1) {
            clonedData.splice(index, 1);
        }
        setQuestions(clonedData);
    }

    const handletext = (e, i) => {
        const clonedData = [...questions];
        clonedData[i].text = e.target.value;
        setQuestions(clonedData);
    };
    const handletype = (e, i) => {
        const clonedData = [...questions];
        clonedData[i].type = e.target.value;
        setQuestions(clonedData);
    };

    return (
        <div className="mainpagediv">
            <div className="topnav">
                <div className="title">Day Logger</div>
                <a className="pages" href="index.html">Log Day</a>
                <a className="pages" href="index.html">Edit Questions</a>
                <a className="pages" href="index.html">View Data</a>
                <img src={profilepic} className="profile" alt="MyImage"></img>
            </div>
            <div className="maincontainer">
                <div>
                    <div className="mainsubtitle">Edit Questions</div>
                    <span className="material-icons" onClick={insertQuestion} style={{float: 'right',right:'15px', top:"25px"}}>add_circle_outline</span>
                </div>
                <div className="questions">
                    {questions.map((q,i) => (
                        <div className="qcontainer">
                            <div>
                                <input type="text" value={q.text} onChange={(e) => handletext(e, i)} name="text" required/>
                            </div>
                            <div>
                                <select className="select" onChange={(e) => handletype(e, i)} value={q.type}>
                                    <option value="1">number</option>
                                    <option value="2">boolean</option>
                                    <option value="3">text</option>
                                    <option value="4">multiple choice</option>
                                </select>
                                <span className="material-icons" onClick={deleteQuestion(q)} style={{float: 'right',right:'15px',top:'15px'}}>delete_outline</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Edit;
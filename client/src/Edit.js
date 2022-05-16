import React, {useEffect, useState} from "react";
import profilepic from "./simpson.jpg";
import "./edit.css"

function Edit(){

    const [questions,setQuestions] = useState([]);

    useEffect(()=>{
        const q = [];
        const q1 = {
            text: "some text",
            type: "1",
            date: Date(),
            answer: "3",
        };
        const q2 = {
            text: "some text2",
            type: "2",
            date: Date(),
            answer: "1",
        }

        q.push(q1);
        q.push(q2);
        setQuestions(q);
        },
        []
    )

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
                <div className="searchbar">
                    <div>Edit Questions</div>
                    <span className="material-icons">add_circle_outline</span>
                </div>
                <div className="questions">
                    {questions.map((question) => (
                        <div className="qcontainer">
                            <div>
                                <input type="text" value={question.text} name="text" required/>
                            </div>
                            <div>
                                <select className="select" value={question.type}>
                                    <option value="1">number</option>
                                    <option value="2">boolean</option>
                                    <option value="3">text</option>
                                    <option value="4">multiple choice</option>
                                </select>
                                <span className="material-icons" style={{float: 'right',right:'15px',top:'15px'}}>delete_outline</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Edit;
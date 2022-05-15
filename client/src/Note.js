import { useHistory } from "react-router-dom";
import React, {useState} from "react";
import {useEffect} from "react";
import {useRef} from "react";
import { WithContext as ReactTags } from 'react-tag-input';
import {loadModel} from "./universalSentenceEncoder";
import {determineRelatednessOfSentences} from "./universalSentenceEncoder";
import './app.css';
import {
    getNotesAPIMethod,
    createNotesAPIMethod,
    deleteNoteByIdAPIMethod,
    updateNoteAPIMethod,
    getUsersAPIMethod,
    updateUserAPIMethod,
    logoutUsersAPIMethod,
    uploadImageToCloudinaryAPIMethod
} from "./api/client";

function Note() {

    const [notes, setNotes] = useState([]);
    const [users, setUsers] = useState([]);
    const [save, setSave] = useState(null);
    const [input, setInput] = useState("");
    const [currentNote, setcurrentNote] = useState( {
        _id: 0,
        text: "New Note",
        date: Date(),
        tags: []
    });
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [selected, setSelected] = useState("1")
    const [, setProfile] = useState([name,email,selected]);
    const selectRef = useRef(null);
    const searchRef = useRef(null);
    const [filterdata, setFilterdata] = useState(notes);
    const [searchinput, setSearchinput] = useState(null);

    const defaultimgURL = 'https://res.cloudinary.com/dohhyunlee/image/upload/v1652078922/vs8ietj10d8fkwc3gsx8.jpg';

    const [profilepic, setprofilepic] = useState(defaultimgURL);

    useEffect(()=>{
            loadModel();
            setText(false);
            getNotesAPIMethod().then((notes) => {
                let sortednotes = notes.sort((a, b) => a.lastUpdatedDate.localeCompare(b.lastUpdatedDate))
                setNotes(sortednotes);
                setFilterdata(sortednotes);
            });
            getUsersAPIMethod().then((users) => {
                setUsers(users);
                setName(users[0].name);
                setEmail(users[0].email);
                setSelected(users[0].colorScheme);
                selectRef.current.value = users[0].colorScheme;
                setProfile(users[0]);
                setprofilepic(users[0].profileURL);
            })
        },
        []
    )

    useEffect(()=>{
            getNotesAPIMethod().then((notes) => {
                console.log(notes);
                let sortednotes = notes.sort((a, b) => a.lastUpdatedDate.localeCompare(b.lastUpdatedDate))
                setNotes(sortednotes);
                setFilterdata(sortednotes);
            });
        },
        [save,input]
    )



    const [listEmpty, setlistEmpty] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const openModal = () => {
        setModalOpen(true);
    };
    const closeModal = () => {
        setModalOpen(false);
    };

    const ModalOff = (e) => {
        const clicked = e.target.closest('.modal-content');
        if (clicked) return;
        else {
            setModalOpen(false);
        }
    };

    const getTime = () => {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth()+1;
        let day = date.getDate();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        let ampm = "";
        let minzero = "";
        let seczero = "";
        if (hours>=12){
            hours -= 12;
            ampm = " PM";
        } else {
            ampm = " AM";
        }
        if (minutes<=10){
            minzero = "0";
        }
        if (seconds<=10){
            seczero = "0";
        }
        return month + "/" + day + "/" + year + ",    " + hours + ':' + minzero + minutes + ':' + seczero + seconds + ampm;
    };

    const [curtag, setCurtag] = useState([]);

    const textRef = useRef(null);

    const deleteNote = () => {
        deleteNoteByIdAPIMethod(currentNote).then((response) => {
            console.log("Deleted the note on the server");
            history.push(`/notes/`);
            console.log("currentNote");
            console.log(currentNote);
            console.log("notes[notes.length-1]");
            console.log(notes[notes.length-1]);
            console.log(currentNote._id === notes[notes.length-1]._id);
            if(currentNote._id === notes[notes.length-1]._id){
                if(notes.length === 1){
                    console.log("111111111");
                    setlistEmpty(true);
                    setCurtag([]);
                    setText(false);
                } else {
                    console.log("2222222222");
                    const newCurnote = notes[notes.length-2];
                    setcurrentNote(newCurnote);
                    setInput(newCurnote.text);
                    setCurtag(newCurnote.tags);
                }
            } else{
                console.log("33333333");
                const newCurnote2 = notes[notes.length-1];
                setcurrentNote(newCurnote2);
                setInput(newCurnote2.text);
                setCurtag(newCurnote2.tags);
            }
            setSearchinput("");
        });
        console.log("deleted");
        setSave(Date);
    }

    const getFirstline = (text) =>{
        let lines = text.split("\n");
        return lines[0];
    }

    const history = useHistory();

    const insertNote = () => {
        if (listEmpty === true) {
            setlistEmpty(false);
            setText(false);
        }
        if(!sidebar){
            setText(true);
        }
        const newNote = {
            text: "New Note",
            lastUpdatedDate: Date(),
            dateText: getTime(),
            tags: [],
            sim: 0
        }
        console.log("insert1");
        createNotesAPIMethod(newNote, (response) => {
            console.log("Created the note on the server");
            console.dir(response);
            history.push(`/notes/${response._id}`);
        }).then((response) => {
            console.log(response);
            setInput(response.text);
            setcurrentNote(response);
            setCurtag(response.tags);
            setSave(Date);
        });
        console.log(currentNote);
        setSearchinput("");
    };

    const [, setErrorMessage] = useState(null);



    const update = () => {
        currentNote.text = input;
        currentNote.lastUpdatedDate = Date();
        currentNote.dateText = getTime();
        currentNote.sim = 0;
        updateNoteAPIMethod(currentNote).then((response) => {
            console.log("Updated the note on the server");
            setErrorMessage(null);
        }).catch(err => {
            console.error('Error updating note data: ' + err);
            setErrorMessage(err.toLocaleString());
        })
    }


    const onChangetext = (e) => {
        setInput(e.target.value);
        notes.map((note) => {
            note.sim = 0;
            updateNoteAPIMethod(note).then((response) => {
            }).catch(err => {
                console.error('Error updating note data: ' + err);
            })
        })
        update();
    }

    const handleChangeSelect = (e) => {
        setSelected(e.target.value);
    };

    const saveProfile = () => {
        console.log("saveProfile");
        setProfile([name,email,selected,profilepic]);
        users[0].name = name;
        users[0].email = email;
        users[0].colorScheme = selected;
        users[0].profileURL = profilepic;
        notes.map((note) => {
            note.sim = 0;
            updateNoteAPIMethod(note).then((response) => {
            }).catch(err => {
                console.error('Error updating note data: ' + err);
            })
        })
        updateUserAPIMethod(users[0]).then((response) => {
            console.log("Updated the note on the server");
            setErrorMessage(null);
        }).catch(err => {
            console.error('Error updating note data: ' + err);
            setErrorMessage(err.toLocaleString());
        })
    }

    const [, setTags] = useState([]);

    const handleDelete = (i) => {
        currentNote.tags = currentNote.tags.filter((tag, index) => index !== i);
        setTags(currentNote.tags);
        setCurtag(currentNote.tags);
        updateNoteAPIMethod(currentNote).then((response) => {
            console.log("Updated the note on the server");
            setErrorMessage(null);
        }).catch(err => {
            console.error('Error updating note data: ' + err);
            setErrorMessage(err.toLocaleString());
        })
    };

    const handleAddition = (tag) => {
        currentNote.tags.push(tag);
        setTags(tag);
        setCurtag(currentNote.tags);
        updateNoteAPIMethod(currentNote).then((response) => {
            console.log("Updated the note on the server");
            setErrorMessage(null);
        }).catch(err => {
            console.error('Error updating note data: ' + err);
            setErrorMessage(err.toLocaleString());
        })
    };

    const handleDrag = (tag, currPos, newPos) => {
        currentNote.tags.splice(currPos, 1);
        currentNote.tags.splice(newPos, 0, tag);
        setTags([tag, ...currentNote.tags]);
        setCurtag(currentNote.tags);
        updateNoteAPIMethod(currentNote).then((response) => {
            console.log("Updated the note on the server");
            setErrorMessage(null);
        }).catch(err => {
            console.error('Error updating note data: ' + err);
            setErrorMessage(err.toLocaleString());
        })
    };

    const onTagUpdate = (i, newTag) => {
        currentNote.tags.splice(i, 1, newTag);
        setTags(currentNote.tags);
        updateNoteAPIMethod(currentNote).then((response) => {
            console.log("Updated the note on the server");
            setErrorMessage(null);
        }).catch(err => {
            console.error('Error updating note data: ' + err);
            setErrorMessage(err.toLocaleString());
        })
    };

    const [sidebar, setSidebar] = useState(false);
    const [text, setText] = useState(true);

    const backButton = () => {
        setSidebar(true);
        setText(false);
    }


    const searchNotes = (event) => {
        let value = event.target.value;
        let result = [];
        console.log(value);
        result = notes.filter((data) => {
            return data.text.search(value) !== -1;
        });
        setFilterdata(result);
        if(result.length !== 0){
            setcurrentNote(result[result.length-1]);
            setInput(result[result.length-1].text);
            setTags(result[result.length-1].tags);
        }
    }

    const logoutUser = () => {
        notes.map((note) => {
            note.sim = 0;
            updateNoteAPIMethod(note).then((response) => {
            }).catch(err => {
                console.error('Error updating note data: ' + err);
            })
        })
        logoutUsersAPIMethod().then((response) => {
            console.log("logout");
        }).catch(err => {
            console.error('Error logout: ' + err);
        })
        history.push("/mainpage");
    }

    const removeImg = () => {
        setprofilepic(defaultimgURL);
    }

    const handleImageSelected = (event) => {
        console.log("New File Selected");
        if (event.target.files && event.target.files[0]) {

            // Could also do additional error checking on the file type, if we wanted
            // to only allow certain types of files.
            const selectedFile = event.target.files[0];
            console.dir(selectedFile);

            const formData = new FormData();
            const unsignedUploadPreset = 'dohhyunlee_unsigned'
            formData.append('file', selectedFile);
            formData.append('upload_preset', unsignedUploadPreset);

            console.log("Cloudinary upload");
            uploadImageToCloudinaryAPIMethod(formData).then((response) => {
                console.log("Upload success");
                console.dir(response);
                setprofilepic(response.url);
            }).then(saveProfile).then(() => {console.log("end")});
        }
    }

    const clickNote = async (note) => {
        const curI = notes.indexOf(note) + 1;
        const text1 = note.text;
        const textarr = [text1];
        console.log(textarr);
        notes.map((note) => {
            note.sim = 0;
            console.log(note.text);
            textarr.push(note.text);
            updateNoteAPIMethod(note).then((response) => {
                console.log("update1");
            }).catch(err => {
                console.error('Error updating note data: ' + err);
            })
        })
        determineRelatednessOfSentences(textarr,0).then((res)=>{
            let i = 1;
            notes.map((note) => {
                console.log(note.text);
                console.log(res[i].score);
                if(i !== curI){
                    console.log("curI");
                    console.log(curI);
                    if(res[i].score>=0.5){
                        note.sim = 1;
                        updateNoteAPIMethod(note).then((response) => {
                            console.log("update2");
                        }).catch(err => {
                            console.error('Error updating note data: ' + err);
                        })
                    }
                }
                i++;
            })
        })
    }



    return (
        <div>
            <div className="rows">
                <div className="row">
                    <div className='logo'>
                        <img src={profilepic} className="profile"
                             onClick={openModal} alt="MyImage"></img>
                        <div className="title">My Notes</div>
                        <span className="material-icons" id="noteadd" onClick={insertNote}
                              style={{float:'right', top:'6px'}}>note_add</span>
                    </div>
                    <div className={sidebar ? 'logo2T' : 'logo2'}>
                        <img src={profilepic} className="profile"
                             onClick={openModal} alt="MyImage"></img>
                        <div className="title" style={{margin:"0 150px 0 0"}} >My Notes</div>
                        <span className="material-icons" id="noteadd" onClick={insertNote}
                              style={{float:'right', top:'6px'}}>note_add</span>
                    </div>
                    <div className="main">
                        <span className="material-icons" style={{left:"20px"}}>notification_add</span>
                        <span className="material-icons" style={{left:"45%"}}>person_add_alt</span>
                        <span className="material-icons" onClick={deleteNote}
                              style={{float:"right"}}>delete_outline</span>
                    </div>
                    <div className={sidebar ? 'main2T' : 'main2'}>
                        <span className="material-icons" onClick={backButton}
                              style={{left:"20px"}}>arrow_back</span>
                        <span className="material-icons" style={{left:"25%"}}>notification_add</span>
                        <span className="material-icons" style={{left:"55%"}}>person_add_alt</span>
                        <span className="material-icons" onClick={deleteNote}
                              style={{float:"right"}}>delete_outline</span>
                    </div>
                </div>
                <div className="row2">
                    <div className="sidebar">
                        <div className="searchbar">
                            <span className="material-icons" style={{left:"20px"}}>search</span>
                            <input className="notesearch" type="search" ref={searchRef} value={searchinput} onChange={(event) => {searchNotes(event); setSearchinput(event.target.value)}} placeholder="Search all notes"></input>
                        </div>
                        <div className={listEmpty ? 'emptyList' : 'noteList'}>
                            {filterdata.map((note) => (
                                <div key={note._id} className={`listed ${note._id === currentNote._id ? "on" : note.sim === 1 && "sim"}`}
                                     onMouseDown={async () => {setSidebar(false);  setText(true); setcurrentNote(note); setCurtag(note.tags); setSearchinput(""); const click = await clickNote(note); setFilterdata(notes);}}
                                     onClick={async () => {setInput(note.text); setSave({...Date})}}>
                                    <div className="note">{getFirstline(note.text)}
                                        <div>
                                            <div className="curdate">{note.dateText}</div>
                                            <div className={`similar ${note.sim === 1 && "on"}`}>similar</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={sidebar ? 'sidebar2T' : 'sidebar2'}>
                        <div className="searchbar">
                            <span className="material-icons" style={{left:"20px"}}>search</span>
                            <input className="notesearch" type="search" ref={searchRef} value={searchinput} onChange={(event) => {searchNotes(event); setSearchinput(event.target.value)}} placeholder="Search all notes"></input>
                        </div>
                        <div className={listEmpty ? 'emptyList' : 'noteList'}>
                            {filterdata.map((note) => (
                                <div key={note._id} className={`listed ${note._id === currentNote._id ? "on" : note.sim === 1 && "sim"}`}
                                    onMouseDown={() => {setSidebar(false);setText(true); setcurrentNote(note); setCurtag(note.tags); setSearchinput(""); clickNote(note); setFilterdata(notes);}}
                                    onClick={async () => {setInput(note.text); setSave({...Date})}}>
                                    <div className="note">{getFirstline(note.text)}
                                        <div>
                                            <div className="curdate">{note.dateText}</div>
                                            <div className={`similar ${note.sim === 1 && "on"}`}>similar</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={text ? 'text' : 'textF'} ref={textRef}>
                    <textarea className="textfield" value={input} onChange={onChangetext}
                              style={{height:"100%", width:"100%",border:"none", resize: "none"}}></textarea>
                        <div className="tagDiv">
                            <ReactTags
                                handleDelete={handleDelete}
                                handleAddition={handleAddition}
                                handleDrag={handleDrag}
                                onTagUpdate={onTagUpdate}
                                placeholder="Enter a tag"
                                autofocus={false}
                                allowDeleteFromEmptyInput={true}
                                autocomplete={true}
                                readOnly={false}
                                allowUnique={true}
                                allowDragDrop={true}
                                inline={true}
                                allowAdditionFromPaste={true}
                                editable={true}
                                tags={curtag}/>
                        </div>
                    </div>
                </div>
            </div>
            <div id="id01" className={modalOpen ? 'modal' : 'closemodal'} onClick={(e) => ModalOff(e)}>
                <form className="modal-content">
                    <div className="container">
                        <div className="editp">
                            <h2 style={{marginTop : '5px', marginBottom: '40px'}}>Edit Profile</h2>
                            <span onClick={closeModal} className="close"
                                  title="Close Modal">&times;</span>
                        </div>
                        <div className="prof">
                            <img src={profilepic} className="profile" style={{marginLeft:"30px"}} alt="MyImage"/>
                            <label htmlFor="cloudinary" className="newimg">
                                Add new image
                            </label>
                            <input id="cloudinary" type="file" name="image" accept="image/*" onChange={handleImageSelected}/>
                            <label onClick={removeImg} className="removeimg">
                                Remove image
                            </label>
                        </div>
                        <label htmlFor="name"><b>Name</b></label>
                        <input type="text" value={name} onChange={(e)=> setName(e.target.value)} placeholder="Enter Name" name="name" required/>

                        <label htmlFor="email"><b>Email</b></label>
                        <input type="text" value={email} onChange={(e)=> setEmail(e.target.value)} placeholder="Enter Email" name="email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$" title="Invalid Email"
                               required/>

                        <label htmlFor="color"><b>Color Scheme</b></label>
                        <select className="select" onChange={handleChangeSelect} ref={selectRef}>
                            <option value="1">Light</option>
                            <option value="2">Dark</option>
                        </select>

                        <div className="clearfix">
                            <button className="savebtn" onClick={saveProfile}>Save</button>
                            <button className="logout" onClick={logoutUser}>Logout</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Note;
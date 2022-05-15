import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import {
    loginUsersAPIMethod,
    createUsersAPIMethod,
} from "./api/client";
import './main.css';

function Main(){

    const history = useHistory();

    const defaultimgURL = 'https://res.cloudinary.com/dohhyunlee/image/upload/v1652078922/vs8ietj10d8fkwc3gsx8.jpg';

    const [modalOpen, setModalOpen] = useState(false);
    const [loginError, setloginError] = useState(false);
    const [registerError, setregisterError] = useState(false);

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

    const [account, setAccount] = useState({
        email: "",
        password: ""
    })

    const onChangeAccount = (e) => {
        setAccount({
            ...account,
            [e.target.name]: e.target.value,
        });
    };

    const onSubmitAccount = (e) => {
        e.preventDefault();
        loginUsersAPIMethod(account).then((response) => {
            console.log("Login Success");
            console.dir(response);
            console.log(response.body);
            history.push({pathname:`/notepage/${account.email}`});
        }).catch(err => {
            console.error('Login Error: ' + err);
            setloginError(true);
        })
    };

    const [cname, setName] = useState("");
    const [cemail, setEmail] = useState("");
    const [cpassword, setPassword] = useState("");

    const onChangeName = (event) => {
        const target = event.target;
        const value = target.value;
        setName(value);
    }
    const onChangeEmail = (event) => {
        const target = event.target;
        const value = target.value;
        setEmail(value);
    }
    const onChangePassword = (event) => {
        const target = event.target;
        const value = target.value;
        setPassword(value);
    }

    const ValidateEmail = (mail) =>
    {
        if (/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(mail))
        {
            return (true)
        }
        return (false)
    }

    const createUser = () => {
        const newUser = {
            name: cname,
            email: cemail,
            colorScheme: "1",
            password: cpassword,
            profileURL: defaultimgURL
        }
        createUsersAPIMethod(newUser).then((response) => {
            console.log("Created the note on the server");
            console.dir(response);
            history.push(`/notepage/${cemail}`);
        }).catch(err => {
            console.error('Error updating note data: ' + err);
            //setErrorMessage(err.toLocaleString());
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(ValidateEmail(cemail) && cpassword.length >= 6){
            createUser();
        } else {
            setregisterError(true);
        }
    }



        return (
            <div className="mainpagediv">
                <div className="maincontainer">
                    <div className="maintitle">Notes</div>
                    <div className="mainsubtitle">Organize all your thoughts in one place.</div>
                    <div className="inputcontainer">
                        <label htmlFor="email"><b>Email</b></label>
                        <input type="text" placeholder="Enter Email" name="email" onChange={onChangeAccount} pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$" title="Three letter country code" required/>
                        <label htmlFor="Password"><b>Password</b></label>
                        <input type="password" placeholder="Enter Password" name="password" onChange={onChangeAccount} required/>
                        <div className={loginError ? 'yesE' : 'nonE'}>Error: Invalid email and/or password</div>
                        <button onClick={onSubmitAccount}>Log In</button>
                        <hr></hr>
                        <button onClick={openModal}>Create New Account</button>
                    </div>
                </div>
                <div id="id01" className={modalOpen ? 'modal' : 'closemodal'} onClick={(e) => ModalOff(e)}>
                    <form className="modal-content" onSubmit={handleSubmit} action="">
                        <div className="container">
                            <div className="editp">
                                <h2 style={{marginTop : '5px', marginBottom: '40px'}}>Sign Up</h2>
                                <span onClick={closeModal} className="close"
                                      title="Close Modal">&times;</span>
                            </div>
                            <label htmlFor="name"><b>Name</b></label>
                            <input type="text" placeholder="Enter Name" name="name" onChange={onChangeName} required/>

                            <label htmlFor="email"><b>Email</b></label>
                            <input type="text" placeholder="Enter Email" name="email" onChange={onChangeEmail}
                                   required/>

                            <label htmlFor="Password"><b>Password</b></label>
                            <input type="password" placeholder="Enter Password" name="password" onChange={onChangePassword}
                                   required/>
                            <div className={registerError ? 'yesE' : 'nonE'}>Error: Invalid email and/or password</div>
                            <div className="signup">
                                <button type="submit" className="signupbtn">Sign Up</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
}

export default Main;
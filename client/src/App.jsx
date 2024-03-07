import './App.css';
import { useState, useRef, useEffect } from "react";
import Axios from "axios";

function App() {

  return (
    <div className="App">
      <Nav />
      <section>
        {<Dashboard />}
      </section>
    </div>
  );
};


const Nav = () => {

  return (
    <div className='nav'>
      <img className='logo' src='proteqt.jpg' alt='logo'></img>
    </div>
  );
};


const Dashboard = () => {

  let [title, setTitle] = useState("");
  let [password, setPassword] = useState("");
  const Title = useRef("");


  // calling server API to send Title and Password
  const addPassword = (e) => {
    Axios.post("http://localhost:3001/addpswd", { title: title, password: password });
  };

  const [passwordList, setPasswordList] = useState([])

  useEffect(() => {
    Axios.get("http://localhost:3001/getpswd").then((response) => {
      setPasswordList(response.data)
    })
  }, [])

  const decryptPassword = (encryption) => {
    Axios.post("http://localhost:3001/decryptpassword", {
      password: encryption.password,
      iv: encryption.iv,
    }).then((response) => {
      setPasswordList(
        passwordList.map((val, index) => {
          return val.id === encryption.id
            ? {
              id: val.id,
              password: response.data,
              title: val.title,
              iv: val.iv,
              showpass: index
            }
            : val;
        })
      );
    });
  };


  const deletePassword = (deletionId) => {
    Axios.post("http://localhost:3001/deletepassword", { password: deletionId.password })
    window.location.reload(false)
  }

  return (
    <>
      <div className='inputBox'>
        <h1>Enter Your Credentials 🔒</h1>
        <form onSubmit={addPassword}>
          <div className='inputForm'>

            <input
              type='text'
              id='title'
              ref={Title}
              placeholder='Ex. Facebook, GitHub'
              onChange={(event) => { setTitle(event.target.value) }}
            />

            <input
              type='text'
              id='password'
              placeholder='Ex. Pass@1234'
              onChange={(event) => { setPassword(event.target.value) }}
            />

            <button
              className='submitBtn'
              type="submit"
              disabled={!title || !password}
            >Submit
            </button>

          </div>
        </form>
      </div>

      <div className='passwordsList' >
        <table>
          <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Password</th>
            <th>Show Password</th>
            <th>Delete</th>
          </tr>
          {passwordList && passwordList.map((val, index) => {
            return (
              <tr key={index}>
                <td>{val.id}</td>
                <td>{val.title}</td>
                <td><input type={val.showpass === index ? "text" : "password"} value={val.password} disabled={true} readOnly={true} aria-readonly={true} /></td>
                <td className='table-cell' onClick={() => { decryptPassword({ id: val.id, password: val.password, iv: val.iv }) }}> 👀 </td>
                <td className='table-cell' onClick={() => { deletePassword({ password: val.password }) }} > ❌ </td>
              </tr>
            )
          })}
        </table>
      </div>
    </>
  );
};


export default App;


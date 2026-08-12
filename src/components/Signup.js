import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
     let navigate = useNavigate();
     const [credentials,setcredentials] = useState({name:"",email:"",password:"",cpassword:""});
         
        const HandleSubmit= async (e)=>{
            e.preventDefault();
           const {name,email,password,cpassword}=credentials;
            try {
              const response = await fetch("http://localhost:5000/api/auth/createuser", {
                
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ name,email,password,cpassword}),
              });
    
              const json = await response.json();
              console.log(json);
              if (json.success && json.authToken) {
                // save the auth token
                localStorage.setItem('token', json.authToken);
                navigate("/");
              } 
            } catch (error) {
              console.error('Network or server error:', error);
            }
          }
             const onChange = (e) => {
        setcredentials({ ...credentials, [e.target.name]: e.target.value });
      };
  return (
   <div className="container my-3">
      <form onSubmit={HandleSubmit} >
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            aria-describedby="name"
            placeholder="Enter name"
            value={credentials.name}
            onChange={onChange} 
          />
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Email address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            value={credentials.email}
            onChange={onChange}
          />
          <small id="emailHelp" className="form-text text-muted">
            We'll never share your email with anyone else.
          </small>
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={onChange} minLength={5} required
          />
        </div>
           <div className="form-group">
          <label htmlFor="exampleInputPassword1">Confirm Password</label>
          <input
            type="password"
            className="form-control"
            id="cpassword"
            name="cpassword"
            placeholder="Confirm Password"
            value={credentials.cpassword}
           onChange={onChange} minLength={5} required
          />
        </div>
        <button type="submit" className="btn btn-primary my-3" >
          Submit
        </button>
      </form>
    </div>
  )
}

export default Signup;

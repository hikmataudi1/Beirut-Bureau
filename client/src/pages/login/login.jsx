import React from "react";
import { useEffect,useState } from "react";
import axios from "axios";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from "react-hook-form";
import "./login.css"


const  url = "http://localhost:8000/api";
function Login(){


    const schema=yup.object({
        email: yup.string().email("invalid email").required("email is required"),
        password:yup.string().required(""),
    }).required("");


    const {register ,handleSubmit ,formState:{errors}}=useForm(
            {resolver:yupResolver(schema)});

    const onSubmit = (val) => {
    const { confirmPassword, ...dataToSend } = val;

    axios.post(url+"/login", dataToSend)
        .then(res => console.log(res.data))
        .catch(err => console.log(err));
};


    return(
        <>
        <div className="main-div">
        <form onSubmit={handleSubmit(onSubmit)} className="form_login">
            <div className="div_input">
            <label className="label">Email Address</label><br/>
            <input
                className="input_form" 
                type="email"
                {...register("email")}
                placeholder="example@gmail.com"
            />
            {errors.email&&<p className="err">{errors.email?.message}</p>}
            </div>
            <div className="div_input">
            <label className="label">password</label><br/>
            <input 
                className="input_form" 
                type="password"
                {...register("password")}
                placeholder="********"
            />
            {errors.password&&<p className="err">{errors.password?.message}</p>}
            </div>

            <button 
                type="submit" 
                className="button">
                    login
                    </button>
        </form>
        </div>
        </>
    )
}
export default Login;

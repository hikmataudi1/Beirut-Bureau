import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast'; 
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import "./CitizenRegistration.css";


function CitizenRegistration(){


const navigate = useNavigate();
    //
    
    //Validation Schema
    const schema=yup.object({
        name:yup.string().required('Name is required'),
        email:yup.string().email('Invalid email format').required('Email is required'),
        password:yup.string().required('Password is required'),
        contact :yup.string()
        .matches(/^[0-9]+$/,"The phone number must contain only digits")
        .min(8,'Phone number must be at least 8 diget')
        .required('Contact number is required'),
        confirmPassword: yup.string()
        .oneOf([yup.ref('password'), null], 'The passwords do not match')
        .required('Please confirm your password'),
    }).required();




    //Hook Form
    const {register ,handleSubmit ,formState:{errors}}=useForm(
        {resolver:yupResolver(schema)});
        
    //submit handler 
    const onSubmit = (data)=>{
        axios.post('/citizens',data).then (res=>{
        // Feedback Message for Success
        toast.success('Registration Successful ! Redirecting ....');
    
    // Redirect to the login page after two seconds
    setTimeout(() => {
            navigate('/login');
        }, 2000);
    }
).catch(err=>toast.error(err.response?.data?.message || err.message))
};


    return (
        <div className="div_main">
            <div  className='form-container'>
                <h2 className="header">Registration</h2>
                
                <form onSubmit={handleSubmit(onSubmit)} className="form">
                    
                    {/* Name Field */}
                    <div >
                        <label className="label">Full Name</label><br/>
                        <input 
                            {...register("name")}
                            className="input_form"
                            placeholder="Enter your full name"
                        />
                        {/* Feedback Message for Error */}
                        {errors.name&&<p className="err">{errors.name?.message}</p>}
                    </div>

                    {/* Email Field */}
                    <div>
                        <label className="label">Email Address</label><br/>
                        <input 
                            type="email"
                            {...register("email")}
                            className="input_form"
                            placeholder="example@email.com"
                        />
                        {errors.email&&<p className="err">{errors.email?.message}</p>}
                    </div>

                    {/* Contact Field */}
                    <div>
                        <label className="label" >Phone Number</label><br/>
                        <input 
                            type="tel"
                            {...register("contact")}
                            className="input_form"
                            placeholder="70123456"
                        />
                        {errors.contact&&<p className="err">{errors.contact?.message}</p>}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="label">Password</label><br/>
                        <input 
                            type="password"
                            {...register("password")}
                            className="input_form"
                            placeholder="********"
                        />
                        {errors.password&&<p className="err">{errors.password?.message}</p>}
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                        <label className="label">Confirm Password</label><br/>
                        <input 
                            type="password"
                            {...register("confirmPassword")}
                            className="input_form"
                            placeholder="********"
                        />
                        {errors.confirmPassword&&<p className="err">{errors.confirmPassword?.message}</p>}
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        className="button"
                    >
                        Register
                    </button>
                </form>

                <div className="label">
                    Already have an account? <Link to="/login" className="Login">Login here</Link>
                </div>
            </div>
        </div>
    );
}

export default CitizenRegistration ;
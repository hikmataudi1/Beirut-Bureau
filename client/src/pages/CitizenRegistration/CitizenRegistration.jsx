import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast'; 
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import "./CitizenRegistration.css";


const  url = "http://localhost:8000/api";
function CitizenRegistration() {

const navigate = useNavigate();

    
// Validation Schema
const schema = yup.object({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().required('Password is required'),
    contact: yup.string()
        .matches(/^[0-9]+$/, "The phone number must contain only digits")
        .min(8, 'Phone number must be at least 8 digits')
        .required('Contact number is required'),
    // confirmPassword: yup.string()
    //     .oneOf([yup.ref('password'), null], 'The passwords do not match')
    //     .required('Please confirm your password'),
    national_id: yup.string().required('National id is required'),

    date_of_birth: yup
        .date()
        .typeError("Date of birth must be a valid date")
        .required("Date of birth is required")
        .max(new Date(), "Date of birth cannot be in the future")
        .min(new Date(1900, 0, 1), "Date of birth is too old")
        .test(
            "age",
            "You must be at least 18 years old",
            value => {
                if (!value) return false;
                const today = new Date();
                const age = today.getFullYear() - value.getFullYear();
                const month = today.getMonth() - value.getMonth();
                const day = today.getDate() - value.getDate();
                return age > 18 || (age === 18 && month >= 0 && day >= 0);
            }
        ),
}).required();


// Hook Form
const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
});


// Submit handler 
const onSubmit = (data) => {
    //date is in another form , so i formatted it to match the backend fomat
          const formattedData = {
    ...data,
    date_of_birth: data.date_of_birth.toISOString().split("T")[0]
  };


axios.post(url+'/citizens', formattedData)
    .then(res => {
        toast.success('Registration Successful! Redirecting ....');

       setTimeout(() => navigate('/login'), 2000);

   })
    .catch(err => toast.error(err.response?.data?.message || err.message));
};


return (
    <div className="div_main">
        <div className='form-container'>
            <h2 className="header">Registration</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="form_Registration">
                <div className='div_'>
                    <div>
                        <label className="label" >User name</label><br/>
                            <input 
                            type="text"
                            {...register("name")}
                            className="input_form"
                            placeholder="you name"
                            />
                        {errors.name && <p className="err">{errors.name.message}</p>}
                    </div>

                    <div>
                    <label className="label">Email Address</label><br/>
                        <input
                        className="input_form" 
                        type="email"
                        {...register("email")}
                        placeholder="example@gmail.com"
                    />
                    {errors.email&&<p className="err">{errors.email?.message}</p>}
                    </div>

                    <div>
                    <label className="label">password</label><br/>
                    <input 
                        className="input_form" 
                        type="password"
                        {...register("password")}
                        placeholder="********"
                    />
                    {errors.password&&<p className="err">{errors.password?.message}</p>}
                    </div>

                    <div>
                            <label className="label" >National id</label><br/>
                            <input 
                                type="text"
                                {...register("national_id")}
                                className="input_form"
                                placeholder="11223344"
                            />
                            {errors.national_id && <p className="err">{errors.national_id.message}</p>}
                    </div>
                </div>
                <div className='div_'>
                    <div>
                            <label className="label" >Phone Number</label><br/>
                            <input 
                                type="tel"
                                {...register("contact")}
                                className="input_form"
                                placeholder="70123456"
                            />
                            {errors.contact && <p className="err">{errors.contact.message}</p>}
                    </div>

                    <div>
                            <label className="label">Date of Birth</label><br/>
                            <input 
                                type="date"
                                {...register("date_of_birth")}
                                className="input_form"
                            />
                            {errors.date_of_birth && <p className="err">{errors.date_of_birth.message}</p>}
                    </div>

                    <div>
                            <label className="label">Address</label><br/>
                            <input 
                                type="text"
                                {...register("address")}
                                className="input_form"
                                placeholder="Address"
                            />
                    </div>
                    <div className='div_2'>
                        <button type="submit" className="button">
                            Register 
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
);
}export default CitizenRegistration;
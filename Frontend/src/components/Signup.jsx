import React, { useState } from 'react'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from 'sonner'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import logo from '../assets/logo.png'; 


function Signup() {
    const [loading , setloading] = useState(false);
    const [input , setinput] = useState({
        username:"",
        email:"",
        password:""
    })
    const navigate = useNavigate();

    const ChangeEventHandler = (e)=>{
        // e.target is the DOM element that triggered the event. In your case, it’s the <input> element the user typed in.
        setinput({...input , [e.target.name]:e.target.value});

    }
    async function  signupHandler(e){
        e.preventDefault(); //prevent from refreshing
        // console.log(input)

        try{
            setloading(true);
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/user/register` , input , {
                headers:{
                    'Content-Type':'application/json' //tells the backend that its json formate data
                },
                withCredentials:true
            });
            if(res.data.success){
                navigate("/login")
                toast.success(res.data.msg);
                setinput({
                    username:"",
                    email:"",
                    password:""
                });
            }

        }
        catch(err){
            console.log(err);
            toast.error(err.response?.data?.msg || "Something went wrong")
        }
        finally{
            setloading(false);
        }
          

    }
  return (
    <div  className='flex items-center w-screen h-screen justify-center'>

            <form onSubmit={signupHandler}  className="bg-white shadow-lg rounded-xl w-[350px] px-8 py-10 flex flex-col gap-6">

            <div>

                <div className='my-4 '>
                    <div className='w-full flex justify-center mb-5'>
                     <img src={logo} className='w-[70%]' alt="Logo" />
                    </div>
                <p className='text-sm text-center'>Signup to see photos and videos from your Friends.</p>
                </div>

                <div>
                <Label className='font-medium ' htmlFor="username">Username</Label>
                    <Input type='text'
                    name = 'username'
                     id='username'
                    value={input.username}
                    onChange={ChangeEventHandler}
                    className= 'focus-visible:ring-transparent mb-5 mt-2'
                     />
                </div>
                <div>
                <Label className='font-medium ' htmlFor="email">Email</Label>
                    <Input type='text'
                    name = 'email'
                     id='email'
                    value={input.email}
                    onChange={ChangeEventHandler}
                    className= 'focus-visible:ring-transparent mb-5 mt-2'
                     />
                </div>
                <div>
                <Label className='font-medium ' htmlFor="password">Password</Label>
                    <Input type='password'
                    name = 'password'
                     id='password'
                    value = {input.password}
                    onChange={ChangeEventHandler}
                    className= 'focus-visible:ring-transparent mb-5 mt-2'
                     />
                </div>

                {
                    loading?(
                        <Button className='bg-black text-white w-full'>
                        <Loader2/>
                        please wait
                        </Button>
                    ):(
                        <Button className='bg-black text-white w-full'>
                        Signup
                        </Button>
                    )
                }
            </div>
            <span className='text-center'> Already have an account? <Link to="/login" className='text-blue-600'>Login</Link> </span>
        </form>



      
    </div>
    
  )
}

export default Signup
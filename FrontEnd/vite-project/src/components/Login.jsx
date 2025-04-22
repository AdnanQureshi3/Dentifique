import React, { useState } from 'react'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from 'sonner'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { setAuthuser } from '@/redux/authSlice.js'

function Login() {
    const [loading , setloading] = useState(false);
    const [input , setinput] = useState({
        
        email:"",
        password:""
    })
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const ChangeEventHandler = (e)=>{
        // e.target is the DOM element that triggered the event. In your case, it’s the <input> element the user typed in.
        setinput({...input , [e.target.name]:e.target.value});

    }
    async function  LoginHandler(e){
        e.preventDefault(); //prevent from refreshing
        // console.log(input)

        try{
            setloading(true);
            const res = await axios.post('http://localhost:8000/api/user/login' , input , {
                headers:{
                    'Content-Type':'application/json' //tells the backend that its json formate data
                },
                withCredentials:true
            });
            if(res.data.success){
                dispatch(setAuthuser(res.data.user))
                navigate("/home")
                

                toast.success(res.data.msg, {
                    className: 'bg-green-500 text-white p-4 rounded-lg shadow-md',
                });
                setinput({
                    
                    email:"",
                    password:""
                });
            }

        }
        catch(err){
            console.log(err);
            toast.error(err.response?.data?.msg || "Something went wrong", {
                className:'bg-red-500 text-white p-4 rounded-lg shadow-md', // Tailwind classes
            });
        }
        finally{
            setloading(false);
        }
          

    }
  return (
    <div  className='flex items-center w-screen h-screen justify-center'>

            <form onSubmit={LoginHandler}  className="bg-white shadow-lg rounded-xl w-[350px] px-8 py-10 flex flex-col gap-6">

            <div>
                

                <div className='my-4 '>
                    <div className='w-full flex justify-center mb-5'>
                     <img src="src\assets\logo.png" className='w-[70%]' alt="Logo" />
                    </div>
                <p className='text-sm text-center'>Signup to see photos and videos from your Friends.</p>
                </div>

                
                <div>
                <Label className='font-medium ' htmlFor="email">Username/Email</Label>
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
                        Login
                        </Button>
                    )
                }

                
            </div>
            <span className='text-center'> Don't have an account? <Link to="/signup" className='text-blue-600'>Create account</Link> </span>

        </form>

    </div>
    
  )
}

export default Login
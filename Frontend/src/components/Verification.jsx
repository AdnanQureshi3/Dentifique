import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

function Verification() {
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [timer, setTimer] = useState(1);
  const [resendActive, setResendActive] = useState(false);
  const inputs = useRef([]);



  useEffect(() => {
    if (timer === 0) {
      setResendActive(true);
      return;
    }
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/, '');
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < 5) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);

      if (!otp[index] && index > 0) {
        inputs.current[index - 1]?.focus();
      }
    }

    if (e.key === 'ArrowLeft' && index > 0) {
      inputs.current[index - 1]?.focus();
    }

    if (e.key === 'ArrowRight' && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];

    for (let i = 0; i < pasteData.length; i++) {
      newOtp[i] = pasteData[i];
      if (inputs.current[i]) inputs.current[i].value = pasteData[i];
    }

    setOtp(newOtp);
    const nextIndex = pasteData.length < 6 ? pasteData.length : 5;
    inputs.current[nextIndex]?.focus();
  };

  const handleResend = async() => {
    if (!resendActive) return;
    setOtp(new Array(6).fill(''));
    setTimer(1);
    setResendActive(false);
    
    try{
        const res = await axios.get('https://upchain-tvvm.onrender.com/api/user/verify/resend', { withCredentials: true });
        if (res.data.success) {
          console.log('OTP resent successfully');
        }

    }
    catch (error) {
      console.error('Error resending OTP:', error);
    }

  };

  const handleSubmit = () => {
    const code = otp.join('');
    if (code.length !== 6) return;
    // call API to verify OTP
    console.log('Submitted OTP:', code);
  };

  return (
    <div className="flex items-center w-screen h-screen justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-xl w-[350px] px-8 py-10 flex flex-col gap-6">
        <h2 className="text-xl font-semibold text-center text-gray-800">Verify Your Email</h2>

        <div className="flex justify-between gap-2">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputs.current[idx] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              onPaste={handlePaste}
              autoFocus={idx === 0}
              className="w-10 h-12 border rounded text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 font-medium"
        >
          Submit
        </button>

        <div className="text-center text-sm text-gray-600">
          Didn’t get the code?{' '}
          {resendActive ? (
            <button onClick={handleResend} className="text-blue-600 hover:underline font-medium">
              Resend OTP
            </button>
          ) : (
            <span>Resend in {timer}s</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Verification;

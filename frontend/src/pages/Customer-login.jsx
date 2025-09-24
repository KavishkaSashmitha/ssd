import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Dialog,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Checkbox,
} from '@material-tailwind/react';
import GoogleOAuthNew from '../components/GoogleOAuthNew';
import { useAuth } from '../middleware/authContext';
import axios from 'axios';
import { toast } from 'react-toastify';

export function CustomerLogin() {
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleOpen = () => setOpen((cur) => !cur);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8070/api/customer', {
        email,
        password
      });

      if (response.data.token) {
        login(response.data.token);
        toast.success('Login successful!');
        handleOpen();
        navigate('/products');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = (userData) => {
    login(userData.token);
    handleOpen();
    navigate('/products');
  };

  const handleGoogleFailure = (error) => {
    console.error('Google login failed:', error);
  };

  return (
    <>
      <Button onClick={handleOpen}>Sign In</Button>
      <Dialog
        size="xs"
        open={open}
        handler={handleOpen}
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-[24rem]">
          <CardBody className="flex flex-col gap-4">
            <Typography variant="h4" color="blue-gray">
              Sign In
            </Typography>
            <Typography
              className="mb-3 font-normal"
              variant="paragraph"
              color="gray"
            >
              Enter your email and password to Sign In.
            </Typography>
            <Typography className="-mb-2" variant="h6">
              Your Email
            </Typography>
            <Input 
              label="Email" 
              size="lg" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
            <Typography className="-mb-2" variant="h6">
              Your Password
            </Typography>
            <Input 
              label="Password" 
              size="lg" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />
            <div className="-ml-2.5 -mt-3">
              <Checkbox label="Remember Me" />
            </div>
          </CardBody>
          <CardFooter className="pt-0">
            <Button 
              variant="gradient" 
              onClick={handleLogin} 
              fullWidth
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
            
            <div className="mt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>
              
              <div className="mt-4">
                <GoogleOAuthNew 
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleFailure}
                />
              </div>
            </div>
            
            <Typography variant="small" className="mt-4 flex justify-center">
              Don&apos;t have an account?
              <Typography
                as="a"
                href="#signup"
                variant="small"
                color="blue-gray"
                className="ml-1 font-bold"
                onClick={handleOpen}
              >
                Sign up
              </Typography>
            </Typography>
          </CardFooter>
        </Card>
      </Dialog>
    </>
  );
}

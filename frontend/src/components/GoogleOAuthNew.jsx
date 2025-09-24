import React from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { toast } from 'react-toastify';
import axios from 'axios';

const GoogleOAuthNew = ({ onSuccess, onError }) => {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  const handleSuccess = async (credentialResponse) => {
    try {
      console.log('Google OAuth Success:', credentialResponse);
      
      // Send the credential to your backend
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/customer/google-auth`, {
        token: credentialResponse.credential
      });

      if (response.data.token) {
        // Store token in localStorage
        localStorage.setItem('userToken', response.data.token);
        toast.success('Google login successful!');
        if (onSuccess) {
          onSuccess(response.data);
        }
      } else {
        toast.error('Google login failed');
        if (onError) {
          onError(response.data.message || 'Login failed');
        }
      }
    } catch (error) {
      console.error('Google OAuth Error:', error);
      
      let errorMessage = 'Google login failed';
      
      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
        toast.error(errorMessage);
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'Network error - please check your connection';
        toast.error(errorMessage);
      } else {
        // Something else happened
        errorMessage = error.message || 'Unknown error occurred';
        toast.error(errorMessage);
      }
      
      if (onError) {
        onError(errorMessage);
      }
    }
  };

  const handleError = () => {
    console.log('Google OAuth Login Failed');
    toast.error('Google login failed');
    if (onError) {
      onError('Google login failed');
    }
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap={false}
        theme="outline"
        size="large"
        width="100%"
        text="continue_with"
        shape="rectangular"
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleOAuthNew;

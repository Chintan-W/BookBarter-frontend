import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useRouter } from 'next/router';
import { FaFacebookSquare, FaGoogle } from 'react-icons/fa'; // Import social icons
import Layout from '../components/Layout';
import Link from 'next/link';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const Register: React.FC = () => {
  const [registerError, setRegisterError] = useState('');
  const router = useRouter();

  const registerUser = async (values: { email: string; password: string }) => {
    try {
      const response = await axios.post(`${apiUrl}/api/register`, values);
      console.log('User registered successfully:', response.data);
      router.push('/login'); // Redirect to login page after successful registration
    } catch (error: any) { // Specify the type of error as 'any'
      console.error('Error registering user:', error.response?.data);
      setRegisterError(error.response?.data?.message); // Set error message state
    }
  };  

  return (
 
    <Layout>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'linear-gradient(319deg, #bbff99 0%, #ffec99 37%, #ff9999 100%)' }}>

      <div style={{ width: '400px', padding: '8px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img src="/logo.png" alt="Logo" style={{ width: '100px', marginBottom: '20px' }} />
        <h1 style={{ fontSize: '24px', marginTop: '8px' }}>Register</h1>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={Yup.object().shape({
            email: Yup.string().email('Invalid email').required('Required'),
            password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
          })}
          onSubmit={async (values) => {
            await registerUser(values);
          }}
        >
          {({ isSubmitting, errors, touched, handleChange, handleBlur, values }) => (
            <Form style={{ width: '100%' }}>
              <div style={{ marginBottom: '20px' }}>
                <label htmlFor="email" style={{ fontSize: '16px', marginBottom: '5px', display: 'block', color: '#333' }}>Email address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  style={{ width: '95%', padding: '10px', borderRadius: '4px', border: errors.email && touched.email ? '1px solid red' : '1px solid #ccc' }}
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.email && touched.email && <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.email}</div>}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label htmlFor="password" style={{ fontSize: '16px', marginBottom: '5px', display: 'block', color: '#333' }}>Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  style={{ width: '95%', padding: '10px', borderRadius: '4px', border: errors.password && touched.password ? '1px solid red' : '1px solid #ccc' }}
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.password && touched.password && <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.password}</div>}
              </div>

              <button
                style={{ width: '100%', padding: '10px', backgroundColor: '#1DB954', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing up...' : 'Sign Up'}
              </button>
            </Form>
          )}
        </Formik>

        {registerError && (
          <p style={{ marginTop: '20px', fontSize: '14px', color: 'red', textAlign: 'center' }}>{registerError}</p>
        )}

        <hr style={{ width: '100%', margin: '20px 0', border: 'none', borderBottom: '1px solid #ccc' }} />

        <div >
          <button style={{width: '100%', padding: '10px', backgroundColor: '#3b5998', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <FaFacebookSquare style={{ marginRight: '4px' }} /> Sign up with Facebook
          </button>
          <br />
          <button style={{width: '100%', padding: '10px', backgroundColor: '#db4437', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <FaGoogle style={{ marginRight: '4px' }} /> Sign up with Google
          </button>
        </div>

        <p style={{ marginTop: '20px', fontSize: '14px', color: 'gray', textAlign: 'center' }}>
          Already have an account? <Link href="/login" className="nav-link">log in</Link>
        </p>
      </div> 
    </div>
       </Layout>
  );
};

export default Register;

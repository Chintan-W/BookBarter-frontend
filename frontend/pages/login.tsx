import React, { useState, useEffect } from 'react'; // Import useEffect hook
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useRouter } from 'next/router';
import { FaFacebookSquare, FaGoogle } from 'react-icons/fa'; // Import social icons
import Layout from '../components/Layout';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Define interface for form values
interface LoginFormValues {
  email: string;
  password: string;
}

// Our validation Schema remains mostly the same
const loginValidationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Too short!').required('Required'),
});

const Login: React.FC = () => {
  const [loginError, setLoginError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Define isLoggedIn state variable
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      const response = await axios.post(`${apiUrl}/api/login`, values);
  
      const { token } = response.data;
  
      localStorage.setItem('token', token);
  
      setIsLoggedIn(true);
      console.log('isLoggedIn:', isLoggedIn); // Add this line to check
  
      router.push('/dashboard');
    } catch (error) {
      setLoginError('Invalid email or password');
    }
  };
  
  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'linear-gradient(319deg, #bbff99 0%, #ffec99 37%, #ff9999 100%)' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div style={{ margin: '20px', width: '400px', padding: '8px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src="/logo.png" alt="Logo" style={{ width: '100px', marginBottom: '20px' }} />
          <h1 style={{ fontSize: '24px', marginTop: '8px' }}>Login</h1>

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={loginValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched, handleChange, handleBlur, values }) => (
              <Form style={{ width: '100%' }}>
                <div style={{ marginBottom: '20px' }}>
                  <label htmlFor="email" style={{ fontSize: '16px', marginBottom: '5px', display: 'block' }}>Email address</label>
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
                  <label htmlFor="password" style={{ fontSize: '16px', marginBottom: '5px', display: 'block' }}>Password</label>
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
                  style={{ width: '100%', padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Logging in...' : 'Login'}
                </button>
              </Form>
            )}
          </Formik>

          {loginError && (
            <p style={{ marginTop: '20px', fontSize: '14px', color: 'red', textAlign: 'center' }}>{loginError}</p>
          )}
          <hr style={{ width: '100%', margin: '20px 0', border: 'none', borderBottom: '1px solid #ccc' }} />

          <div>
            <button style={{ width: '100%', padding: '10px', backgroundColor: '#3b5998', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <FaFacebookSquare style={{ marginRight: '4px' }} /> Facebook
            </button>
            <br />
            <button style={{ width: '100%', padding: '10px', backgroundColor: '#db4437', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <FaGoogle style={{ marginRight: '4px' }} /> Google
            </button>
          </div>

          <p style={{ marginTop: '20px', fontSize: '14px', color: 'gray', textAlign: 'center' }}>
            Don't have an account? <a href="/register">Register</a>
          </p>
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default Login;

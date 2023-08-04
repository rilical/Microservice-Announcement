import React from 'react';
import { Box, Button, TextField, useMediaQuery, useTheme } from '@mui/material';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const validationSchema = Yup.object({
  firstName: Yup.string().required('Required'),
  lastName: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email format').required('Required'),
  password: Yup.string().required('Required'),
  accessLevel: Yup.string().oneOf(['user', 'admin'], 'Invalid access level').required('Required'),
});

const CreateRowBox = ({ closeBox, fetchData }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Formik
      initialValues={{ firstName: '', lastName: '', email: '', password: '', accessLevel: '' }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        console.log("Sending values:", values);
        console.log("Sending headers:", { Authorization: `Bearer ${localStorage.getItem('token')}` });
        console.log("Token:", localStorage.getItem('token'));

        axios.post('http://localhost:3001/api/v1/team/create', values, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        
        })
          .then(response => {
            console.log(response);
            setSubmitting(false);
            closeBox();
            fetchData();
          })
          .catch(error => {
            console.error('Error creating new row:', error.response ? error.response.data : error);
            setSubmitting(false);
          });
          
      }}      
    >
      {({ isSubmitting, handleChange }) => (
        <Form>
          <Box mb = {2} p = {isSmallScreen ? 1 : 2}>
            <Field
              as={TextField}
              type="text"
              name="firstName"
              label="First Name"
              fullWidth
            />
            <ErrorMessage name="firstName" component="div" />
          </Box>
          <Box mb = {2} p = {isSmallScreen ? 1 : 2}>
            <Field
              as={TextField}
              type="text"
              name="lastName"
              label="Last Name"
              fullWidth
            />
            <ErrorMessage name="lastName" component="div" />
          </Box>
          <Box mb = {2} p = {isSmallScreen ? 1 : 2}>
            <Field
              as={TextField}
              type="email"
              name="email"
              label="Email"
              fullWidth
            />
            <ErrorMessage name="email" component="div" />
          </Box>
          <Box mb = {2} p = {isSmallScreen ? 1 : 2}>
            <Field
              as={TextField}
              type="password"
              name="password"
              label="Password"
              fullWidth
            />
            <ErrorMessage name="password" component="div" />
          </Box>
          <Box mb = {2} p = {isSmallScreen ? 1 : 2}>
            <Field
              as={TextField}
              type="text"
              name="accessLevel"
              label="Access Level"
              fullWidth
              select
              SelectProps={{ native: true }}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </Field>
            <ErrorMessage name="accessLevel" component="div" />
          </Box>
          <Button type="submit" disabled={isSubmitting}>
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default CreateRowBox;

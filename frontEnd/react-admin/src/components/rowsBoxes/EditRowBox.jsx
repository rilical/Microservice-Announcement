import React from 'react';
import { Box, Button, TextField, useMediaQuery, useTheme } from '@mui/material';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const validationSchema = Yup.object({
  firstName: Yup.string().required('Required'),
  lastName: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email format').required('Required'),
  password: Yup.string(),
  accessLevel: Yup.string().oneOf(['user', 'admin'], 'Invalid access level').required('Required'),
});

const EditRowBox = ({ closeBox, rowData, fetchData }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Formik
      initialValues={{ 
        announcement_title: rowData.announcement_title, 
        announcement_body: rowData.announcement_body,
        record_date: rowData.record_date,
        publish_date: rowData.publish_date,
        expire_date: rowData.expire_date || '',
        pinned: rowData.pinned,
        published: rowData.published,
        platform_id: rowData.platform_id
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        const updateValues = { ...values };

        if (values.expire_date === '') {
          delete updateValues.expire_date;
        }

        axios.put(`http://localhost:3001/api/v1/announcement/update`, updateValues, {
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
            console.error('Error updating announcement:', error);
            setSubmitting(false);
          });
      }}
>

      {({ isSubmitting }) => (
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
              label="New Password"
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
            Update
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default EditRowBox;

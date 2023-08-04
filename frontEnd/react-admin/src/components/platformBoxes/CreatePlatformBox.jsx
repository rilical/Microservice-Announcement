import React from 'react';
import { Box, Button, TextField, Switch, FormControlLabel, useMediaQuery, useTheme } from '@mui/material';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const validationSchema = Yup.object({
  platform_name: Yup.string().required('Required'),
  platform_description: Yup.string(),
  enabled: Yup.boolean(),
  cors_domains: Yup.string()
});

const CreatePlatformBox = ({ closeBox, fetchData }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Formik
      initialValues={{ 
        platform_name: '', 
        platform_description: '',
        enabled: true,
        cors_domains: ''
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        axios.post(`http://localhost:3001/api/v1/platform/create`, values, {
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
            console.error('Error creating platform:', error);
            setSubmitting(false);
          });
      }}
    >
      {({ isSubmitting, handleChange, values }) => (
        <Form>
          <Box mb = {2} p = {isSmallScreen ? 1 : 2}>
            <Field
              as={TextField}
              type="text"
              name="platform_name"
              label="Platform Name"
              fullWidth
            />
            <ErrorMessage name="platform_name" component="div" />
          </Box>
          <Box mb = {2} p = {isSmallScreen ? 1 : 2}>
            <Field
              as={TextField}
              type="text"
              name="platform_description"
              label="Platform Description"
              fullWidth
            />
            <ErrorMessage name="platform_description" component="div" />
          </Box>
          <Box mb = {2} p = {isSmallScreen ? 1 : 2}>
            <FormControlLabel
              control={
                <Field
                  as={Switch}
                  type="checkbox"
                  name="enabled"
                  color="primary"
                  onChange={handleChange}
                />
              }
              label="Enabled"
            />

          </Box>
          <Box mb = {2} p = {isSmallScreen ? 1 : 2}>
            <Field
              as={TextField}
              type="text"
              name="cors_domains"
              label="CORS Domains"
              fullWidth
            />
            <ErrorMessage name="cors_domains" component="div" />
          </Box>
          <Button type="submit" disabled={isSubmitting}>
            Create
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default CreatePlatformBox;

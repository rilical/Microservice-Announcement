import React from 'react';
import { Box, Button, TextField, Checkbox, FormControlLabel, useMediaQuery, useTheme } from '@mui/material';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const validationSchema = Yup.object({
  platform_name: Yup.string().required('Required'),
  platform_description: Yup.string(),
  enabled: Yup.boolean(),
  cors_domains: Yup.string()
});

const EditPlatformBox = ({ closeBox, rowData, fetchData }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Formik
      initialValues={{ 
        platform_name: rowData.platform_name,
        platform_description: rowData.platform_description,
        enabled: rowData.enabled,
        cors_domains: rowData.cors_domains
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        axios.put(`http://localhost:3001/api/v1/platform/update`, { ...values, platform_id: rowData.platform_id }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
          .then(response => {
            console.log(response);
            setSubmitting(false);
            closeBox();
            fetchData()
          })
          .catch(error => {
            console.error('Error updating platform:', error);
            setSubmitting(false);
          });
      }}
    >
      {({ isSubmitting, handleChange, values }) => (
        <Form>
          <Box mb={2} p={isSmallScreen ? 1 : 2}>
            <Field
              as={TextField}
              type="text"
              name="platform_name"
              label="Platform Name"
              fullWidth
            />
            <ErrorMessage name="platform_name" component="div" />
          </Box>
          <Box mb={2} p={isSmallScreen ? 1 : 2}>
            <Field
              as={TextField}
              type="text"
              name="platform_description"
              label="Platform Description"
              fullWidth
            />
            <ErrorMessage name="platform_description" component="div" />
          </Box>
          <Box mb={2} p={isSmallScreen ? 1 : 2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={values.enabled}
                  onChange={handleChange}
                  name="enabled"
                />
              }
              label="Enabled"
            />
          </Box>
          <Box mb={2} p={isSmallScreen ? 1 : 2}>
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
            Update
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default EditPlatformBox;

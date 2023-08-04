import React from 'react';
import { Box, Button, TextField, Checkbox, FormControlLabel, useMediaQuery, useTheme } from '@mui/material';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const validationSchema = Yup.object({
  domain_name: Yup.string().required('Required'),
  platform_id: Yup.number().required('Required'),
  enabled: Yup.boolean()
});

const EditDomainBox = ({ closeBox, rowData, fetchData }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Formik
      initialValues={{ 
        domain_name: rowData.domain_name, 
        platform_id: rowData.platform_id,
        enabled: rowData.enabled
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        axios.put(`http://localhost:3001/api/v1/domain/update`, values, {
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
            console.error('Error updating domain:', error);
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
              name="domain_name"
              label="Domain Name"
              fullWidth
            />
            <ErrorMessage name="domain_name" component="div" />
          </Box>
          <Box mb={2} p={isSmallScreen ? 1 : 2}>
            <Field
              as={TextField}
              type="number"
              name="platform_id"
              label="Platform ID"
              fullWidth
            />
            <ErrorMessage name="platform_id" component="div" />
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
          <Button type="submit" disabled={isSubmitting}>
            Update
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default EditDomainBox;

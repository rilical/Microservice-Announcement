import React from 'react';
import { Box, Button, TextField, Checkbox, FormControlLabel, useMediaQuery, useTheme } from '@mui/material';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { format } from "date-fns";


const validationSchema = Yup.object({
    announcement_title: Yup.string().required('Required'),
    announcement_body: Yup.string().required('Required'),
    record_date: Yup.date().required('Required'),
    publish_date: Yup.date().required('Required'),
    expire_date: Yup.date(),
    pinned: Yup.boolean(),
    published: Yup.boolean(),
    platform_id: Yup.number().required('Required')
  });
  
  const EditAnnouncementBox = ({ closeBox, rowData, fetchData }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    
    return (
      <Formik
      initialValues={{ 
        announcement_id: rowData.announcement_id,
        announcement_title: rowData.announcement_title, 
        announcement_body: rowData.announcement_body,
        record_date: format(new Date(rowData.record_date), 'yyyy-MM-dd'),
        publish_date: format(new Date(rowData.publish_date), 'yyyy-MM-dd'),
        expire_date: rowData.expire_date ? format(new Date(rowData.expire_date), 'yyyy-MM-dd') : '',
        pinned: rowData.pinned,
        published: rowData.published,
        platform_id: rowData.platform_id
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          axios.put(`http://localhost:3001/api/v1/announcement/update`, values, {
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
              console.error('Error updating announcement:', error);
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
                name="announcement_title"
                label="Title"
                fullWidth
              />
              <ErrorMessage name="announcement_title" component="div" />
            </Box>
            <Box mb = {2} p = {isSmallScreen ? 1 : 2}>
              <Field
                as={TextField}
                type="text"
                name="announcement_body"
                label="Body"
                fullWidth
              />
              <ErrorMessage name="announcement_body" component="div" />
            </Box>
            <Box mb = {2} p = {isSmallScreen ? 1 : 2}>
              <Field
                as={TextField}
                type="date"
                name="record_date"
                label="Record Date"
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
              />
              <ErrorMessage name="record_date" component="div" />
            </Box>
            <Box mb = {2} p = {isSmallScreen ? 1 : 2}>
              <Field
                as={TextField}
                type="date"
                name="publish_date"
                label="Publish Date"
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
              />
              <ErrorMessage name="publish_date" component="div" />
            </Box>
            <Box mb = {2} p = {isSmallScreen ? 1 : 2}>
              <Field
                as={TextField}
                type="date"
                name="expire_date"
                label="Expire Date"
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
              />
              <ErrorMessage name="expire_date" component="div" />
            </Box>
            <Box mb = {2} p = {isSmallScreen ? 1 : 2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={values.pinned}
                    onChange={handleChange}
                    name="pinned"
                  />
                }
                label="Pinned"
              />
            </Box>
            <Box mb = {2} p = {isSmallScreen ? 1 : 2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={values.published}
                    onChange={handleChange}
                    name="published"
                  />
                }
                label="Published"
              />
            </Box>
            <Box mb = {2} p = {isSmallScreen ? 1 : 2}>
              <Field
                as={TextField}
                type="number"
                name="platform_id"
                label="Platform ID"
                fullWidth
              />
              <ErrorMessage name="platform_id" component="div" />
            </Box>
            <Button type="submit" disabled={isSubmitting}>
              Update
            </Button>
          </Form>
        )}
      </Formik>
    );
  };
  
  export default EditAnnouncementBox;
  
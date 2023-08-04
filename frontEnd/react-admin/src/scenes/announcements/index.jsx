import { Box, Typography, Button, Dialog, Tooltip } from "@mui/material";
import { useState, useEffect } from 'react';
import { DataGrid } from "@mui/x-data-grid";
import axios from 'axios';
import Header from "../../components/Header";
import CreateAnnouncementBox from "../../components/announcementBoxes/CreateAnnouncementBox.jsx";
import EditAnnouncementBox from "../../components/announcementBoxes/EditAnnouncementBox.jsx";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/v1/announcement/fetch');
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleOpenCreate = () => {
    setOpenCreate(true);
  };

  const handleCloseCreate = () => {
    setOpenCreate(false);
  };
  
  // index.jsx

    const handleOpenEdit = () => {
    if (selectedRows.length === 1) {
      setOpenEdit(true);
      const selectedRow = announcements.find(row => row.announcement_id === selectedRows[0]);
      setSelectedRowData(selectedRow);
    } else if (selectedRows.length === 0) {
      alert('Please select a row to edit.');
    } else {
      alert('Please select only one row to edit.');
    }
  };



  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const columns = [
    { field: 'announcement_id', headerName: 'ID', width: 100 },
    { field: 'announcement_title', headerName: 'Title', width: 200 },
    {
        field: 'announcement_body',
        headerName: 'Announcement Body',
        flex: 1,
        renderCell: (params) => (
          <Tooltip title={params.value}>
            <div>{params.value}</div>
          </Tooltip>
        )
      },
    { field: 'record_date', headerName: 'Record Date', flex: 1 },
    { field: 'publish_date', headerName: 'Publish Date', flex: 1 },
    { field: 'expire_date', headerName: 'Expire Date', flex: 1 },
    {
        field: 'pinned',
        headerName: 'Pinned',
        flex: 1,
        renderCell: (params) => {
          return (
            <Box
              width="60%"
              m="0 auto"
              p="5px"
              display="flex"
              justifyContent="center"
              borderRadius="5px"
            >
              <Typography color="black" sx={{ ml: "5px", fontSize: "20px" }}>
                {params.value ? 'TRUE' : 'FALSE'}
              </Typography>
            </Box>
          );
        },
      },
      {
        field: 'published',
        headerName: 'Published',
        flex: 1,
        renderCell: (params) => {
          return (
            <Box
              width="60%"
              m="0 auto"
              p="5px"
              display="flex"
              justifyContent="center"
              borderRadius="5px"
            >
              <Typography color="black" sx={{ ml: "5px", fontSize: "20px" }}>
                {params.value ? 'TRUE' : 'FALSE'}
              </Typography>
            </Box>
          );
        },
      },
      
    { field: 'platform_id', headerName: 'Platform ID', flex: 1 },
  ];
  
  const deleteSelectedRows = async () => {
    console.log('Selected Rows:', selectedRows);
    for (const rowId of selectedRows) {
      try {
        const response = await axios.delete(`http://localhost:3001/api/v1/announcement/delete`, { data: { announcement_id: rowId } });
        if (response.status === 204) {
          console.log('Rows deleted successfully.');
        } else {
          console.error('Error occurred while deleting rows.');
        }
      } catch (err) {
        console.error('Error occurred while deleting rows: ', err);
      }
    };
    fetchAnnouncements();  // Refresh the announcements after deleting rows
  };

  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += [
      ["ID", "Title", "Announcement Body", "Record Date", "Publish Date", "Expire Date", "Pinned", "Published", "Platform ID"],
      ...announcements.map(row => [row.announcement_id, row.announcement_title, row.announcement_body, row.record_date, row.publish_date, row.expire_date, row.pinned, row.published, row.platform_id])
    ].map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "announcements_data.csv");
    document.body.appendChild(link);

    link.click();
  };
  
  return (
    <Box m="15px">
      <Header title="Announcements" subtitle="Manage Announcements" />
      <Box m="15px 5px 0px 0px" height="70vh">
        {announcements.length === 0 ?
          <Typography variant="h1" align = 'center' fontWeight = "bold" color = "red">There is no data</Typography> :
          <DataGrid 
            rows={announcements} 
            columns={columns} 
            getRowId={(row) => row.announcement_id}
            onSelectionModelChange={(newSelection) => {
                setSelectedRows(newSelection);
                if(newSelection.length === 1) {
                const selectedRow = announcements.find(row => row.announcement_id === newSelection[0]);
                setSelectedRowData(selectedRow);
                }
            }} 
            checkboxSelection
          />
        }
      </Box>

      <Button
        onClick={exportToCSV} 
        variant="contained" 
        style={{marginTop: '15px', marginLeft: "10px", backgroundColor: "#22a8e6", color: "#ffffff", fontSize: '20px', fontWeight : "bold"}}
        size="large"
      >
        Export
      </Button>
      <Button
        onClick={deleteSelectedRows} 
        variant="contained" 
        style={{marginTop: '15px', marginLeft: "10px", backgroundColor: "#e51f26", color: "#ffffff", fontSize: '20px', fontWeight : "bold"}}
        size="large"
      >
        Delete
      </Button>
      <Button
        onClick={handleOpenCreate} 
        variant="contained" 
        style={{marginTop: '15px', marginLeft: "10px", backgroundColor: "#28a745", color: "#ffffff", fontSize: '20px', fontWeight : "bold"}}
        size="large"
      >
        Create
      </Button>

      <Dialog
        open={openCreate}
        onClose={handleCloseCreate}
        aria-labelledby="form-dialog-title"
        maxWidth="lg"
        fullWidth={true}
      >
        <CreateAnnouncementBox closeBox={handleCloseCreate} fetchData = {fetchAnnouncements}/>
      </Dialog>
      <Button
        onClick={handleOpenEdit} 
        variant="contained" 
        style={{marginTop: '15px', marginLeft: "10px", backgroundColor: "#F7BC00", color: "#ffffff", fontSize: '20px', fontWeight : "bold"}}
        size="large"
      >
        Edit
      </Button>

      <Dialog
        open={openEdit}
        onClose={handleCloseEdit}
        aria-labelledby="form-dialog-title"
        maxWidth="lg"
        fullWidth={true}
      >
        <EditAnnouncementBox closeBox={handleCloseEdit} rowData={selectedRowData} fetchData = {fetchAnnouncements} />
      </Dialog>

    </Box>
  );
};

export default Announcements;

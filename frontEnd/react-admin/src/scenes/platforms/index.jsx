import { Box, Typography, Button, Dialog, Tooltip } from "@mui/material";
import { useState, useEffect } from 'react';
import { DataGrid } from "@mui/x-data-grid";
import axios from 'axios';
import Header from "../../components/Header";
import CreatePlatformBox from "../../components/platformBoxes/CreatePlatformBox.jsx";
import EditPlatformBox from "../../components/platformBoxes/EditPlatformBox.jsx";

const Platforms = () => {
  const [platforms, setPlatforms] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);

  const fetchPlatforms = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/v1/platform/fetch');
      setPlatforms(response.data);
    } catch (error) {
      console.error('Error fetching platforms:', error);
    }
  };

  useEffect(() => {
    fetchPlatforms();
  }, []);

  const handleOpenCreate = () => {
    setOpenCreate(true);
  };

  const handleCloseCreate = () => {
    setOpenCreate(false);
  };

  const handleOpenEdit = () => {
    if (selectedRows.length === 1) {
      setOpenEdit(true);
      const selectedRow = platforms.find(row => row.platform_id === selectedRows[0]);
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
    { field: 'platform_id', headerName: 'ID', width: 100 },
    { field: 'platform_name', headerName: 'Platform Name', flex: 1 },
    { 
        field: 'platform_description', 
        headerName: 'Platform Description', 
        flex: 1,
        renderCell: (params) => (
          <Tooltip title={params.value || ''}>
            <div>{params.value || ''}</div>
          </Tooltip>
        )
    },
    {
        field: 'enabled',
        headerName: 'Enabled',
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
        field: 'cors_domains', 
        headerName: 'CORS Domains', 
        flex: 1,
        renderCell: (params) => (
          <Tooltip title={params.value || ''}>
            <div>{params.value || ''}</div>
          </Tooltip>
        )
    },
];


  const deleteSelectedRows = async () => {
    console.log('Selected Rows:', selectedRows);
    for (const rowId of selectedRows) {
      try {
        const response = await axios.delete(`http://localhost:3001/api/v1/platform/delete`, { data: { platform_id: rowId } });
        if (response.status === 204) {
          console.log('Rows deleted successfully.');
        } else {
          console.error('Error occurred while deleting rows.');
        }
      } catch (err) {
        console.error('Error occurred while deleting rows: ', err);
      }
    };
    fetchPlatforms();  // Refresh the platforms after deleting rows
  };

  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += [
      ["ID", "Platform Name", "Platform Description", "Enabled", "CORS Domains"],
      ...platforms.map(row => [row.platform_id, row.platform_name, row.platform_description, row.enabled, row.cors_domains])
    ].map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "platforms_data.csv");
    document.body.appendChild(link);

    link.click();
  };
  
  return (
    <Box m="15px">
      <Header title="Platforms" subtitle="Manage Platforms" />
      <Box m="15px 5px 0px 0px" height="70vh">
        {platforms.length === 0 ?
          <Typography variant="h1" align = 'center' fontWeight = "bold" color = "red">There is no data</Typography> :
          <DataGrid 
            rows={platforms} 
            columns={columns} 
            getRowId={(row) => row.platform_id}
            onSelectionModelChange={(newSelection) => {
                setSelectedRows(newSelection);
                if(newSelection.length === 1) {
                const selectedRow = platforms.find(row => row.platform_id === newSelection[0]);
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

    <CreatePlatformBox closeBox={handleCloseCreate}
            fetchData = {fetchPlatforms}/>
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
              <EditPlatformBox closeBox={handleCloseEdit} rowData={selectedRowData} fetchData = {fetchPlatforms} />
            </Dialog>
      
          </Box>
        );
      };
      
      export default Platforms;

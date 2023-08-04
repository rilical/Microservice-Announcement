import { Box, Typography, Button, Dialog, Tooltip } from "@mui/material";
import { useState, useEffect } from 'react';
import { DataGrid } from "@mui/x-data-grid";
import axios from 'axios';
import Header from "../../components/Header";
import CreateDomainBox from "../../components/domainBoxes/CreateDomainBox.jsx";
import EditDomainBox from "../../components/domainBoxes/EditDomainBox.jsx";

const Domains = () => {
  const [domains, setDomains] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [platforms, setPlatforms] = useState([]);

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

  const fetchDomains = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/v1/domain/fetch');
      setDomains(response.data);
    } catch (error) {
      console.error('Error fetching domains:', error);
    }
  };

  useEffect(() => {
    fetchDomains();
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
      const selectedRow = domains.find(row => row.domain_id === selectedRows[0]);
      setSelectedRowData(selectedRow);
    } else if (selectedRows.length === 0) {
      alert('Please select a row to edit.');
    } else {
      alert('Please select only one row to edit.');
    }
  };


  const getPlatformNameById = (id) => {
    const platform = platforms.find(platform => platform.platform_id === id);
    return platform ? platform.platform_name : 'Unknown';
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const columns = [
    { field: 'domain_id', headerName: 'ID', width: 100 },
    { field: 'domain_name', headerName: 'Domain Name', flex: 1 },
    { 
      field: 'platform_id', 
      headerName: 'Platform Name', 
      width: 150,
      valueGetter: (params) => getPlatformNameById(params.value),
    },
  
  ];

  const deleteSelectedRows = async () => {
    console.log('Selected Rows:', selectedRows);
    for (const rowId of selectedRows) {
      try {
        const response = await axios.delete(`http://localhost:3001/api/v1/domain/delete`, { data: { domain_id: rowId } });
        if (response.status === 204) {
          console.log('Rows deleted successfully.');
        } else {
          console.error('Error occurred while deleting rows.');
        }
      } catch (err) {
        console.error('Error occurred while deleting rows: ', err);
      }
    };
    fetchDomains();  // Refresh the domains after deleting rows
  };

  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += [
      ["ID", "Domain Name"],
      ...domains.map(row => [row.domain_id, row.domain_name])
    ].map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "domains_data.csv");
    document.body.appendChild(link);

    link.click();
  };
  
  return (
    <Box m="15px">
      <Header title="Domains" subtitle="Manage Domains" />
      <Box m="15px 5px 0px 0px" height="70vh">
        {domains.length === 0 ?
          <Typography variant="h1" align = 'center' fontWeight = "bold" color = "red">There is no data</Typography> :
          <DataGrid 
            rows={domains} 
            columns={columns} 
            getRowId={(row) => row.domain_id}
            onSelectionModelChange={(newSelection) => {
                setSelectedRows(newSelection);
                if(newSelection.length === 1) {
                const selectedRow = domains.find(row => row.domain_id === newSelection[0]);
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
        <CreateDomainBox closeBox={handleCloseCreate} fetchData={fetchDomains} />
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
        <EditDomainBox closeBox={handleCloseEdit} rowData={selectedRowData} fetchData={fetchDomains} />
      </Dialog>

    </Box>
  );
};

export default Domains;

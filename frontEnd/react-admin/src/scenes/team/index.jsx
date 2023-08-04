import { Box, Typography, useTheme, Button, Dialog } from "@mui/material";
import { useState, useEffect } from 'react';
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import Header from "../../components/Header";
import axios from "axios";
import CreateRowBox from "../../components/rowsBoxes/CreateRowBox.jsx";
import EditRowBox from "../../components/rowsBoxes/EditRowBox.jsx";


const Team = () => {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);



  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += [
      ["ID", "First Name", "Last Name", "Email", "Access Level", "Password"],
      ...data.map(row => [row.id, row.firstName, row.lastName, row.email, row.accessLevel, row.password])
    ].map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "team_data.csv");
    document.body.appendChild(link);

    link.click();
  };

  const fetchRows = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/v1/team/fetch'
      , {}, {
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching rows:', error);
    }
  };

  const handleOpenCreate = () => {
    setOpenCreate(true);
  };

  const handleCloseCreate = () => {
    setOpenCreate(false);
    fetchRows();
  };
  
  const handleOpenEdit = () => {
    if (selectedRows.length === 1) {
      setOpenEdit(true);
    } else if (selectedRows.length === 0) {
      alert('Please select a row to edit.');
    } else {
      alert('Please select only one row to edit.');
    }
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    fetchRows();
  };

  useEffect(() => {
    fetchRows();
  }, []);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const deleteSelectedRows = async () => {
    console.log('Selected Rows:', selectedRows);
    for (const rowId of selectedRows) {
      try {
        const response = await axios.delete(`http://localhost:3001/api/v1/team/delete`, {
          data: {
            id: rowId
          }
        });

        if (response.status === 204) {
          console.log('Rows deleted successfully.');
          // Refresh the data in the frontend after successful deletion
          const updatedData = data.filter((row) => !selectedRows.some((selectedRow) => selectedRow.id === row.id));
          setData(updatedData);
        } else {
          console.error('Error occurred while deleting rows.');
        }
      } catch (err) {
        console.error('Error occurred while deleting rows: ', err);
      }
    };

    // Now update the data state to remove the deleted rows
    setData(data.filter(row => !selectedRows.includes(row.id)));
  };
  
  const columns = [
    { field: "id", headerName: "ID", headerClassName: 'super-header', },
    {
      field: "firstName",
      headerName: "First Name",
      flex: 1,
      cellClassName: "name-column--cell",
      headerClassName: 'super-header',
    },
    {
      field: "lastName",
      headerName: "Last Name",
      flex: 1,
      cellClassName: "name-column--cell",
      headerClassName: 'super-header',
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      headerClassName: 'super-header',
    },
    {
      field: "accessLevel",
      headerName: "Access Level",
      flex: 1,
      headerClassName: 'super-header',
      renderCell: (params) => {
        const access = params.row.accessLevel;
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="flex-end"
            borderRadius="5px"
          >
            {/* {access === "user" && <LockOpenOutlinedIcon />} */}
            <Typography color="black" sx={{ ml: "5px", fontSize: "20px", textTransform: "uppercase" }}>
              {access}
            </Typography>
          </Box>
        );
      },
    },
    // {
    //   field: "password",
    //   headerName: "Password",
    //   flex: 1,
    //   headerClassName: 'super-header',
    //   renderCell: (params) => {
    //     if (params.row.accessLevel === "admin") { //CHANGE THIS <-------
    //       return (
    //         <Box
    //           component="span"
    //           onMouseEnter={(e) => e.currentTarget.textContent = params.row.password}
    //           onMouseLeave={(e) => e.currentTarget.textContent = "******"}
    //         >
    //           ******
    //         </Box>
    //       );
    //     } else {
    //       return (
    //         <Typography>Restricted</Typography>
    //       );
    //     }
    //   },
    // },
  ];

  return (
    <Box m="15px">
      <Header title="TEAM" subtitle="Manage Team Members" />
      <Box m="15px 5px 0px 0px" height="70vh">
      {data.length === 0 ?
        <Typography variant="h1" align = 'center' fontWeight = "bold" color = "red">There is no data</Typography> :
        <DataGrid 
          checkboxSelection 
          rows={data} 
          columns={columns} 
          hideFooterPagination={true} 
          onSelectionModelChange={(newSelection) => {
            setSelectedRows(newSelection);
            if(newSelection.length === 1) {
              const selectedRow = data.find(row => row.id === newSelection[0]);
              setSelectedRowData(selectedRow);
            }
          }} 
        />
      }
      </Box>

      <Button
      onClick={() => setShowPasswords(!showPasswords)} 
      variant="contained" 
      style={{marginTop: '15px', marginLeft: "10px", backgroundColor: "#22a8e6", color: "#ffffff", fontSize: '20px', fontWeight : "bold"}}
      size="large"
    >
      Toggle Passwords
      </Button>

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
        <CreateRowBox closeBox={handleCloseCreate} fetchData = {fetchRows} />
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
    <EditRowBox closeBox={handleCloseEdit} rowData={selectedRowData} fetchData = {fetchRows} />
  </Dialog>
    </Box>

    
  );
};

export default Team;

import { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";

// import { useContext } from "react"; LATER
// import UserContext from "../../context/UserContext"; LATER

// Overrides:


import "react-pro-sidebar/dist/css/styles.css";



import { Box, IconButton, Typography, useTheme, ThemeProvider} from "@mui/material";
import { Link } from "react-router-dom";
import { tokens } from "../../theme";

import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import LaptopWindowsOutlinedIcon from '@mui/icons-material/LaptopWindowsOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import WifiOutlinedIcon from '@mui/icons-material/WifiOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';

const Item = ({ title, to, icon, selected, setSelected }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette);
    return (
      <MenuItem
        active={selected === title}
        style={{
          color: colors.white[100],
        }}
        onClick={() => setSelected(title)}
        icon={icon}
      >
        <Typography>{title}</Typography>
        <Link to={to} />
      </MenuItem>
    );
  };

const Sidebar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selected, setSelected] = useState("Dashboard");
    

    const [role, setRole] = useState('root');
    const [name, setName] = useState('root');

    // useEffect(() => {
    //   fetch('YOUR_API_ENDPOINT_HERE')
    //     .then(response => response.json())
    //     .then(data => {
    //       setRole(data.role);
    //       setName(data.name);
    //     });
    // }, []);

    
    // const { role } = useContext(UserContext)

    return (
        <ThemeProvider theme={theme}>
          <Box
            sx={{
              "& .pro-sidebar-inner": {
                background: `${colors.primary[500]} !important`,
              },
              "& .pro-icon-wrapper": {
                backgroundColor: "transparent !important",
              },
              "& .pro-inner-item": {
                padding: "5px 35px 5px 20px !important",
              },
              "& .pro-inner-item:hover": {
                color: `${colors.white[600]} !important`,
              },
              
            }}
            >
            <ProSidebar collapsed={isCollapsed}>
              <Menu iconShape="square">
                <MenuItem
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  icon={isCollapsed ? <MenuOutlinedIcon style = {{ color: colors.white[100]}} /> : undefined}
                  style={{
                    margin: "10px 0 20px 0",
                    color: colors.white[100],
                  }}
                >
                  {!isCollapsed && (
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      ml="20px"
                    >
                      <Typography variant="h2" color={colors.white[100]} fontWeight = "bold">
                        PANEL
                      </Typography>
                      <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                        <MenuOutlinedIcon style = {{ color: colors.white[100]}} />
                      </IconButton>
                    </Box>
                  )}
                </MenuItem>
      
                {!isCollapsed && (
                  <Box mb="25px">
                    <Box textAlign="center">
                      <Typography
                        variant="h2"
                        color={colors.white[100]}
                        fontWeight="bold"
                        sx={{ m: "10px 0 0 0" }}
                      >
                        {name.toUpperCase()}
                      </Typography>
                      <Typography variant="h5" color={colors.white[100]}>
                        {role.toUpperCase()}
                      </Typography>
                    </Box>
                  </Box>
                )}
      
                <Box paddingLeft={isCollapsed ? undefined : "0"}>
                  <Item
                    title="Dashboard"
                    to="/"
                    icon={<HomeOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  {role === 'root' && 
                    <Item
                      title="Manage Team"
                      to="/team"
                      icon={<PeopleAltOutlinedIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  }
      
                  <Typography
                    variant="h5"
                    color={colors.white[300]}
                    sx={{ m: "15px 5px 15px 0px" }}
                    fontWeight = "bold"
                    textAlign = "center"
                  >
                    Data
                  </Typography>
                  <Item
                    title="Active Announcements"
                    to="/activeannouncement"
                    icon={<WifiOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Item
                    title="Announcements"
                    to="/announcements"
                    icon={<CampaignOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Item
                    title="Platforms"
                    to="/platforms"
                    icon={<LaptopWindowsOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Item
                    title="Domains"
                    to="/domains"
                    icon={<LanguageOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  <Item
                    title="Calendar"
                    to="/calendar"
                    icon={<CalendarMonthOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  
                </Box>
              </Menu>
            </ProSidebar>
          </Box>
        </ThemeProvider>
      );
    };

export default Sidebar;
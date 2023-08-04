import { Box, IconButton, useTheme, styled } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import logo from '../../static/earthlink logo.svg';


const StyledBox = styled(Box)({});

const TopBar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette)
  const colorMode = useContext(ColorModeContext);

  return (
    <StyledBox display="flex" justifyContent="space-between" p={2} alignItems="center">
      {/* LOGO */}
      <Box>
        <img src={logo} alt="logo" style={{position: 'absolute', top: '20px', height: '90%', maxHeight: '50px'}}/>
      </Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton>
          <NotificationsOutlinedIcon style={{ color: colors.black[900] }} />
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon style={{ color: colors.black[900] }} />
        </IconButton>
        <IconButton>
          <LogoutOutlinedIcon style={{ color: colors.black[900] }} />
        </IconButton>
      </Box>
    </StyledBox>
  );
};

export default TopBar;

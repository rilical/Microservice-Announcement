import Header from "../../components/Header";
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";

const Dashboard = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <Box m = "20px">
            <Box display = "flex" justifyContent = "space-between" alignItems = "center">
                <Header title = "DASHBOARD" subtitle = "Welcome to your dashboard"/>
            </Box>
        </Box>
    )
};

export default Dashboard
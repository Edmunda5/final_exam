import { createTheme, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { BrowserRouter as Router } from "react-router-dom";
import { Container } from "./components/Container";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

const themeProvider = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={themeProvider}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Router>
            <Container />
          </Router>
        </LocalizationProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;

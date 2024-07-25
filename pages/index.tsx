import * as React from "react";
import { Box, PaletteMode } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CalendarEvent from "./CalendarEvent";
import getLPTheme from "./getLPTheme";

export default function Home() {
	const [mode, setMode] = React.useState<PaletteMode>("light");
	const [showCustomTheme, setShowCustomTheme] = React.useState(true);
	const LPtheme = createTheme(getLPTheme(mode));
	const defaultTheme = createTheme({ palette: { mode } });

	return (
		<ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
			<CssBaseline />
			<Box
				sx={{
					width: "100vw",
					height: "100vh",
					display: "flex",
					flexDirection: "column",
				}}
			>
				<CalendarEvent />
			</Box>
		</ThemeProvider>
	);
}

import * as React from "react";
import { alpha } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

export default function CalendarFilter() {
	return (
		<Box
			sx={(theme) => ({
				width: "100%",
				backgroundImage: theme.palette.mode === "light" ? "linear-gradient(180deg, #CEE5FD, #FFF)" : `linear-gradient(#02294F, ${alpha("#090E10", 0.0)})`,
				backgroundSize: "100% 20%",
				backgroundRepeat: "no-repeat",
			})}
		>
			<Container
				sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					pt: { xs: 10, sm: 16 },
					pb: { xs: 6, sm: 10 },
				}}
			>
				<Stack spacing={2} useFlexGap sx={{ width: { xs: "100%", sm: "70%" } }}>
					<Stack direction={{ xs: "column", sm: "row" }} alignSelf="center" spacing={1} useFlexGap sx={{ pt: 2, width: { xs: "100%", sm: "auto" } }}>
						<TextField
							id="outlined-basic"
							hiddenLabel
							size="small"
							variant="outlined"
							aria-label="Enter your email address"
							placeholder="Your email address"
							inputProps={{
								autoComplete: "off",
								"aria-label": "Enter your email address",
							}}
						/>
						<Button variant="contained" color="primary">
							Start now
						</Button>
					</Stack>
				</Stack>
			</Container>
		</Box>
	);
}

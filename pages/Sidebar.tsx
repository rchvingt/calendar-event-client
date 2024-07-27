import React, { useState, useEffect } from "react";
import { Theme, useTheme } from "@mui/material/styles";
import { Grid, Box, FormControl, OutlinedInput, InputLabel, Select, MenuItem, SelectChangeEvent, Chip } from "@mui/material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};
interface User {
	id: number;
	name: string;
}
const names = ["Oliver Hansen", "Van Henry", "April Tucker", "Ralph Hubbard", "Omar Alexander", "Carlos Abbott", "Miriam Wagner", "Bradley Wilkerson", "Virginia Andrews", "Kelly Snyder"];

interface SidebarProps {
	onFilter: (personIds: number[]) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onFilter }) => {
	const [users, setUsers] = useState<User[]>([]);
	const [selectedPersons, setSelectedPersons] = useState<number[]>([]);
	const theme = useTheme();
	// Define getStyles function
	const getStyles = (id: number, selectedIds: readonly number[], theme: Theme) => {
		return {
			fontWeight: selectedIds.indexOf(id) === -1 ? theme.typography.fontWeightMedium : theme.typography.fontWeightBold,
		};
	};
	useEffect(() => {
		// Fetch users from API
		fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/calendars/users`)
			.then((response) => response.json())
			.then((data) => setUsers(data.data))
			.catch((error) => console.error("Error fetching users:", error));
	}, []);

	const handlePersonFilter = (event: SelectChangeEvent<typeof selectedPersons>) => {
		const value = event.target.value as number[];
		setSelectedPersons(value);
		onFilter(value);
	};

	return (
		<div className="col-span-2 bg-white p-4 border border-r-slate-200">
			<div className="mt-4">
				<h3 className="font-bold mb-5">Search For Person</h3>

				<Grid item xs={12}>
					<Box sx={{ minWidth: 120 }}>
						<FormControl fullWidth>
							<InputLabel
								id="demo-multiple-chip-label"
								sx={{
									margin: "0 0 8px 0",
									backgroundColor: "white",
								}}
							>
								Person
							</InputLabel>
							<Select
								labelId="demo-multiple-chip-label"
								id="demo-multiple-chip"
								multiple
								value={selectedPersons}
								onChange={handlePersonFilter}
								input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
								renderValue={(selected) => (
									<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
										{selected.map((value) => (
											<Chip key={value} label={users.find((user) => user.id === value)?.name} />
										))}
									</Box>
								)}
								MenuProps={MenuProps}
							>
								{users.map((user) => (
									<MenuItem key={user.id} value={user.id} style={getStyles(user.id, selectedPersons, theme)}>
										{user.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Box>
				</Grid>
			</div>
		</div>
	);
};

export default Sidebar;

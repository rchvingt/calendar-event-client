import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { Box, CircularProgress, DialogContent, DialogContentText, FormControl, Grid, InputLabel, MenuItem, Stack, TextField } from "@mui/material";
import { LocalizationProvider, DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment, { Moment } from "moment";
import Select, { SelectChangeEvent } from "@mui/material/Select";

const Transition = React.forwardRef(function Transition(
	props: TransitionProps & {
		children: React.ReactElement;
	},
	ref: React.Ref<unknown>
) {
	return <Slide direction="up" ref={ref} {...props} />;
});

interface DeleteEventDialogProps {
	visible: boolean;
	onClose: () => void;
	id: number | null;
}

// Structur User Data
interface Users {
	id: number;
	name: string;
}

// Repeat Option
const REPEAT = [
	{
		Id: 0,
		Name: "Does not repeat",
	},
	{
		Id: 1,
		Name: "Daily",
	},
	{
		Id: 2,
		Name: "Weekly",
	},
];

interface Event {
	id: number;
	title: string;
	date_start: Date | string;
	date_end: Date | string;
	start_time: Date | string;
	end_time: Date | string;
	is_repeat: string;
	person_id: string | number;
	person_name: string;
}

// set param data edit as default value

const CalendarEventUpdate: React.FC<DeleteEventDialogProps> = ({ visible, onClose, id }) => {
	const [selectedEventId, setSelectedEventId] = React.useState<number | null>(id);
	const [isDialogOpen, setDialogOpen] = React.useState<boolean>(visible);
	const [person, setPerson] = React.useState<string>("");
	const [loading, setLoading] = React.useState<boolean>(false);

	React.useEffect(() => {
		const fetchEvents = async () => {
			setLoading(true);
			try {
				const response = await fetch(`http://localhost:3000/api/calendars/${id}`);
				const data = await response.json();
				console.log(data.data);
				// setEventData(data.data);
				setNuEvent({
					id: data.data.id,
					title: data.data.title,
					date_start: data.data.date_start,
					date_end: data.data.date_end,
					start_time: data.data.start_time,
					end_time: data.data.end_time,
					is_repeat: data.data.is_repeat,
					person_id: data.data.person_id || "",
					person_name: data.data.person_name,
				});

				setLoading(false);
			} catch (error) {
				console.error("Error fetching events:", error);
				setLoading(false);
			}
		};

		if (visible && id) {
			fetchEvents();
		}
	}, [id, visible]);
	const [nuEvent, setNuEvent] = React.useState<Event>({
		id: 0,
		title: "",
		date_start: "",
		date_end: "",
		start_time: "",
		end_time: "",
		is_repeat: "",
		person_id: "",
		person_name: "",
	});

	const [dateStart, setDateStart] = React.useState<Moment | null>(moment(new Date()));
	const [dateEnd, setDateEnd] = React.useState<Moment | null>(moment(new Date()));
	const [startTime, setStartTime] = React.useState<Moment | null>(moment(new Date()));
	const [endTime, setEndTime] = React.useState<Moment | null>(moment(new Date()));
	const [repeat, setRepeat] = React.useState<string>("");
	const [filteredPerson, setFilteredPerson] = React.useState<string>("");
	const [users, setUsers] = React.useState<Users[]>([]);

	React.useEffect(() => {
		const fetchUser = async () => {
			setLoading(true);
			try {
				const response = await fetch(`http://localhost:3000/api/calendars/users`);
				const data = await response.json();
				console.log(data.data);
				// setEventData(data.data);
				setUsers(data.data);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching events:", error);
				setLoading(false);
			}
		};

		if (visible && id) {
			fetchUser();
		}
	}, [id, visible]);

	const handleDateStartChange = (date: Moment | null) => {
		if (date) {
			setDateStart(date);
			setNuEvent({
				...nuEvent,
				date_start: moment(date).format("YYYY-MM-DD"),
			});
		}
	};

	const handleDateEndChange = (date: Moment | null) => {
		if (date) {
			setDateEnd(date);
			setNuEvent({
				...nuEvent,
				date_end: moment(date).format("YYYY-MM-DD"),
			});
		}
	};

	const handleTimeStartChange = (date: Moment | null) => {
		if (date) {
			setStartTime(date);
			setNuEvent({
				...nuEvent,
				start_time: moment(date).format("LT"),
			});
		}
	};

	const handleTimeEndChange = (date: Moment | null) => {
		if (date) {
			setEndTime(date);
			setNuEvent({
				...nuEvent,
				end_time: moment(date).format("LT"),
			});
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setNuEvent({
			...nuEvent,
			[name]: value,
		});
	};

	const handlePerson = (event: SelectChangeEvent) => {
		const selectedUserId = parseInt(event.target.value);
		const selectedUser = users.find((user) => user.id === selectedUserId);

		if (selectedUser) {
			setNuEvent({
				...nuEvent,
				person_id: selectedUser.id,
				person_name: selectedUser.name,
			});
		}
	};

	const handleRepeat = (event: SelectChangeEvent) => {
		setRepeat(event.target.value as string);
	};

	if (loading) return <CircularProgress color="secondary" />;
	return (
		<React.Fragment>
			<Dialog fullScreen open={visible} onClose={onClose} TransitionComponent={Transition}>
				<AppBar sx={{ position: "relative" }} enableColorOnDark={true} color={"primary"}>
					<Toolbar>
						<IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
							<CloseIcon />
						</IconButton>
						<Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
							Update Event
						</Typography>
						<Button autoFocus color="inherit" onClick={onClose}>
							save
						</Button>
					</Toolbar>
				</AppBar>
				<DialogContent>
					<Box sx={{ flexGrow: 1 }}>
						<Grid container spacing={3}>
							{/* Input Title  */}
							<Grid item xs={12}>
								<TextField
									required
									margin="dense"
									id="title"
									value={nuEvent.title}
									name="title"
									label="Title"
									type="text"
									fullWidth
									variant="outlined"
									onChange={handleInputChange}
								/>
							</Grid>

							{/* Input Date Start */}
							<Grid item xs={6} md={6}>
								<LocalizationProvider dateAdapter={AdapterMoment}>
									<Stack spacing={2} sx={{ minWidth: 205 }}>
										<DatePicker
											label="Date Start"
											value={moment(nuEvent.date_start)}
											onChange={handleDateStartChange}
											format="dddd, DD/MM/YYYY"
											defaultValue={moment(dateStart)}
										/>
									</Stack>
								</LocalizationProvider>
							</Grid>

							{/* Input Date End */}
							<Grid item xs={6} md={6}>
								<LocalizationProvider dateAdapter={AdapterMoment}>
									<Stack spacing={2} sx={{ minWidth: 205 }}>
										<DatePicker label="Date End" value={dateEnd} onChange={handleDateEndChange} format="dddd, DD/MM/YYYY" />
									</Stack>
								</LocalizationProvider>
							</Grid>

							{/* Input DateTime End */}
							<Grid item xs={6} md={3}>
								<LocalizationProvider dateAdapter={AdapterMoment}>
									<Stack spacing={2}>
										<TimePicker label="Start Time" onChange={handleTimeStartChange} />
									</Stack>
								</LocalizationProvider>
							</Grid>
							<Grid item xs={6} md={3}>
								<LocalizationProvider dateAdapter={AdapterMoment}>
									<Stack spacing={2}>
										<TimePicker label="End Time" onChange={handleTimeEndChange} />
									</Stack>
								</LocalizationProvider>
							</Grid>

							{/* Input Repeat? */}
							<Grid item xs={6} md={3}>
								<Box>
									<FormControl fullWidth>
										<InputLabel id="demo-simple-select-label">Repeat?</InputLabel>
										<Select labelId="demo-simple-select-label" id="demo-simple-select" value={repeat} label="Repeat" defaultValue="" onChange={handleRepeat}>
											{REPEAT.map((repeat) => (
												<MenuItem key={repeat.Id} value={repeat.Name}>
													{repeat.Name}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Box>
							</Grid>

							{/* Input Person */}
							<Grid item xs={6} md={3}>
								<Box>
									<FormControl fullWidth>
										<InputLabel id="demo-simple-select-label">Person</InputLabel>
										<Select
											labelId="demo-simple-select-label"
											id="demo-simple-select"
											// value={nuEvent.person_id !== null ? String(nuEvent.person_id) : ""}
											value={nuEvent.person_name}
											label="Person"
											defaultValue={nuEvent.person_id !== null ? String(nuEvent.person_id) : ""}
											onChange={handlePerson}
										>
											{users.map((user) => (
												<MenuItem key={user.id} value={user.id}>
													{user.name}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Box>
							</Grid>
						</Grid>
					</Box>
				</DialogContent>
			</Dialog>
		</React.Fragment>
	);
};

export default CalendarEventUpdate;

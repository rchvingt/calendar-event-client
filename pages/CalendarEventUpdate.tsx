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

// Structur Input Event Data
interface Event {
	id: number;
	title: string;
	date_start: Date | string;
	date_end: Date | string;
	start_time: Date | string | null;
	end_time: Date | string | null;
	is_repeat: string;
	person_id: number | null;
	person_name: string;
}

// Structur Event Data
interface EventData {
	id: string;
	title: string;
	start: Date;
	end: Date;
}

interface UpdateFormDialogProps {
	visible: boolean;
	onClose: () => void;
	id: number | null;
	setEventsCalendar: React.Dispatch<React.SetStateAction<EventData[]>>;
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
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

// set param data edit as default value

const CalendarEventUpdate: React.FC<UpdateFormDialogProps> = ({ visible, onClose, id, setEventsCalendar, setLoading }) => {
	const [selectedEventId, setSelectedEventId] = React.useState<number | null>(id);
	const [isDialogOpen, setDialogOpen] = React.useState<boolean>(visible);
	const [person, setPerson] = React.useState<string>("");
	const [loadingLocal, setLoadingLocal] = React.useState<boolean>(false);
	const [nuEvent, setNuEvent] = React.useState<Event>({
		id: 0,
		title: "",
		date_start: "",
		date_end: "",
		start_time: "",
		end_time: "",
		is_repeat: "",
		person_id: null,
		person_name: "",
	});
	const [de, setDe] = React.useState([]);

	React.useEffect(() => {
		const fetchEvents = async () => {
			setLoadingLocal(true);
			try {
				const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/calendars/${id}`);
				const data = await response.json();
				setDe(data.data);
				// console.log(data.data);
				// setEventData(data.data);
				setNuEvent({
					id: data.data.id,
					title: data.data.title,
					date_start: data.data.date_start,
					date_end: data.data.date_end,
					start_time: moment(data.data.date_start).format("yyyy-MM-DD") + "T" + data.data.start_time,
					end_time: moment(data.data.date_end).format("yyyy-MM-DD") + "T" + data.data.end_time,
					is_repeat: data.data.is_repeat,
					person_id: data.data.user_id || "",
					person_name: data.data.person_name,
				});

				setLoadingLocal(false);
			} catch (error) {
				console.error("Error fetching events:", error);
				setLoadingLocal(false);
			}
		};

		if (visible && id) {
			fetchEvents();
		}
	}, [id, visible]);

	const [dateStart, setDateStart] = React.useState<Moment | null>(moment(new Date()));
	const [dateEnd, setDateEnd] = React.useState<Moment | null>(moment(new Date()));
	const [startTime, setStartTime] = React.useState<Moment | null>(moment(new Date()));
	const [endTime, setEndTime] = React.useState<Moment | null>(moment(new Date()));
	const [repeat, setRepeat] = React.useState<string>("");
	const [filteredPerson, setFilteredPerson] = React.useState<string>("");
	const [users, setUsers] = React.useState<Users[]>([]);

	React.useEffect(() => {
		const fetchUser = async () => {
			setLoadingLocal(true);
			try {
				const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/calendars/users`);
				const data = await response.json();
				// console.log(data.data);
				setUsers(data.data);
				setLoadingLocal(false);
			} catch (error) {
				console.error("Error fetching events:", error);
				setLoadingLocal(false);
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
				start_time: moment(nuEvent.date_end).format("yyyy-MM-DD") + "T" + moment(date).format("HH:mm:ss"), //format start time -> yyyy-MM-DD T HH:mm:ss
			});
		}
	};

	const handleTimeEndChange = (date: Moment | null) => {
		if (date) {
			setEndTime(date);
			setNuEvent({
				...nuEvent,
				end_time: moment(nuEvent.date_end).format("yyyy-MM-DD") + "T" + moment(date).format("HH:mm:ss"), //format end time -> yyyy-MM-DD T HH:mm:ss
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

	const handlePersonX = (event: SelectChangeEvent) => {
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

	const handlePerson = (event: SelectChangeEvent<number>) => {
		const selectedUserId = event.target.value as number;
		setNuEvent((prevEvent) => ({
			...prevEvent,
			person_id: selectedUserId,
			person_name: users.find((user) => user.id === selectedUserId)?.name || "",
		}));
	};

	const handleRepeat = (event: SelectChangeEvent) => {
		setRepeat(event.target.value as string);
	};

	// handle submit update event
	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		const formData = {
			title: nuEvent.title,
			date_start: moment(nuEvent.date_start).format("YYYY-MM-DD"),
			date_end: moment(nuEvent.date_end).format("YYYY-MM-DD"),
			start_time: moment(nuEvent.start_time).format("HH:mm:ss"),
			end_time: moment(nuEvent.end_time).format("HH:mm:ss"),
			user_id: nuEvent.person_id,
		};
		// console.log(formData);
		event.preventDefault();
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/calendars/${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			if (response.ok) {
				alert("Event submitted successfully");
				onClose();
				// Fetch the updated list of events
				fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/calendars/events`)
					.then((res) => res.json())
					.then((data) => {
						setEventsCalendar(data.data);
						setLoading(false);
					});
			} else {
				console.error("Failed to submit event");
			}
		} catch (error) {
			console.error("Error submitting event:", error);
		}
	};

	if (loadingLocal) return <CircularProgress color="secondary" />;
	if (de) {
		// console.log("nuEvent", nuEvent);
		return (
			<React.Fragment>
				<Dialog
					fullScreen
					open={visible}
					onClose={onClose}
					TransitionComponent={Transition}
					PaperProps={{
						component: "form",
						onSubmit: handleSubmit,
					}}
				>
					<AppBar sx={{ position: "relative" }} enableColorOnDark={true} color={"primary"}>
						<Toolbar>
							<IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
								<CloseIcon />
							</IconButton>
							<Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
								Update Event
							</Typography>
							<Button type="submit" color="inherit">
								SAVE
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

								{/* Input Start Time */}
								<Grid item xs={6} md={6}>
									<LocalizationProvider dateAdapter={AdapterMoment}>
										<Stack spacing={2}>
											<TimePicker label="Start Time" onChange={handleTimeStartChange} value={moment(nuEvent.start_time)} />
										</Stack>
									</LocalizationProvider>
								</Grid>

								{/* Input Date End */}
								<Grid item xs={6} md={6}>
									<LocalizationProvider dateAdapter={AdapterMoment}>
										<Stack spacing={2} sx={{ minWidth: 205 }}>
											<DatePicker
												label="Date End"
												value={moment(nuEvent.date_end)}
												onChange={handleDateEndChange}
												format="dddd, DD/MM/YYYY"
												defaultValue={moment(dateEnd)}
											/>
										</Stack>
									</LocalizationProvider>
								</Grid>

								{/* Input Time End */}
								<Grid item xs={6} md={6}>
									<LocalizationProvider dateAdapter={AdapterMoment}>
										<Stack spacing={2}>
											<TimePicker label="End Time" onChange={handleTimeEndChange} value={moment(nuEvent.end_time)} />
										</Stack>
									</LocalizationProvider>
								</Grid>

								{/* Input Repeat? */}
								<Grid item xs={6} md={3}>
									<Box>
										<FormControl fullWidth>
											<InputLabel id="demo-simple-select-label">Repeat?</InputLabel>
											<Select
												labelId="demo-simple-select-label"
												id="demo-simple-select"
												value={repeat}
												label="Repeat"
												defaultValue=""
												onChange={handleRepeat}
											>
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
												value={nuEvent.person_id ?? ""}
												label="Person"
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
	} else {
		return <CircularProgress color="secondary" />;
	}
};

export default CalendarEventUpdate;

"use client";
import React, { useEffect, useState } from "react";
import moment, { Moment } from "moment";
import { EventClickArg } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { Draggable, DropArg } from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import multiMonthPlugin from "@fullcalendar/multimonth";

// component UI
import {
	CircularProgress,
	TextField,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Stack,
	Grid,
	Box,
	InputLabel,
	FormControl,
	MenuItem,
	IconButton,
	Slide,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { TransitionProps } from "@mui/material/transitions";

import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker, TimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import CalendarEventUpdate from "./CalendarEventUpdate";

import { INITIAL_EVENTS, createEventId } from "./event-utils";

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
	start_time: Date | string;
	end_time: Date | string;
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

function CalendarEvent() {
	const [eventscalendar, setEventsCalendar] = useState<EventData[]>([]);
	const [users, setUsers] = useState<Users[]>([]);
	const [eventscalendarID, setEventsCalendarID] = useState<number | null>(null);
	const [nuEvent, setNuEvent] = useState<Event>({
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
	const [isModalVisible, setModalVisible] = useState(false);
	const [isModalVisibleDelete, setModalVisibleDelete] = useState(false);
	const [isLoading, setLoading] = useState(true);

	// form input
	const [dateStart, setDateStart] = useState<Moment | null>(moment(new Date()));
	const [dateEnd, setDateEnd] = useState<Moment | null>(moment(new Date()));
	const [startTime, setStartTime] = useState<Moment | null>(moment(new Date()));
	const [endTime, setEndTime] = useState<Moment | null>(moment(new Date()));
	const [repeat, setRepeat] = useState<string>("");
	const [person, setPerson] = useState<string>("");
	const [filteredPerson, setFilteredPerson] = useState<string>("");

	const [titleEvent, setTitleEvent] = useState<string>("");

	const [isEdit, setEdit] = React.useState(false);

	const handleClickEdit = () => {
		setModalVisibleDelete(!isModalVisibleDelete);
		setEdit(!isEdit);
	};

	const closeDeleteDialog = () => {
		setEventsCalendarID(null);
		setEdit(!isEdit);
	};

	// Retrieve Events Data
	useEffect(() => {
		const fetchEvents = async () => {
			try {
				const response = await fetch("http://localhost:3000/api/calendars/events");
				const data = await response.json();
				setEventsCalendar(data.data);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching events:", error);
				setLoading(false);
			}
		};

		fetchEvents();
	}, []);

	// Retrieve Users Data
	useEffect(() => {
		fetch("http://localhost:3000/api/calendars/users")
			.then((res) => res.json())
			.then((data) => {
				setUsers(data.data);
				setLoading(false);
			});
	}, []);

	// open dialog event to choose action -> delete, edit or close dialog
	// set title to display as Dialogue Title
	// set eventCalendarID for delete and edit purpose
	function handleEventClick(clickInfo: EventClickArg) {
		// console.log("EventClickArg", clickInfo);
		setEventsCalendarID(parseInt(clickInfo.event.id));
		setModalVisibleDelete(!isModalVisibleDelete);
		setTitleEvent(clickInfo.event.title);
	}

	function handleCloseModal() {
		setModalVisible(!isModalVisible);
		setNuEvent({
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
		setEventsCalendarID(null);
		setPerson("");
		setRepeat("");
	}

	const handleRepeat = (event: SelectChangeEvent) => {
		setRepeat(event.target.value as string);
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

	const handlePersonFilter = (event: SelectChangeEvent) => {
		setFilteredPerson(event.target.value as string);
	};

	// handle submit new event
	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		const formData = {
			title: nuEvent.title,
			date_start: nuEvent.date_start || moment(dateStart).format("YYYY-MM-DD"),
			date_end: nuEvent.date_end || moment(dateEnd).format("YYYY-MM-DD"),
			start_time: nuEvent.start_time,
			end_time: nuEvent.end_time,
			user_id: nuEvent.person_id,
		};
		// console.log(formData);
		event.preventDefault();
		try {
			const response = await fetch("http://localhost:3000/api/calendars", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			if (response.ok) {
				alert("Event submitted successfully");
				// Fetch the updated list of events
				fetch("http://localhost:3000/api/calendars/events")
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
		setModalVisible(!isModalVisible);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setNuEvent({
			...nuEvent,
			[name]: value,
		});
	};

	function handleDateClick(arg: { date: Date }) {
		setDateStart(moment(arg.date));
		setDateEnd(moment(arg.date));
		setModalVisible(!isModalVisible);
	}

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

	// handle delete selected event
	const handleDelete = async (id: number): Promise<void> => {
		if (confirm("Are you sure you want to delete this event?")) {
			try {
				const response = await fetch(`http://localhost:3000/api/calendars/${id}`, {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
					},
				});

				if (!response.ok) {
					throw new Error("Failed to delete the event");
				}

				// Fetch the updated list of events
				fetch("http://localhost:3000/api/calendars/events")
					.then((res) => res.json())
					.then((data) => {
						setEventsCalendar(data.data);
						setLoading(false);
						alert("Event deleted successfully");
					});
			} catch (error) {
				console.error("Error deleting event:", error);
				alert("Failed to delete the event");
			}
		}
	};

	if (isLoading) return <CircularProgress color="secondary" />;
	if (!eventscalendar) return <p>No Event data</p>;

	return (
		<div className="grid grid-cols-10 min-h-screen p-4 gap-4">
			{/* Sidebar */}
			<div className="col-span-2 bg-gray-100 p-4">
				<div className="mt-4">
					<h3 className="font-bold mb-5">Search For Person</h3>

					{/* filter user */}
					<Grid item xs={6} md={6}>
						<Box sx={{ minWidth: 120 }}>
							<FormControl fullWidth>
								<InputLabel id="demo-simple-select-label">Person</InputLabel>
								<Select labelId="demo-simple-select-label" id="demo-simple-select" value={filteredPerson} defaultValue="" label="Person" onChange={handlePersonFilter}>
									{users.map((user) => (
										<MenuItem key={user.id} value={user.name}>
											{user.name}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Box>
					</Grid>
				</div>
			</div>

			{/* Calendar Event*/}
			<div className="col-span-8">
				<FullCalendar
					plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin, multiMonthPlugin, listPlugin, interactionPlugin]}
					headerToolbar={{
						left: "prev,next today",
						center: "title",
						right: "multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay,listWeek",
					}}
					events={eventscalendar}
					eventBackgroundColor="#DF234C"
					eventBorderColor="#F0778F"
					nowIndicator={true}
					editable={false}
					droppable={false}
					selectable={false}
					selectMirror={true}
					dateClick={handleDateClick}
					eventClick={handleEventClick}
				/>
			</div>

			{/* Form Event Calendar */}
			<Dialog
				open={isModalVisible}
				onClose={handleCloseModal}
				maxWidth={"md"}
				PaperProps={{
					component: "form",
					onSubmit: handleSubmit,
				}}
			>
				<DialogTitle>Add Event</DialogTitle>
				<DialogContent>
					<Box sx={{ flexGrow: 1 }}>
						<Grid container spacing={3}>
							{/* Input Title  */}
							<Grid item xs={12}>
								<TextField
									autoFocus
									required
									margin="dense"
									id="title"
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
											value={dateStart}
											onChange={handleDateStartChange}
											format="dddd, DD/MM/YYYY"
											defaultValue={moment(dateStart)}
										/>
									</Stack>
								</LocalizationProvider>
							</Grid>

							{/* Input Time Start */}
							<Grid item xs={6} md={6}>
								<LocalizationProvider dateAdapter={AdapterMoment}>
									<Stack spacing={2}>
										<TimePicker label="Start Time" onChange={handleTimeStartChange} />
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

							{/* Input Time End */}
							<Grid item xs={6} md={6}>
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
											value={nuEvent.person_id?.toString() ?? ""}
											label="Person"
											defaultValue=""
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
				<DialogActions>
					<Button onClick={handleCloseModal}>Cancel</Button>
					<Button type="submit">Save</Button>
				</DialogActions>
			</Dialog>

			{/* Confirmation Dialog Event Click*/}
			<Dialog
				open={isModalVisibleDelete}
				onClose={() => {
					setModalVisibleDelete(!isModalVisibleDelete);
				}}
				fullWidth
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">{titleEvent}</DialogTitle>
				<IconButton
					aria-label="close"
					autoFocus
					onClick={() => {
						setModalVisibleDelete(!isModalVisibleDelete);
					}}
					sx={{
						position: "absolute",
						right: 8,
						top: 8,
						color: (theme) => theme.palette.grey[500],
					}}
				>
					<CloseIcon />
				</IconButton>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">{"What actions would you like to perform?"}</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => {
							if (eventscalendarID) {
								handleDelete(eventscalendarID);
								setModalVisibleDelete(!isModalVisibleDelete);
							}
						}}
					>
						Delete
					</Button>

					<Button
						onClick={() => {
							if (eventscalendarID) {
								handleClickEdit();
								setModalVisibleDelete(!isModalVisibleDelete);
							}
						}}
					>
						Edit
					</Button>
				</DialogActions>
			</Dialog>

			{/* Edit Event Calendar */}
			<CalendarEventUpdate visible={isEdit} onClose={closeDeleteDialog} id={eventscalendarID} setEventsCalendar={setEventsCalendar} setLoading={setLoading} />
		</div>
	);
}

export default CalendarEvent;

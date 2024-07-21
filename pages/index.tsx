"use client";
import React, { Fragment, useEffect, useState } from "react";
import moment, { Moment } from "moment";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { Draggable, DropArg } from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import multiMonthPlugin from "@fullcalendar/multimonth";

import { EventSourceInput } from "@fullcalendar/core/index.js";

// component UI
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, Grid, Box, InputLabel, FormControl, MenuItem } from "@mui/material";
import { styled } from "@mui/system";

import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker, TimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import Select, { SelectChangeEvent } from "@mui/material/Select";

const FormGrid = styled(Grid)(() => ({
	display: "flex",
	flexDirection: "column",
}));

interface Event {
	id: number;
	title: string;
	date_start: Date | string;
	date_end: Date | string;
	start_time: Date | string;
	end_time: Date | string;
	is_repeat: string;
}
interface Users {
	id: number;
	name: string;
}

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
function index() {
	const [eventscalendar, setEventsCalendar] = useState<Event[]>([]);
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

	// retrieve calendars event
	useEffect(() => {
		fetch("http://localhost:3000/api/calendars")
			.then((res) => res.json())
			.then((data) => {
				setEventsCalendar(data.data);
				setLoading(false);
			});
	}, []);

	useEffect(() => {
		fetch("http://localhost:3000/api/calendars/users")
			.then((res) => res.json())
			.then((data) => {
				setUsers(data.data);
				setLoading(false);
			});
	}, []);

	function handleDateClick(arg: { date: Date }) {
		console.log("Date tapped" + arg.date);
		setDateStart(moment(arg.date));
		setDateEnd(moment(arg.date));
		setModalVisible(!isModalVisible);
	}

	function handleDeleteModal(data: { event: { id: string } }) {
		setModalVisibleDelete(!isModalVisibleDelete);
		setEventsCalendarID(Number(data.event.id));
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
		});
		setModalVisibleDelete(!isModalVisibleDelete);
		setEventsCalendarID(null);
		setPerson("");
		setRepeat("");
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setNuEvent({
			...nuEvent,
			title: e.target.value,
		});
	};

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setEventsCalendar([...eventscalendar, nuEvent]);
		setModalVisible(!isModalVisible);
		setNuEvent({
			id: 0,
			title: "",
			date_start: "",
			date_end: "",
			start_time: "",
			end_time: "",
			is_repeat: "",
		});
	}

	const handleRepeat = (event: SelectChangeEvent) => {
		setRepeat(event.target.value as string);
	};

	const handlePerson = (event: SelectChangeEvent) => {
		setPerson(event.target.value as string);
	};

	const handlePersonFilter = (event: SelectChangeEvent) => {
		// filter action event by user here ...
	};

	if (isLoading) return <p>Loading...</p>;
	if (!eventscalendar) return <p>No Event data</p>;

	return (
		<>
			<nav className="flex justify-between mb-4 border-b border-violet-100 p-4">
				<h1 className="font-bold text-2xl text-gray-700">Calendar</h1>
			</nav>
			<main className="grid grid-cols-10 min-h-screen p-4 gap-4">
				{/* Sidebar */}
				<div className="col-span-2 bg-gray-100 p-4">
					<div className="mt-4">
						<h3 className="font-bold mb-5">Filter Users</h3>
						{/* Add your filter user component here */}
						<Grid item xs={6} md={6}>
							<Box
								sx={{
									minWidth: 120,
								}}
							>
								<FormControl fullWidth>
									<InputLabel id="demo-simple-select-label">Person</InputLabel>
									<Select labelId="demo-simple-select-label" id="demo-simple-select" value={person} defaultValue="" label="Person" onChange={handlePersonFilter}>
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
				{/* Calendar */}
				<div className="col-span-8">
					<FullCalendar
						plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin, multiMonthPlugin, listPlugin, interactionPlugin]}
						headerToolbar={{
							left: "prev,next today",
							center: "title",
							right: "multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay,listWeek",
						}}
						events={eventscalendar}
						nowIndicator={true}
						editable={false}
						droppable={false}
						selectable={false}
						selectMirror={true}
						dateClick={handleDateClick}
						eventClick={(data) => handleDeleteModal(data)}
					/>
				</div>

				{/* Form Event Calendar */}
				<Dialog
					open={isModalVisible}
					onClose={handleCloseModal}
					maxWidth={"md"}
					PaperProps={{
						component: "form",
						onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
							event.preventDefault();
							const formData = new FormData(event.currentTarget);
							const formJson = Object.fromEntries((formData as any).entries());
							const title = formJson.title;
							console.log(title);
							handleCloseModal();
						},
					}}
				>
					<DialogTitle>Add Event</DialogTitle>
					<DialogContent>
						<Box sx={{ flexGrow: 1 }}>
							<Grid container spacing={3}>
								{/* Input Title  */}
								<Grid item xs={12}>
									<TextField autoFocus required margin="dense" id="title" name="title" label="Title" type="text" fullWidth variant="outlined" />
								</Grid>

								{/* Input Date  */}
								<Grid item xs={6} md={6}>
									<LocalizationProvider dateAdapter={AdapterMoment}>
										<Stack spacing={2} sx={{ minWidth: 205 }}>
											<DatePicker
												label="Date Start"
												value={dateStart}
												onChange={(date) => {
													setNuEvent({
														...nuEvent,
														date_start: moment(date).format("LL"),
													});
												}}
												format="dddd, DD/MM/YYYY"
											/>
										</Stack>
									</LocalizationProvider>
								</Grid>
								<Grid item xs={6} md={6}>
									<LocalizationProvider dateAdapter={AdapterMoment}>
										<Stack spacing={2} sx={{ minWidth: 205 }}>
											<DatePicker
												label="Date End"
												value={dateEnd}
												onChange={(date) => {
													setNuEvent({
														...nuEvent,
														date_end: moment(date).format("LL"),
													});
												}}
												format="dddd, DD/MM/YYYY"
											/>
										</Stack>
									</LocalizationProvider>
								</Grid>

								{/* Input DateTime End */}
								<Grid item xs={6} md={3}>
									<LocalizationProvider dateAdapter={AdapterMoment}>
										<Stack spacing={2}>
											<TimePicker
												label="Start Time"
												onChange={(time) => {
													setNuEvent({
														...nuEvent,
														start_time: moment(time).format("LT"),
													});
												}}
											/>
										</Stack>
									</LocalizationProvider>
								</Grid>
								<Grid item xs={6} md={3}>
									<LocalizationProvider dateAdapter={AdapterMoment}>
										<Stack spacing={2}>
											<TimePicker
												label="End Time"
												onChange={(time) => {
													setNuEvent({
														...nuEvent,
														end_time: moment(time).format("LT"),
													});
												}}
											/>
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
												value={person}
												label="Person"
												defaultValue=""
												onChange={handlePerson}
											>
												{users.map((user) => (
													<MenuItem key={user.id} value={user.name}>
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
			</main>

			<div></div>
		</>
	);
}

export default index;

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
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimeField } from "@mui/x-date-pickers/DateTimeField";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Select, { SelectChangeEvent } from "@mui/material/Select";

const FormGrid = styled(Grid)(() => ({
	display: "flex",
	flexDirection: "column",
}));

interface Event {
	id: number;
	title: string;
	description: string;
	start_time: Date | String;
	end_time: Date | String;
}
function index() {
	const [eventscalendar, setEventsCalendar] = useState<Event[]>([]);
	const [eventscalendarID, setEventsCalendarID] = useState<number | null>(null);
	const [nuEvent, setNuEvent] = useState<Event>({
		id: 0,
		title: "",
		description: "",
		start_time: "",
		end_time: "",
	});
	const [isModalVisible, setModalVisible] = useState(false);
	const [isModalVisibleDelete, setModalVisibleDelete] = useState(false);

	const [isLoading, setLoading] = useState(true);

	// form input
	const [startDate, setStartDate] = useState<Moment | null>(null);
	const [endDate, setEndDate] = useState<Moment | null>(null);
	const [repeat, setRepeat] = useState<String | null>(null);
	const [person, setPerson] = useState<String | null>(null);

	// retrieve calendars event
	useEffect(() => {
		fetch("http://localhost:3000/api/calendars")
			.then((res) => res.json())
			.then((data) => {
				setEventsCalendar(data.data);
				setLoading(false);
			});
	}, []);

	function handleDateClick(arg: { date: Date }) {
		// console.log('Date tapped'+arg.date);
		setNuEvent({
			...nuEvent,
			start_time: arg.date,
		});
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
			description: "",
			start_time: "",
			end_time: "",
		});
		setModalVisibleDelete(!isModalVisibleDelete);
		setEventsCalendarID(null);
		setPerson(null);
		setRepeat(null);
		setStartDate(null);
		setEndDate(null);
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
			description: "",
			start_time: "",
			end_time: "",
		});
	}

	const handleRepeat = (event: SelectChangeEvent) => {
		setRepeat(event.target.value as string);
	};

	const handlePerson = (event: SelectChangeEvent) => {
		setPerson(event.target.value as string);
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
									<Select labelId="demo-simple-select-label" id="demo-simple-select" value={person} autowidth label="Person" onChange={handlePerson}>
										<MenuItem value={10}>Andi</MenuItem>
										<MenuItem value={20}>Yuan</MenuItem>
										<MenuItem value={30}>Cakka</MenuItem>
									</Select>
								</FormControl>
							</Box>
						</Grid>
					</div>
				</div>
				<div className="col-span-8">
					<FullCalendar
						// plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
						// headerToolbar={{
						// 	left: "prev,next today",
						// 	center: "title",
						// 	right: "dayGridMonth,timeGridWeek,timeGridDay",
						// }}
						// initialView="dayGridMonth"
						plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin, multiMonthPlugin, listPlugin]}
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
					PaperProps={{
						component: "form",
						onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
							event.preventDefault();
							const formData = new FormData(event.currentTarget);
							const formJson = Object.fromEntries((formData as any).entries());
							const email = formJson.email;
							console.log(email);
							handleCloseModal();
						},
					}}
				>
					<DialogTitle>Add Event</DialogTitle>
					<DialogContent>
						<Box sx={{ flexGrow: 1 }}>
							<Grid container spacing={2}>
								<Grid item xs={12}>
									<TextField autoFocus required margin="dense" id="title" name="title" label="Title" type="text" fullWidth variant="outlined" />
								</Grid>

								<Grid item xs={6} md={6}>
									<LocalizationProvider dateAdapter={AdapterMoment}>
										<Stack
											spacing={2}
											sx={{
												minWidth: 205,
											}}
										>
											<DateTimePicker
												label="Start Date"
												value={startDate}
												onChange={setStartDate}
												// format="DD/MM/YYYY hh:mm aa"
												referenceDate={moment("2022-04-17T15:30")}
											/>
										</Stack>
									</LocalizationProvider>
								</Grid>

								<Grid item xs={6} md={6}>
									<LocalizationProvider dateAdapter={AdapterMoment}>
										<Stack
											spacing={2}
											sx={{
												minWidth: 205,
											}}
										>
											<DateTimePicker
												label="End Date"
												value={endDate}
												onChange={setEndDate}
												// format="DD/MM/YYYY hh:mm aa"
												referenceDate={moment("2022-04-17T15:30")}
											/>
										</Stack>
									</LocalizationProvider>
								</Grid>

								<Grid item xs={6} md={6}>
									<Box
										sx={{
											minWidth: 120,
										}}
									>
										<FormControl fullWidth>
											<InputLabel id="demo-simple-select-label">Repeat?</InputLabel>
											<Select labelId="demo-simple-select-label" id="demo-simple-select" value={repeat} label="Repeat" autowidth onChange={handleRepeat}>
												<MenuItem value={10}>Does not repeat</MenuItem>
												<MenuItem value={20}>Daily</MenuItem>
												<MenuItem value={30}>Weekly</MenuItem>
											</Select>
										</FormControl>
									</Box>
								</Grid>
								<Grid item xs={6} md={6}>
									<Box
										sx={{
											minWidth: 120,
										}}
									>
										<FormControl fullWidth>
											<InputLabel id="demo-simple-select-label">Person</InputLabel>
											<Select labelId="demo-simple-select-label" id="demo-simple-select" value={person} autowidth label="Person" onChange={handlePerson}>
												<MenuItem value={10}>Andi</MenuItem>
												<MenuItem value={20}>Yuan</MenuItem>
												<MenuItem value={30}>Cakka</MenuItem>
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

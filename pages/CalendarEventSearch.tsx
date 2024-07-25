import React, { useState, Dispatch, SetStateAction } from "react";
import { TextField, Button, List, ListItem, ListItemText } from "@mui/material";

// Structur Event Data
interface EventData {
	id: string;
	title: string;
	start: Date;
	end: Date;
}

interface CalendarEventSearchProps {
	setEventsCalendar: Dispatch<SetStateAction<EventData[]>>;
}
const CalendarEventSearch: React.FC<CalendarEventSearchProps> = ({ setEventsCalendar }) => {
	const [keyword, setKeyword] = useState("");

	const handleSearch = async () => {
		try {
			const response = await fetch(`http://localhost:3000/api/events?keyword=${keyword}`);
			const result = await response.json();
			if (result.success) {
				setEventsCalendar(result.data);
			} else {
				console.error(result.message);
			}
		} catch (error) {
			console.error("Error fetching events:", error);
		}
	};

	return (
		<div>
			<TextField label="Search Events" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
			<Button onClick={handleSearch}>Search</Button>
		</div>
	);
};

export default CalendarEventSearch;

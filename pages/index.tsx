import React, { useState } from "react";
import CalendarEvent from "./CalendarEvent";
import Navbar from "./Navbar";

export default function Home() {
	return (
		<>
			<main>
				<Navbar />
				<CalendarEvent />
			</main>
		</>
	);
}

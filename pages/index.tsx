import CalendarEvent from "./CalendarEvent";
CalendarEvent;

export default function Home() {
	return (
		<>
			<main>
				<nav className="flex justify-between mb-4 border-b border-orange-100 p-4">
					<h1 className="font-bold text-2xl text-gray-700">Calendar Event</h1>
				</nav>
				<CalendarEvent />
			</main>
		</>
	);
}

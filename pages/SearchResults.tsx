import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button, Box, Typography } from "@mui/material";

const SearchResults: React.FC = () => {
	const router = useRouter();
	const { keyword } = router.query;
	const [searchResults, setSearchResults] = useState<{ id: number; title: string }[]>([]);

	useEffect(() => {
		const fetchSearchResults = async () => {
			try {
				const response = await fetch(`http://localhost:3000/api/calendars?title=${keyword}`);
				if (response.ok) {
					const data = await response.json();
					setSearchResults(data.data);
				} else {
					console.error("Failed to fetch search results");
				}
			} catch (error) {
				console.error("Error fetching search results:", error);
			}
		};

		if (keyword) {
			fetchSearchResults();
		}
	}, [keyword]);

	const handleCancelSearch = () => {
		router.push("/");
	};

	return (
		<Box sx={{ padding: 4 }}>
			<Typography variant="h4" gutterBottom>
				Search Results for {`${keyword}`}
			</Typography>
			<ul>
				{searchResults.map((event) => (
					<li key={event.id}>{event.title}</li>
				))}
			</ul>
			<Button variant="contained" color="primary" onClick={handleCancelSearch}>
				Cancel Search
			</Button>
		</Box>
	);
};

export default SearchResults;

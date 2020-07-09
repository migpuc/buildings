import React, { useEffect, useState } from "react"
import { API_URL } from "../config"

const initialState = {
	items: [],
}

const BuildingList = () => {
	const [data, setData] = useState(initialState)
	const [error, setError] = useState(false)

	useEffect(() => {
		fetch(API_URL)
			.then((response) => response.json())
			.then((response) => setData(response.data))
			.catch(() => setError(true))
	}, [])

	const groupByZone = (items) => {
		if (!items || items.length === 0) return null

		const groups = {}
		for (let item of items) {
			const zone = item.buildingzone || "Unknown"
			if (!groups[zone]) {
				groups[zone] = []
			}
			groups[zone].push(item)
		}

		const filtered = []
		for (let name in groups) {
			groups[name] = groups[name].sort((a, b) => {
				if (a.buildingname < b.buildingname) return -1
				if (a.buildingname > b.buildingname) return 1
				return 0
			})
			filtered.push({ name, items: groups[name] })
		}

		const sorted = filtered.sort((a, b) => {
			if (a.name === 'Other Bay Area' || a.name === 'Unknown') return 0;
			if (a.name < b.name) return -1;
			if (a.name > b.name) return 1;
			return 0;
		})

		return sorted
	}

	if (error) {
		return <div>Un error ha ocurrido</div>
	}

	if (data.items.length === 0) {
		return <div>Cargando...</div>
	}

	return (
		<ul>
			{groupByZone(data.items).map((group) => {
				return (
					<li>
						<strong>{group.name}</strong>
						<ul>
							{group.items.map((item) => {
								if (item.black === 0) {
									return (
										<li>
											<a href="https://applefacilities.review.blueriver.com">{item.buildingname}</a>
										</li>
									)
								}
								return <li>{item.buildingname}</li>
							})}
						</ul>
					</li>
				)
			})}
		</ul>
	)
}

export default BuildingList

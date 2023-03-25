export async function load() {
	let data = await fetch('http://localhost:4000/api/characters/history').then((r) => r.json());
	return {
		charData: data
	};
}

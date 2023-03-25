export async function load({ params, fetch }) {
	const { id } = params;
	const data = await fetch(`http://localhost:4000/api/characters/${id}`).then((r) => r.json());
	return {
		character: data
	};
}

export async function load({ params, fetch }) {
	const { id } = params;
	const data = await fetch(`http://localhost:4000/api/comics/${id}`).then((r) => r.json());
	return {
		comic: data
	};
}

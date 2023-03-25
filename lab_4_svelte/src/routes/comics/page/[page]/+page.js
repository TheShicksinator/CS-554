export async function load({ fetch, params }) {
	const page = params.page || 1;
	let res = await fetch(`http://localhost:4000/api/comics/page/${page}`);
	let data = await res.json();
	let { results } = data;
	let lastPage = data.total - 1 - data.offset <= data.limit || results.length < data.limit;

	return {
		lastPage: lastPage,
		comicData: results,
		page: page
	};
}

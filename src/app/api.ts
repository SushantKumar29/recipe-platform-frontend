import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "./store";

export const baseQuery = fetchBaseQuery({
	baseUrl: import.meta.env.VITE_API_BASE_URL,
	credentials: "include",
	prepareHeaders: (headers, { getState }) => {
		const token = (getState() as RootState).auth.token;
		if (token) {
			headers.set("authorization", `Bearer ${token}`);
		}
		return headers;
	},
});

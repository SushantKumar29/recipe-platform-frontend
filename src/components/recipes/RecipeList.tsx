import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Link } from "react-router";

import RecipesNotFound from "@/components/recipes/RecipesNotFound";
import RateLimitedUI from "@/components/RateLimitedUI";
import RecipeCard from "@/components/recipes/RecipeCard";
import SearchInput from "@/components/recipes/SearchInput";
import FilterSection from "@/components/recipes/FilterSection";
import Pagination from "@/components/recipes/Pagination";
import Loader from "@/components/shared/Loader";
import { fetchRecipes } from "@/slices/recipes/recipeThunks";
import type { AppDispatch, RootState } from "@/app/store";
import type { RecipeFilters } from "@/types/recipes/recipeTypes";
import { Button } from "../ui/button";

interface RecipeListProps {
	title?: string;
	showNewRecipeButton?: boolean;
	authorId?: string;
}

const RecipeList = ({
	title,
	showNewRecipeButton = false,
	authorId = "",
}: RecipeListProps) => {
	const dispatch = useDispatch<AppDispatch>();

	const { items, loading, isRateLimited, pagination } = useSelector(
		(state: RootState) => state.recipes,
	);
	const { isAuthenticated } = useSelector((state: RootState) => state.auth);

	const [filters, setFilters] = useState<RecipeFilters>({
		search: "",
		preparationTime: "",
		minRating: "",
		sortBy: "createdAt",
		sortOrder: "desc",
	});
	const [page, setPage] = useState(1);
	const [limit] = useState(12);
	const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const [searchInput, setSearchInput] = useState("");

	const lastRequestParamsRef = useRef<string>("");

	const updateFilter = useCallback((key: keyof RecipeFilters, value: any) => {
		setFilters((prev) => ({ ...prev, [key]: value }));
		setPage(1);
	}, []);

	const requestParams = useMemo(() => {
		const params: any = {
			page,
			limit,
			sortBy: filters.sortBy,
			sortOrder: filters.sortOrder,
		};

		if (authorId) {
			params.authorId = authorId;
		}

		if (filters.search && filters.search.length >= 3) {
			params.search = filters.search;
		}

		if (filters.preparationTime) {
			params.preparationTime = filters.preparationTime;
		}

		if (filters.minRating !== "") {
			params.minRating = filters.minRating;
		}

		return params;
	}, [
		page,
		limit,
		filters.search,
		filters.preparationTime,
		filters.minRating,
		filters.sortBy,
		filters.sortOrder,
		authorId,
	]);

	const handleSearchInput = useCallback(
		(searchTerm: string) => {
			setSearchInput(searchTerm);

			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
			}

			debounceTimerRef.current = setTimeout(() => {
				if (searchTerm.length >= 3 || searchTerm === "") {
					updateFilter("search", searchTerm);
				}
			}, 1000);
		},
		[updateFilter],
	);

	useEffect(() => {
		const paramsString = JSON.stringify(requestParams);

		if (lastRequestParamsRef.current === paramsString) {
			return;
		}

		lastRequestParamsRef.current = paramsString;

		dispatch(fetchRecipes(requestParams))
			.unwrap()
			.catch(() => {
				toast.error("Failed to load recipes");
			});
	}, [dispatch, requestParams]);

	const handleClearFilters = () => {
		setFilters({
			search: "",
			preparationTime: "",
			minRating: "",
			sortBy: "createdAt",
			sortOrder: "desc",
		});
		setSearchInput("");
		setPage(1);
	};

	const hasActiveFilters = () =>
		filters.preparationTime ||
		filters.minRating !== "" ||
		filters.sortBy !== "createdAt" ||
		filters.sortOrder !== "desc" ||
		(filters.search && filters.search.length >= 3);

	if (loading && page === 1) return <Loader />;

	return (
		<div className='h-full'>
			{isRateLimited && <RateLimitedUI />}

			<div className='max-w-7xl mx-auto p-4 mt-6'>
				<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
					{title && (
						<h1 className='text-2xl font-bold text-gray-900'>{title}</h1>
					)}

					<div className='flex items-center gap-4'>
						{showNewRecipeButton && isAuthenticated && (
							<Link to={"/new-recipe"}>
								<Button className='cursor-pointer  bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors'>
									<span>New Recipe</span>
								</Button>
							</Link>
						)}
					</div>
				</div>

				<div className='mb-6'>
					<SearchInput
						value={searchInput}
						onSearch={handleSearchInput}
						placeholder='Search recipes by title or description...'
					/>
				</div>

				<div className='flex flex-col lg:flex-row gap-6'>
					<div className='lg:w-1/4'>
						<FilterSection
							filters={filters}
							onFilterChange={updateFilter}
							onClearFilters={handleClearFilters}
							hasActiveFilters={hasActiveFilters() as boolean}
						/>
					</div>

					<div className='lg:w-3/4'>
						{pagination && (
							<div className='mb-4 text-sm text-gray-600'>
								Showing {items.length} of {pagination.total} recipes
								{pagination.pages > 1 &&
									` • Page ${pagination.page} of ${pagination.pages}`}
							</div>
						)}

						{!isRateLimited && items.length === 0 && <RecipesNotFound />}

						{!isRateLimited && items.length > 0 && (
							<>
								<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
									{items.map((recipe) => (
										<RecipeCard key={recipe._id} recipe={recipe} />
									))}
								</div>

								{pagination && pagination.pages > 1 && (
									<Pagination
										currentPage={pagination.page}
										totalPages={pagination.pages}
										onPageChange={setPage}
									/>
								)}
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default RecipeList;

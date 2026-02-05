import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import RecipesNotFound from "@/components/RecipesNotFound";
import RateLimitedUI from "@/components/RateLimitedUI";
import RecipeCard from "@/components/RecipeCard";
import Loader from "@/components/shared/Loader";
import type { RootState, AppDispatch } from "@/app/store";
import { fetchRecipes } from "@/slices/recipes/recipeThunks";

const HomePage = () => {
	const dispatch = useDispatch<AppDispatch>();

	const { items, loading, isRateLimited, pagination } = useSelector(
		(state: RootState) => state.recipes,
	);

	useEffect(() => {
		dispatch(fetchRecipes())
			.unwrap()
			.catch(() => {
				toast.error("Failed to load recipes");
			});
	}, [dispatch]);

	if (loading) return <Loader />;

	return (
		<div className='h-full'>
			{isRateLimited && <RateLimitedUI />}

			<div className='max-w-7xl mx-auto p-4 mt-6'>
				{!isRateLimited && items.length === 0 && <RecipesNotFound />}

				{!isRateLimited && items.length > 0 && (
					<>
						{/* Show pagination info if available */}
						{pagination && (
							<div className='mb-4 text-sm text-gray-600'>
								Showing {items.length} of {pagination.total} recipes
								{pagination.pages > 1 &&
									` (Page ${pagination.page} of ${pagination.pages})`}
							</div>
						)}

						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
							{items.map((recipe) => (
								<RecipeCard key={recipe._id} recipe={recipe} />
							))}
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default HomePage;

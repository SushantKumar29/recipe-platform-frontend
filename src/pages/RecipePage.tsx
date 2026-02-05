import { useEffect } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import RateLimitedUI from "@/components/RateLimitedUI";
import Loader from "@/components/shared/Loader";

import { fetchRecipeById } from "@/slices/recipes/recipeThunks";
import { clearSelectedRecipe } from "@/slices/recipes/recipeSlice";
import type { RootState, AppDispatch } from "@/app/store";

const RecipePage = () => {
	const { id } = useParams<{ id: string }>();
	const dispatch = useDispatch<AppDispatch>();

	const { selectedRecipe, loading, isRateLimited } = useSelector(
		(state: RootState) => state.recipes,
	);

	useEffect(() => {
		if (id) {
			dispatch(fetchRecipeById(id))
				.unwrap()
				.catch(() => {
					toast.error("Failed to load recipe");
				});
		}

		return () => {
			dispatch(clearSelectedRecipe());
		};
	}, [dispatch, id]);

	if (loading) return <Loader />;

	return (
		<div className='h-full'>
			{isRateLimited && <RateLimitedUI />}

			{!isRateLimited && selectedRecipe && (
				<div className='bg-white rounded-lg shadow-md max-w-7xl mx-auto p-4 mt-6'>
					{/* Recipe title */}
					<h2 className='text-2xl font-bold text-gray-900 mb-3'>
						{selectedRecipe.title}
					</h2>

					{/* Author info - Handle both string ID and populated object */}
					<div className='mb-4 text-sm text-gray-600'>
						By:{" "}
						{typeof selectedRecipe.author === "object"
							? selectedRecipe.author.name
							: `User ${selectedRecipe.author?.substring(0, 8)}...`}
					</div>

					{/* Ratings summary */}
					{selectedRecipe.ratingCount > 0 && (
						<div className='mb-4 flex items-center gap-2'>
							<span className='text-yellow-500 font-bold'>
								★ {selectedRecipe.averageRating.toFixed(1)}
							</span>
							<span className='text-gray-500 text-sm'>
								({selectedRecipe.ratingCount}{" "}
								{selectedRecipe.ratingCount === 1 ? "rating" : "ratings"})
							</span>
						</div>
					)}

					{/* Ingredients */}
					<div className='mb-6'>
						<h3 className='text-lg font-semibold text-gray-900 mb-2'>
							Ingredients
						</h3>
						<div className='text-gray-700 whitespace-pre-line'>
							{selectedRecipe.ingredients}
						</div>
					</div>

					{/* Steps */}
					<div className='mb-8'>
						<h3 className='text-lg font-semibold text-gray-900 mb-2'>
							Instructions
						</h3>
						<div className='text-gray-700 whitespace-pre-line'>
							{selectedRecipe.steps}
						</div>
					</div>

					{/* Ratings section */}
					<div className='mb-8'>
						<h3 className='text-lg font-semibold text-gray-900 mb-3'>
							Ratings ({selectedRecipe.ratings?.length || 0})
						</h3>

						{selectedRecipe.ratings && selectedRecipe.ratings.length > 0 ? (
							<div className='space-y-4'>
								{selectedRecipe.ratings.map((rating) => (
									<div key={rating._id} className='border rounded-xl px-4 py-3'>
										<div className='flex justify-between items-center mb-2'>
											<div className='flex items-center'>
												<span className='h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600'>
													{rating.author.name.charAt(0).toUpperCase()}
												</span>
												<span className='ml-2 font-medium'>
													{rating.author.name}
												</span>
											</div>
											<div className='flex items-center gap-1'>
												<span className='text-yellow-500'>★</span>
												<span className='font-bold'>
													{rating.value.toFixed(1)}
												</span>
											</div>
										</div>
										<div className='text-xs text-gray-500'>
											{new Date(rating.createdAt).toLocaleDateString()}
										</div>
									</div>
								))}
							</div>
						) : (
							<p className='text-sm text-gray-400 italic'>No ratings yet.</p>
						)}
					</div>

					{/* Comments section */}
					<div className='mt-8'>
						<h3 className='text-lg font-semibold text-gray-900 mb-3'>
							Comments ({selectedRecipe.comments?.length || 0})
						</h3>

						{selectedRecipe.comments && selectedRecipe.comments.length > 0 ? (
							<div className='space-y-4'>
								{selectedRecipe.comments.map((comment) => (
									<div
										key={comment._id}
										className='border rounded-xl px-4 py-3'
									>
										<div className='flex items-center mb-2'>
											<span className='h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600'>
												{comment.author.name.charAt(0).toUpperCase()}
											</span>
											<span className='ml-2 font-medium'>
												{comment.author.name}
											</span>
										</div>
										<p className='text-gray-700 ml-10'>{comment.content}</p>
										<div className='text-xs text-gray-500 ml-10 mt-1'>
											{new Date(comment.createdAt).toLocaleDateString()}
										</div>
									</div>
								))}
							</div>
						) : (
							<p className='text-sm text-gray-400 italic'>No comments yet.</p>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default RecipePage;

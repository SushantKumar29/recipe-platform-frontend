import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Star } from "lucide-react";

import RateLimitedUI from "@/components/RateLimitedUI";
import Loader from "@/components/shared/Loader";
import CommentForm from "@/components/comments/CommentForm";

import {
	fetchRecipeById,
	fetchRecipeComments,
	addNewComment,
	rateRecipe,
} from "@/slices/recipes/recipeThunks";
import {
	clearSelectedRecipe,
	clearComments,
	updateRecipeRating,
	setUserRating,
	setRatingError,
	clearUserRating,
} from "@/slices/recipes/recipeSlice";
import type { RootState, AppDispatch } from "@/app/store";

const RecipePage = () => {
	const [commentPage, setCommentPage] = useState(1);
	const [hoverRating, setHoverRating] = useState<number | null>(null);

	const { id } = useParams<{ id: string }>();
	const dispatch = useDispatch<AppDispatch>();

	const {
		selectedRecipe,
		loading,
		isRateLimited,
		comments,
		commentsLoading,
		commentsPagination,
		ratingLoading,
		ratingError,
		userRating,
	} = useSelector((state: RootState) => state.recipes);

	const { isAuthenticated } = useSelector((state: RootState) => state.auth);

	useEffect(() => {
		if (id) {
			dispatch(fetchRecipeById(id))
				.unwrap()
				.catch(() => {
					toast.error("Failed to load recipe");
				});

			dispatch(fetchRecipeComments({ recipeId: id, page: commentPage }))
				.unwrap()
				.catch(() => {
					toast.error("Failed to load comments");
				});
		}

		return () => {
			dispatch(clearSelectedRecipe());
			dispatch(clearComments());
			dispatch(clearUserRating());
		};
	}, [dispatch, id, commentPage]);

	useEffect(() => {
		if (selectedRecipe && selectedRecipe.userRating && id) {
			dispatch(
				setUserRating({
					recipeId: id,
					value: selectedRecipe.userRating,
				}),
			);
		}
	}, [selectedRecipe, id, dispatch]);

	useEffect(() => {
		if (ratingError) {
			toast.error(ratingError);
			dispatch(setRatingError(null));
		}
	}, [ratingError, dispatch]);

	const handleAddComment = async (content: string) => {
		if (!id) return;

		try {
			await dispatch(addNewComment({ recipeId: id, content })).unwrap();
			toast.success("Comment added successfully!");
		} catch (error) {
			toast.error("Failed to add comment");
		}
	};

	const handleLoadMoreComments = () => {
		if (commentsPagination?.hasNext && id) {
			setCommentPage((prev) => prev + 1);
		}
	};

	const handleRateRecipe = async (value: number) => {
		if (!id || !isAuthenticated) {
			toast.error("Please login to rate this recipe");
			return;
		}

		if (value < 1 || value > 5) {
			toast.error("Rating must be between 1 and 5");
			return;
		}

		dispatch(setUserRating({ recipeId: id, value }));

		try {
			const response = await dispatch(
				rateRecipe({ recipeId: id, value }),
			).unwrap();

			if (selectedRecipe) {
				dispatch(
					updateRecipeRating({
						averageRating: response.averageRating,
						ratingCount: response.ratingCount,
					}),
				);
			}

			toast.success("Recipe rated successfully!");
		} catch (error: any) {
			dispatch(clearUserRating());
			toast.error(error);
		}
	};

	const getAuthorName = (comment: any) => {
		if (!comment.author) return "Anonymous";

		if (typeof comment.author === "object" && comment.author.name) {
			return comment.author.name;
		}

		if (typeof comment.author === "string") {
			return `User ${comment.author.substring(0, 4)}...`;
		}

		return "Anonymous";
	};

	const getAuthorInitial = (comment: any) => {
		if (!comment.author) return "A";

		if (typeof comment.author === "object" && comment.author.name) {
			return comment.author.name.charAt(0).toUpperCase();
		}

		return "A";
	};

	const getCurrentRating = () => {
		if (hoverRating !== null) return hoverRating;
		if (userRating && userRating.recipeId === id) return userRating.value;
		return selectedRecipe?.averageRating || 0;
	};

	const hasUserRated = () => {
		return userRating && userRating.recipeId === id;
	};

	if (loading) return <Loader />;

	return (
		<div className='h-full'>
			{isRateLimited && <RateLimitedUI />}

			{!isRateLimited && selectedRecipe && (
				<div className='bg-white rounded-lg shadow-md max-w-7xl mx-auto p-4 mt-6'>
					{selectedRecipe.image && (
						<div className='mb-6 rounded-lg overflow-hidden'>
							<img
								src={
									typeof selectedRecipe.image === "object"
										? selectedRecipe.image.url
										: selectedRecipe.image
								}
								alt={selectedRecipe.title}
								className='w-full max-h-125 object-scale-down rounded-lg'
							/>
						</div>
					)}
					<h2 className='text-2xl font-bold text-gray-900 mb-3'>
						{selectedRecipe.title}
					</h2>

					<div className='mb-4 text-sm text-gray-600'>
						By:{" "}
						{typeof selectedRecipe.author === "object"
							? selectedRecipe.author.name
							: `User ${selectedRecipe.author?.substring(0, 8)}...`}
					</div>

					<div className='mb-6'>
						<div className='flex items-center gap-4'>
							<div className='flex items-center gap-2'>
								<div className='flex'>
									{[1, 2, 3, 4, 5].map((star) => {
										const currentRating = getCurrentRating();
										const isFilled = star <= currentRating;
										const isUserRating =
											hasUserRated() && userRating?.value === star;

										return (
											<button
												key={star}
												type='button'
												onClick={() => handleRateRecipe(star)}
												onMouseEnter={() => setHoverRating(star)}
												onMouseLeave={() => setHoverRating(null)}
												disabled={!isAuthenticated || ratingLoading}
												className={`p-1 transition-all duration-200 ${
													!isAuthenticated
														? "cursor-not-allowed"
														: "cursor-pointer hover:scale-110"
												} ${ratingLoading ? "opacity-50" : ""}`}
												aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
											>
												<Star
													size={28}
													className={`
														${
															isFilled
																? isUserRating
																	? "fill-blue-500 text-blue-500"
																	: "fill-yellow-500 text-yellow-500"
																: "text-gray-300"
														}
														transition-colors duration-200
													`}
												/>
											</button>
										);
									})}
								</div>

								<div className='flex flex-col'>
									<div className='flex items-center gap-2'>
										<span className='text-yellow-500 font-bold text-lg'>
											★ {selectedRecipe.averageRating?.toFixed(1) || "0.0"}
										</span>
										<span className='text-gray-500 text-sm'>
											({selectedRecipe.ratingCount || 0}{" "}
											{selectedRecipe.ratingCount === 1 ? "rating" : "ratings"})
										</span>
									</div>

									{isAuthenticated && (
										<p className='text-xs text-gray-500 mt-1'>
											{hasUserRated()
												? `You rated this ${userRating!.value} star${userRating!.value > 1 ? "s" : ""}`
												: ""}
										</p>
									)}
									{!isAuthenticated && (
										<p className='text-xs text-gray-500 mt-1'>
											Login to rate this recipe
										</p>
									)}
								</div>
							</div>
						</div>

						{ratingLoading && (
							<div className='mt-2 flex items-center gap-2'>
								<div className='h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600' />
								<span className='text-sm text-gray-600'>
									Submitting rating...
								</span>
							</div>
						)}
					</div>

					<div className='mb-6'>
						<h3 className='text-lg font-semibold text-gray-900 mb-2'>
							Ingredients
						</h3>
						<div className='text-gray-700 whitespace-pre-line'>
							{selectedRecipe.ingredients}
						</div>
					</div>

					<div className='mb-8'>
						<h3 className='text-lg font-semibold text-gray-900 mb-2'>
							Instructions
						</h3>
						<div className='text-gray-700 whitespace-pre-line'>
							{selectedRecipe.steps}
						</div>
					</div>

					<div className='mt-8'>
						<h3 className='text-lg font-semibold text-gray-900 mb-3'>
							Comments ({commentsPagination?.totalComments || 0})
						</h3>

						{isAuthenticated && (
							<div className='mb-6'>
								<CommentForm onSubmit={handleAddComment} />
							</div>
						)}

						{commentsLoading && commentPage === 1 ? (
							<Loader />
						) : comments.length > 0 ? (
							<>
								<div className='space-y-4'>
									{comments.map((comment) => (
										<div
											key={comment._id}
											className='border rounded-xl px-4 py-3'
										>
											<div className='flex items-center mb-2'>
												<span className='h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600'>
													{getAuthorInitial(comment)}
												</span>
												<span className='ml-2 font-medium'>
													{getAuthorName(comment)}
												</span>
											</div>
											<p className='text-gray-700 ml-10'>{comment.content}</p>
											<div className='text-xs text-gray-500 ml-10 mt-1'>
												{new Date(comment.createdAt).toLocaleDateString()}
											</div>
										</div>
									))}
								</div>

								{commentsPagination?.hasNext && (
									<div className='mt-6 text-center'>
										<button
											onClick={handleLoadMoreComments}
											disabled={commentsLoading}
											className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50'
										>
											{commentsLoading ? "Loading..." : "Load More Comments"}
										</button>
									</div>
								)}
							</>
						) : (
							<p className='text-sm text-gray-400 italic'>
								No comments yet. Be the first to comment!
							</p>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default RecipePage;

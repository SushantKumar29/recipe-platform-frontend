import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { EditIcon, Star, Trash2Icon } from "lucide-react";

import RateLimitedUI from "@/components/RateLimitedUI";
import Loader from "@/components/shared/Loader";
import CommentForm from "@/components/comments/CommentForm";

import {
	fetchRecipeById,
	fetchRecipeComments,
	addNewComment,
	rateRecipe,
	deleteRecipe,
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
import type { User } from "@/types/users/userTypes";
import { formatPreparationTime } from "@/lib/formatters";

const RecipePage = () => {
	const [commentPage, setCommentPage] = useState(1);
	const [hoverRating, setHoverRating] = useState<number | null>(null);
	const [isSubmittingRating, setIsSubmittingRating] = useState(false);
	const [hasRatingError, setHasRatingError] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const dispatch = useDispatch<AppDispatch>();

	const {
		selectedRecipe,
		loading,
		isRateLimited,
		comments,
		commentsLoading,
		commentsPagination,
		ratingError,
		userRating,
	} = useSelector((state: RootState) => state.recipes);

	const { user, isAuthenticated } = useSelector(
		(state: RootState) => state.auth,
	);

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
		if (selectedRecipe && user && selectedRecipe.ratings) {
			const userRatingObj = selectedRecipe.ratings.find(
				(rating: any) => rating.author?._id === user._id,
			);

			if (userRatingObj && id) {
				dispatch(
					setUserRating({
						recipeId: id,
						value: userRatingObj.value,
					}),
				);
			}
		}
	}, [selectedRecipe, user, id, dispatch]);

	useEffect(() => {
		if (ratingError) {
			toast.error(ratingError);
			dispatch(setRatingError(null));
			setHasRatingError(true);
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

		if (isSubmittingRating) return;

		setIsSubmittingRating(true);
		setHasRatingError(false);

		dispatch(setUserRating({ recipeId: id, value }));

		try {
			const response = await dispatch(
				rateRecipe({ recipeId: id, value }),
			).unwrap();

			dispatch(
				updateRecipeRating({
					averageRating: response.averageRating,
					ratingCount: response.ratingCount,
				}),
			);

			if (selectedRecipe) {
				dispatch(fetchRecipeById(id))
					.unwrap()
					.then(() => {})
					.catch(() => {});
			}
		} catch (error: any) {
			const errorMessage = error?.message || error?.toString() || "";
			const isRateLimitError =
				errorMessage.includes("rate") ||
				errorMessage.includes("limit") ||
				errorMessage.includes("too many") ||
				errorMessage.includes("try again");

			if (isRateLimitError) {
				toast.error(
					"You've rated too many recipes recently. Please wait before rating again.",
				);
			} else {
				dispatch(clearUserRating());
				toast.error(errorMessage || "Failed to submit rating");
			}
			setHasRatingError(true);
		} finally {
			setIsSubmittingRating(false);
		}
	};

	const handleDeleteRecipe = async () => {
		if (!id || !selectedRecipe) return;

		setIsDeleting(true);
		try {
			await dispatch(deleteRecipe(id)).unwrap();
			toast.success("Recipe deleted successfully!");
			navigate("/recipes"); // Navigate to recipes list page
		} catch (error: any) {
			const errorMessage =
				error?.message || error?.toString() || "Failed to delete recipe";
			toast.error(errorMessage);
		} finally {
			setIsDeleting(false);
			setShowDeleteConfirm(false);
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

	const getCurrentUserRating = () => {
		if (hoverRating !== null) return hoverRating;
		if (userRating && userRating.recipeId === id) return userRating.value;
		if (selectedRecipe?.ratings && user) {
			const userRatingObj = selectedRecipe.ratings.find(
				(rating: any) => rating.author?._id === user._id,
			);
			return userRatingObj?.value || 0;
		}
		return 0;
	};

	const hasUserRated = () => {
		if (userRating && userRating.recipeId === id) return true;
		if (selectedRecipe?.ratings && user) {
			return selectedRecipe.ratings.some(
				(rating: any) => rating.author?._id === user._id,
			);
		}
		return false;
	};

	const getUserRatingValue = () => {
		if (userRating && userRating.recipeId === id) return userRating.value;
		if (selectedRecipe?.ratings && user) {
			const userRatingObj = selectedRecipe.ratings.find(
				(rating: any) => rating.author?._id === user._id,
			);
			return userRatingObj?.value || 0;
		}
		return 0;
	};

	const isOwner = () => {
		if (!isAuthenticated) return false;
		return (selectedRecipe?.author as User)?._id === user?._id;
	};

	const isRatingDisabled =
		!isAuthenticated || hasUserRated() || isSubmittingRating || hasRatingError;

	if (loading) return <Loader />;

	return (
		<div className='h-full'>
			{isRateLimited && <RateLimitedUI />}

			{!isRateLimited && selectedRecipe && (
				<div className='bg-white rounded-lg shadow-md max-w-7xl mx-auto p-4 my-6'>
					{/* Delete Confirmation Modal */}
					{showDeleteConfirm && (
						<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
							<div className='bg-white rounded-lg p-6 max-w-md w-full mx-4'>
								<h3 className='text-lg font-semibold text-gray-900 mb-2'>
									Delete Recipe
								</h3>
								<p className='text-gray-600 mb-6'>
									Are you sure you want to delete "{selectedRecipe.title}"? This
									action cannot be undone.
								</p>
								<div className='flex justify-end gap-3'>
									<button
										onClick={() => setShowDeleteConfirm(false)}
										disabled={isDeleting}
										className='px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50'
									>
										Cancel
									</button>
									<button
										onClick={handleDeleteRecipe}
										disabled={isDeleting}
										className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2'
									>
										{isDeleting && (
											<div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
										)}
										{isDeleting ? "Deleting..." : "Delete"}
									</button>
								</div>
							</div>
						</div>
					)}

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
					<div className='flex justify-start items-center gap-4 mb-3'>
						<span className='text-2xl font-bold text-gray-900'>
							{selectedRecipe.title}
						</span>
						{isOwner() && (
							<div className='flex gap-2'>
								<Link
									to={`/recipes/${id}/edit`}
									className='text-blue-500 hover:text-blue-600 p-2 rounded hover:bg-blue-50'
								>
									<EditIcon />
								</Link>
								<button
									onClick={() => setShowDeleteConfirm(true)}
									className='text-red-500 hover:text-red-600 p-2 rounded hover:bg-red-50'
									title='Delete recipe'
								>
									<Trash2Icon />
								</button>
							</div>
						)}
					</div>

					<div className='mb-4 text-sm text-gray-600'>
						By:{" "}
						{typeof selectedRecipe.author === "object"
							? selectedRecipe.author.name
							: `User ${selectedRecipe.author?.substring(0, 8)}...`}
					</div>

					<div className='mb-6'>
						<div className='flex flex-col gap-4'>
							<div className='flex items-center gap-2'>
								<span className='text-yellow-500 font-bold text-lg'>
									★ {(selectedRecipe.averageRating ?? 0).toFixed(1)}
								</span>
								<span className='text-gray-500 text-sm'>
									({selectedRecipe.ratingCount ?? 0}{" "}
									{selectedRecipe.ratingCount === 1 ? "rating" : "ratings"})
								</span>
							</div>

							<div className='flex items-center gap-4'>
								<div className='flex items-center gap-2'>
									<div className='flex'>
										{[1, 2, 3, 4, 5].map((star) => {
											const currentUserRating = getCurrentUserRating();
											const isFilled = star <= currentUserRating;

											return (
												<button
													key={star}
													type='button'
													onClick={() => handleRateRecipe(star)}
													onMouseEnter={() => setHoverRating(star)}
													onMouseLeave={() => setHoverRating(null)}
													disabled={isRatingDisabled}
													className={`p-1 transition-all duration-200 ${
														isRatingDisabled
															? "cursor-not-allowed opacity-50"
															: "cursor-pointer hover:scale-110"
													} ${isSubmittingRating ? "opacity-50" : ""}`}
													aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
												>
													<Star
														size={28}
														className={`
															${isFilled ? "fill-yellow-500 text-yellow-500" : "text-gray-300"}
															transition-colors duration-200
														`}
													/>
												</button>
											);
										})}
									</div>

									<div className='flex flex-col'>
										{isAuthenticated && (
											<>
												{hasUserRated() ? (
													<p className='text-sm text-gray-600'>
														You rated this {getUserRatingValue()} star
														{getUserRatingValue() > 1 ? "s" : ""}
													</p>
												) : (
													<p className='text-sm text-gray-600'>
														Rate this recipe
													</p>
												)}
											</>
										)}
										{!isAuthenticated && (
											<p className='text-sm text-gray-600'>
												Login to rate this recipe
											</p>
										)}
									</div>
								</div>
							</div>
						</div>

						{isSubmittingRating && (
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
							Preparation Time
						</h3>
						<div className='text-gray-700 whitespace-pre-line'>
							{formatPreparationTime(selectedRecipe.preparationTime)}
						</div>
					</div>

					<div className='mb-6'>
						<h3 className='text-lg font-semibold text-gray-900 mb-2'>
							Ingredients
						</h3>
						<div className='text-gray-700 whitespace-pre-line ml-6'>
							<ul className='list-disc'>
								{selectedRecipe.ingredients.map((ingredient, idx) => (
									<li key={idx}>{ingredient}</li>
								))}
							</ul>
						</div>
					</div>

					<div className='mb-8'>
						<h3 className='text-lg font-semibold text-gray-900 mb-2'>
							Instructions
						</h3>
						<div className='text-gray-700 whitespace-pre-line ml-6'>
							<ul className='list-disc'>
								{selectedRecipe.steps.map((step, idx) => (
									<li key={idx}>{step}</li>
								))}
							</ul>
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

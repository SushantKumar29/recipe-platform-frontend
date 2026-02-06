import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import RateLimitedUI from "@/components/RateLimitedUI";
import Loader from "@/components/shared/Loader";
import CommentForm from "@/components/comments/CommentForm";

import {
	fetchRecipeById,
	fetchRecipeComments,
	addNewComment,
} from "@/slices/recipes/recipeThunks";
import {
	clearSelectedRecipe,
	clearComments,
} from "@/slices/recipes/recipeSlice";
import type { RootState, AppDispatch } from "@/app/store";

const RecipePage = () => {
	const { id } = useParams<{ id: string }>();
	const dispatch = useDispatch<AppDispatch>();
	const [commentPage, setCommentPage] = useState(1);

	const {
		selectedRecipe,
		loading,
		isRateLimited,
		comments,
		commentsLoading,
		commentsPagination,
	} = useSelector((state: RootState) => state.recipes);

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
		};
	}, [dispatch, id, commentPage]);

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

						<div className='mb-6'>
							<CommentForm onSubmit={handleAddComment} />
						</div>

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

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Edit2, Trash2, MoreVertical, X } from "lucide-react";
import toast from "react-hot-toast";

import CommentForm from "@/components/comments/CommentForm";
import Loader from "@/components/shared/Loader";
import {
	updateRecipeComment,
	deleteRecipeComment,
} from "@/slices/recipes/recipeThunks";
import type { AppDispatch, RootState } from "@/app/store";
import type { Comment } from "@/types/comments/commentTypes";
import Pagination from "../recipes/Pagination";

interface RecipeCommentsProps {
	comments: Comment[];
	commentsLoading: boolean;
	commentsPagination: {
		page: number;
		pages: number;
		totalComments: number;
		limit: number;
	} | null;
	onPageChange: (page: number) => void; // Changed from onLoadMore
	onAddComment: (content: string) => Promise<void>;
}

const RecipeComments = ({
	comments,
	commentsLoading,
	commentsPagination,
	onPageChange,
	onAddComment,
}: RecipeCommentsProps) => {
	const dispatch = useDispatch<AppDispatch>();
	const { user, isAuthenticated } = useSelector(
		(state: RootState) => state.auth,
	);
	const { updatingCommentId, deletingCommentId } = useSelector(
		(state: RootState) => state.recipes,
	);

	const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
	const [showMenuForComment, setShowMenuForComment] = useState<string | null>(
		null,
	);

	const isCommentOwner = (comment: Comment) => {
		if (!user || !comment.author) return false;
		return comment.author._id === user._id;
	};

	const handleStartEdit = (comment: Comment) => {
		setEditingCommentId(comment._id);
		setShowMenuForComment(null);
	};

	const handleCancelEdit = () => {
		setEditingCommentId(null);
	};

	const handleUpdateComment = async (content: string) => {
		if (!editingCommentId || !content.trim()) return;

		try {
			await dispatch(
				updateRecipeComment({
					commentId: editingCommentId,
					content,
				}),
			).unwrap();

			toast.success("Comment updated successfully");
			setEditingCommentId(null);
		} catch (error: any) {
			toast.error(error.message || "Failed to update comment");
		}
	};

	const handleDeleteComment = async (commentId: string) => {
		if (!window.confirm("Are you sure you want to delete this comment?")) {
			return;
		}

		try {
			await dispatch(deleteRecipeComment({ commentId })).unwrap();

			toast.success("Comment deleted successfully");
			setShowMenuForComment(null);
		} catch (error: any) {
			toast.error(error.message || "Failed to delete comment");
		}
	};

	const getAuthorName = (comment: Comment) => {
		if (!comment.author) return "Anonymous";

		if (typeof comment.author === "object" && comment.author.name) {
			return comment.author.name;
		}

		if (typeof comment.author === "string") {
			return `User ${(comment.author as string).substring(0, 4)}...`;
		}

		return "Anonymous";
	};

	const getAuthorInitial = (comment: Comment) => {
		if (!comment.author) return "A";

		if (typeof comment.author === "object" && comment.author.name) {
			return comment.author.name.charAt(0).toUpperCase();
		}

		return "A";
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	return (
		<div className='mt-8'>
			<h3 className='text-lg font-semibold text-gray-900 mb-3'>
				Comments ({commentsPagination?.totalComments || 0})
			</h3>

			{isAuthenticated && (
				<div className='mb-6'>
					<CommentForm onSubmit={onAddComment} disabled={commentsLoading} />
				</div>
			)}

			{commentsLoading && comments.length === 0 ? (
				<Loader />
			) : comments.length > 0 ? (
				<>
					<div className='space-y-4'>
						{comments.map((comment) => {
							const isOwner = isCommentOwner(comment);
							const isEditing = editingCommentId === comment._id;
							const isUpdating = updatingCommentId === comment._id;
							const isDeleting = deletingCommentId === comment._id;

							return (
								<div
									key={comment._id}
									className='border rounded-xl px-4 py-3 hover:shadow-sm transition-shadow'
								>
									<div className='flex items-start justify-between mb-2'>
										<div className='flex items-center'>
											<span className='h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600'>
												{getAuthorInitial(comment)}
											</span>
											<div className='ml-3'>
												<span className='font-medium'>
													{getAuthorName(comment)}
													{isOwner && (
														<span className='ml-2 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded'>
															You
														</span>
													)}
												</span>
												<div className='text-xs text-gray-500'>
													{formatDate(comment.createdAt)}
													{comment.createdAt !== comment.updatedAt && (
														<span className='ml-1 italic'>(edited)</span>
													)}
												</div>
											</div>
										</div>

										{isOwner && !isEditing && (
											<div className='relative'>
												<button
													onClick={() =>
														setShowMenuForComment(
															showMenuForComment === comment._id
																? null
																: comment._id,
														)
													}
													className='p-1 hover:bg-gray-100 rounded'
													disabled={isUpdating || isDeleting}
												>
													<MoreVertical size={18} />
												</button>

												{showMenuForComment === comment._id && (
													<div className='absolute right-0 mt-1 w-40 bg-white border rounded-lg shadow-lg z-10'>
														<button
															onClick={() => handleStartEdit(comment)}
															className='flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100'
															disabled={isUpdating || isDeleting}
														>
															<Edit2 size={14} className='mr-2' />
															Edit
														</button>
														<button
															onClick={() => handleDeleteComment(comment._id)}
															className='flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50'
															disabled={isUpdating || isDeleting}
														>
															<Trash2 size={14} className='mr-2' />
															Delete
														</button>
													</div>
												)}
											</div>
										)}
									</div>

									{isEditing ? (
										<div className='mt-3 ml-10'>
											<CommentForm
												initialValue={comment.content}
												onSubmit={handleUpdateComment}
												disabled={isUpdating}
											/>
											<div className='mt-2 ml-1'>
												<button
													onClick={handleCancelEdit}
													disabled={isUpdating}
													className='text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1'
												>
													<X size={14} />
													Cancel edit
												</button>
											</div>
										</div>
									) : (
										<p className='text-gray-700 ml-10'>{comment.content}</p>
									)}

									{(isUpdating || isDeleting) && (
										<div className='ml-10 mt-2 flex items-center gap-2'>
											<div className='h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600' />
											<span className='text-sm text-gray-600'>
												{isUpdating ? "Updating..." : "Deleting..."}
											</span>
										</div>
									)}
								</div>
							);
						})}
					</div>
					{commentsPagination && commentsPagination.pages > 1 && (
						<div className='mt-6'>
							<Pagination
								currentPage={commentsPagination.page}
								totalPages={commentsPagination.pages}
								onPageChange={onPageChange}
							/>
						</div>
					)}
				</>
			) : (
				<p className='text-sm text-gray-400 italic'>
					No comments yet.{" "}
					{isAuthenticated ? "Be the first to comment!" : "Login to comment!"}
				</p>
			)}
		</div>
	);
};

export default RecipeComments;

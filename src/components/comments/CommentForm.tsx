import { useState } from "react";

interface CommentFormProps {
	onSubmit: (content: string) => void;
	disabled?: boolean;
}

const CommentForm = ({ onSubmit, disabled = false }: CommentFormProps) => {
	const [content, setContent] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!content.trim() || isSubmitting || disabled) return;

		setIsSubmitting(true);
		try {
			await onSubmit(content.trim());
			setContent("");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className='space-y-3'>
			<textarea
				value={content}
				onChange={(e) => setContent(e.target.value)}
				placeholder='Add a comment...'
				className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50'
				rows={3}
				disabled={disabled || isSubmitting}
			/>
			<div className='flex justify-end'>
				<button
					type='submit'
					disabled={!content.trim() || isSubmitting || disabled}
					className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
				>
					{isSubmitting ? "Posting..." : "Post Comment"}
				</button>
			</div>
		</form>
	);
};

export default CommentForm;

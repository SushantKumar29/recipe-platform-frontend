import { Link } from "react-router";
import { Star } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface RecipeCardProps {
	recipe: {
		_id: string;
		title: string;
		ingredients: string;
		steps: string;
		author: string | { _id: string; name: string; email: string };
		ratingCount: number;
		averageRating: number;
	};
}

const RecipeCard = ({ recipe }: RecipeCardProps) => {
	const authorName =
		typeof recipe.author === "object"
			? recipe.author.name
			: `User ${recipe.author?.substring(0, 6)}...`;

	return (
		<Link
			to={`/recipes/${recipe._id}`}
			className='block h-full hover:shadow-lg transition-all duration-200 rounded-2xl'
		>
			<Card className='w-full h-full border-t-4 border-solid border-[#00ff9D] hover:border-[#00cc7d]'>
				<CardHeader className='pb-3'>
					<CardTitle className='text-xl'>{recipe.title}</CardTitle>
					<div className='flex items-center gap-3 text-sm'>
						{recipe.ratingCount > 0 && (
							<div className='flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full'>
								<Star className='w-3 h-3 fill-yellow-400 text-yellow-400' />
								<span className='font-semibold'>
									{recipe.averageRating.toFixed(1)}
								</span>
								<span className='text-gray-500 text-xs'>
									({recipe.ratingCount})
								</span>
							</div>
						)}

						<span className='text-gray-600'>By {authorName}</span>
					</div>
				</CardHeader>
				<CardContent>
					<CardDescription className='mb-3'>
						<span className='font-medium text-gray-700'>Ingredients:</span>{" "}
						<span className='text-gray-600'>
							{recipe.ingredients.slice(0, 60)}
							{recipe.ingredients.length > 60 ? "..." : ""}
						</span>
					</CardDescription>

					<div className='text-sm text-gray-700'>
						<span className='font-medium'>Steps:</span>{" "}
						{recipe.steps.slice(0, 80)}
						{recipe.steps.length > 80 ? "..." : ""}
					</div>
				</CardContent>
			</Card>
		</Link>
	);
};

export default RecipeCard;

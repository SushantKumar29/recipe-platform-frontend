import { Link } from "react-router";
import { Star, ChefHat, Clock } from "lucide-react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Recipe } from "@/types/recipes/recipeTypes";

interface RecipeCardProps {
	recipe: Recipe;
}

const RecipeCard = ({ recipe }: RecipeCardProps) => {
	const authorName =
		typeof recipe.author === "object"
			? recipe.author.name
			: `User ${recipe.author?.substring(0, 6)}...`;
	const imageUrl =
		typeof recipe.image === "string" ? recipe.image : recipe.image?.url;

	return (
		<Card className='relative mx-auto w-full max-w-sm pt-0 rounded-2xl hover:shadow-lg transition-all duration-200 overflow-hidden'>
			<div className='w-full h-48 bg-gray-100 flex items-center justify-center rounded-t-2xl overflow-hidden'>
				{imageUrl ? (
					<img
						src={imageUrl}
						alt={recipe.title}
						className='w-full h-full object-cover hover:scale-105 transition-transform duration-300'
						onError={(e) => {
							(e.target as HTMLImageElement).style.display = "none";
							(
								e.target as HTMLImageElement
							).nextElementSibling?.classList.remove("hidden");
						}}
					/>
				) : null}
				<div
					className={`flex flex-col items-center justify-center ${imageUrl ? "hidden" : ""}`}
				>
					<ChefHat className='w-16 h-16 text-gray-400 mb-2' />
					<p className='text-sm text-gray-500 font-medium'>No Image</p>
				</div>
			</div>

			<CardHeader className='space-y-0'>
				<div className='flex justify-between items-start'>
					<CardTitle className='text-lg font-bold'>{recipe.title}</CardTitle>
					<Badge
						variant='secondary'
						className='flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full'
					>
						<Star className='w-3 h-3 fill-yellow-400 text-yellow-400' />
						<span className='font-semibold'>
							{recipe.averageRating.toFixed(1)}
						</span>
						<span className='text-gray-500 text-xs'>
							({recipe.ratingCount})
						</span>
					</Badge>
				</div>

				<div className='flex items-center gap-3 text-sm'>
					<span className='text-gray-600'>By {authorName}</span>
				</div>

				<CardDescription className='flex items-center gap-2'>
					<Clock className='w-4 h-4 text-gray-400' />
					<span>Preparation time: {recipe.preparationTime} minutes</span>
				</CardDescription>
			</CardHeader>

			<CardFooter className='flex justify-end pt-0'>
				<Link to={`/recipes/${recipe._id}`}>
					<Button className='ml-auto font-semibold bg-green-600 hover:bg-green-700'>
						View Recipe
					</Button>
				</Link>
			</CardFooter>
		</Card>
	);
};

export default RecipeCard;

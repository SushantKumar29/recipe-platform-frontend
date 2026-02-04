import { Link } from "react-router";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const RecipeCard = ({ recipe }: any) => {
	return (
		<Link
			to={`/recipes/${recipe._id}`}
			className='card bg-slate-500 hover:shadow-lg transition-all duration-200 border-t-4 border-solid border-[#00ff9D] rounded-2xl'
		>
			<Card className='mx-auto w-full'>
				<CardHeader>
					<CardTitle>{recipe.title}</CardTitle>
					<CardDescription>Ingredients: {recipe.ingredients}</CardDescription>
				</CardHeader>
				<CardContent>
					Steps:{" "}
					<p>
						{recipe.steps.slice(0, 100) +
							(recipe.steps.length > 100 ? "..." : "")}
					</p>
				</CardContent>
			</Card>
		</Link>
	);
};

export default RecipeCard;

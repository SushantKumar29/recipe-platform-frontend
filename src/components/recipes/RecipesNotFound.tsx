import { Link } from "react-router";
import { Button } from "../ui/button";

const RecipesNotFound = () => {
	return (
		<div className='flex flex-col items-center justify-center py-16 space-y-6 max-w-md mx-auto text-center'>
			<div className='bg-primary/10 rounded-full p-8'></div>
			<h3 className='text-2xl font-bold'>No recipes yet</h3>
			<p className='text-base-content/70'>
				Create your first recipe to get started on your journey.
			</p>
			<Link to='/new-recipe' className='btn btn-primary'>
				<Button className='cursor-pointer  bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors'>
					<span>Create Your First Recipe</span>
				</Button>
			</Link>
		</div>
	);
};
export default RecipesNotFound;

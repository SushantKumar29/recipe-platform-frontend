import { Link } from "react-router";

const RecipesNotFound = () => {
	return (
		<div className='flex flex-col items-center justify-center py-16 space-y-6 max-w-md mx-auto text-center'>
			<div className='bg-primary/10 rounded-full p-8'></div>
			<h3 className='text-2xl font-bold'>No recipes yet</h3>
			<p className='text-base-content/70'>
				Create your first recipe to get started on your journey.
			</p>
			<Link to='/create' className='btn btn-primary'>
				Create Your First Recipe
			</Link>
		</div>
	);
};
export default RecipesNotFound;

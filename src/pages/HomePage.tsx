import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import RecipesNotFound from "@/components/RecipesNotFound";
import RateLimitedUI from "@/components/RateLimitedUI";
import RecipeCard from "@/components/RecipeCard";
import Loader from "@/components/shared/Loader";
import api from "@/lib/axios";

const HomePage = () => {
	const [recipes, setRecipes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [isRateLimited, setIsRateLimited] = useState(false);

	useEffect(() => {
		const fetchRecipes = async () => {
			try {
				const response = await api.get("/recipes");
				setRecipes(response.data);
				setIsRateLimited(false);
			} catch (error) {
				console.error(error);
				if (axios.isAxiosError(error) && error.response?.status === 429) {
					setIsRateLimited(true);
				} else {
					toast.error("Failed to load recipes");
				}
			} finally {
				setLoading(false);
			}
		};
		fetchRecipes();
	}, []);
	if (loading) {
		return <Loader />;
	} else {
		return (
			<div className='h-full'>
				{isRateLimited && <RateLimitedUI />}
				<div className='max-w-7xl mx-auto p-4 mt-6'>
					{loading && (
						<div className='text-center text-primary py-10'>
							Loading Recipes...
						</div>
					)}
					{!loading && recipes.length === 0 && !isRateLimited && (
						<RecipesNotFound />
					)}
					{!loading && recipes.length > 0 && !isRateLimited && (
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
							{recipes.map((recipe: any) => (
								<RecipeCard
									key={recipe._id}
									recipe={recipe}
									setRecipes={setRecipes}
								/>
							))}
						</div>
					)}
				</div>
			</div>
		);
	}
};

export default HomePage;

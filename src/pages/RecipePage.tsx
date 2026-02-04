import { useParams } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import RateLimitedUI from "@/components/RateLimitedUI";
import Loader from "@/components/shared/Loader";
import api from "@/lib/axios";

const RecipePage = () => {
	const { id } = useParams();
	const [recipe, setRecipe] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [isRateLimited, setIsRateLimited] = useState(false);

	useEffect(() => {
		const fetchRecipes = async () => {
			try {
				const response = await api.get(`/recipes/${id}`);
				setRecipe(response.data);
				setIsRateLimited(false);
			} catch (error) {
				console.error(error);
				if (axios.isAxiosError(error) && error.response?.status === 429) {
					setIsRateLimited(true);
				} else {
					toast.error("Failed to load recipe");
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
				{(isRateLimited && <RateLimitedUI />) || (
					<div className='bg-white rounded-lg shadow-md max-w-7xl mx-auto p-4 mt-6'>
						{recipe && (
							<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
								<div>
									<h2 className='text-xl font-semibold'>{recipe.title}</h2>
									<p className='text-gray-600'>{recipe.ingredients}</p>
									<p className='text-gray-600'>{recipe.steps}</p>
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		);
	}
};

export default RecipePage;

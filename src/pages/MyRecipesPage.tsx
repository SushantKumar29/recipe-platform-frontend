import { Navigate } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import RecipeList from "@/components/recipes/RecipeList";

const MyRecipesPage = () => {
	const { user, isAuthenticated } = useSelector(
		(state: RootState) => state.auth,
	);

	if (!isAuthenticated) {
		return <Navigate to='/login' replace />;
	}

	return <RecipeList title='My Recipes' authorId={user?.id} />;
};

export default MyRecipesPage;

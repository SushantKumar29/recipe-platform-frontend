import { Route, Routes } from "react-router";

import ProtectedRoute from "@/components/ProtectedRoute";
import LoginPage from "@/pages/LoginPage";
import HomePage from "@/pages/HomePage";
import RecipePage from "@/pages/RecipePage";
import NewRecipePage from "@/pages/NewRecipePage";
import MyRecipesPage from "@/pages/MyRecipesPage";
import SignupPage from "@/pages/SignupPage";
import EditRecipePage from "@/pages/EditRecipePage";
const AppRoutes = () => {
	return (
		<Routes>
			<Route path='/' element={<HomePage />} />
			<Route path='/login' element={<LoginPage />} />
			<Route path='signup' element={<SignupPage />} />
			<Route path='/recipes' element={<HomePage />} />
			<Route path='/recipes/:id' element={<RecipePage />} />

			<Route
				path='/new-recipe'
				element={
					<ProtectedRoute>
						<NewRecipePage />
					</ProtectedRoute>
				}
			/>

			<Route
				path='/my-recipes'
				element={
					<ProtectedRoute>
						<MyRecipesPage />
					</ProtectedRoute>
				}
			/>

			<Route
				path='/recipes/:id/edit'
				element={
					<ProtectedRoute>
						<EditRecipePage />
					</ProtectedRoute>
				}
			/>
		</Routes>
	);
};

export default AppRoutes;

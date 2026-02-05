import { Route, Routes } from "react-router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoginPage from "@/pages/LoginPage";
import HomePage from "@/pages/HomePage";
import RecipePage from "@/pages/RecipePage";
import NewRecipePage from "@/pages/NewRecipePage";

const App = () => {
	return (
		<div className='min-h-screen flex flex-col bg-gray-300'>
			<Navbar />

			<main className='flex-1'>
				<Routes>
					<Route path='/' element={<HomePage />} />
					<Route path='/login' element={<LoginPage />} />

					<Route
						path='/new-recipe'
						element={
							<ProtectedRoute>
								<NewRecipePage />
							</ProtectedRoute>
						}
					/>

					<Route path='/recipes/:id' element={<RecipePage />} />
				</Routes>
			</main>

			<Footer />
		</div>
	);
};

export default App;

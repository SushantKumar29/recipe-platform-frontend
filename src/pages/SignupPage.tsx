import type { AppDispatch, RootState } from "@/app/store";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { registerUser } from "@/slices/auth/authThunks";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

type SignupFormValues = {
	name: string;
	email: string;
	password: string;
};

const SignupPage = () => {
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	const { isAuthenticated } = useSelector((state: RootState) => state.auth);
	useEffect(() => {
		if (isAuthenticated) {
			navigate("/");
		}
	}, [isAuthenticated, navigate]);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SignupFormValues>();

	const onSubmit = async (data: SignupFormValues) => {
		console.log("🚀 ~ onSubmit ~ data:", data);
		try {
			await dispatch(registerUser(data)).unwrap();
			toast.success(JSON.stringify(data));
		} catch (err: any) {
			toast.error(err?.message || "Signup failed");
		}
	};

	if (isAuthenticated) {
		return null;
	}

	return (
		<div className='h-full my-16 py-16 flex items-center justify-center'>
			<div className='w-full max-w-md bg-white border-[#00ff9D] border-t-4 rounded-xl shadow-lg p-6 sm:p-8'>
				<div className='text-center mb-6'>
					<h1 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-2'>
						Welcome to Recipe Platform
					</h1>
					<p className='text-sm sm:text-base text-gray-600'>
						Present your Recipes by creating an account
					</p>
				</div>

				<form onSubmit={handleSubmit(onSubmit)}>
					<FieldGroup>
						<Field>
							<FieldLabel
								htmlFor='fieldgroup-name'
								className='text-sm sm:text-base'
							>
								Name
							</FieldLabel>
							<Input
								id='fieldgroup-name'
								placeholder='John Doe'
								type='text'
								className='text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-3'
								{...register("name", {
									required: "Name is required",
									maxLength: {
										value: 50,
										message: "Name must be at most 50 characters",
									},
									pattern: {
										value: /^[A-Za-z\s]+$/,
										message:
											"Name cannot contain numbers or special characters",
									},
								})}
							/>
							{errors.name && (
								<p className='text-xs sm:text-sm text-red-600 mt-1'>
									{errors.name.message}
								</p>
							)}
						</Field>
						<Field>
							<FieldLabel
								htmlFor='fieldgroup-email'
								className='text-sm sm:text-base'
							>
								Email
							</FieldLabel>
							<Input
								id='fieldgroup-email'
								placeholder='name@example.com'
								type='email'
								className='text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-3'
								{...register("email", {
									required: "Email is required",
									pattern: {
										value: /^\S+@\S+\.\S+$/,
										message: "Invalid email format",
									},
								})}
							/>
							{errors.email && (
								<p className='text-xs sm:text-sm text-red-600 mt-1'>
									{errors.email.message}
								</p>
							)}
						</Field>
						<Field>
							<FieldLabel
								htmlFor='fieldgroup-password'
								className='text-sm sm:text-base'
							>
								Password
							</FieldLabel>
							<Input
								id='fieldgroup-password'
								type='password'
								className='text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-3'
								{...register("password", {
									required: "Password is required",
									minLength: {
										value: 8,
										message: "Password must be at least 8 characters",
									},
								})}
							/>
							{errors.password && (
								<p className='text-xs sm:text-sm text-red-600 mt-1'>
									{errors.password.message}
								</p>
							)}
						</Field>
						<Field
							orientation='horizontal'
							className='flex-col sm:flex-row gap-2 sm:gap-3 mt-6'
						>
							<Button
								type='submit'
								disabled={isSubmitting}
								className='w-full sm:w-auto text-sm sm:text-base px-3 py-1 sm:px-4 sm:py-2'
							>
								{isSubmitting ? "Signing up..." : "Sign up"}
							</Button>
						</Field>
					</FieldGroup>
				</form>

				<div className='mt-6 pt-6 border-t border-gray-200 text-center'>
					<p className='text-sm text-gray-600'>
						Already registered?{" "}
						<a
							href='/login'
							className='text-blue-600 hover:text-blue-800 font-medium'
						>
							Login here
						</a>
					</p>
					<p className='text-xs text-gray-500 mt-2'>
						Forgot your password?{" "}
						<a
							href='/forgot-password'
							className='text-blue-500 hover:text-blue-700'
						>
							Reset it
						</a>
					</p>
				</div>
			</div>
		</div>
	);
};

export default SignupPage;

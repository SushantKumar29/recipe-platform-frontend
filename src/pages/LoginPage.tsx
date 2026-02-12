import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginUser } from "@/slices/auth/authThunks";
import type { AppDispatch, RootState } from "@/app/store";
import { useEffect } from "react";

type LoginFormValues = {
	email: string;
	password: string;
};

const LoginPage = () => {
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
	} = useForm<LoginFormValues>();

	const onSubmit = async (data: LoginFormValues) => {
		try {
			await dispatch(loginUser(data)).unwrap();
			toast.success("Logged in successfully");
		} catch (err: unknown) {
			const message =
				typeof err === "string"
					? err
					: err instanceof Error
						? err.message
						: (err as { message: string })?.message || "Login failed";

			toast.error(message);
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
						Welcome Back
					</h1>
					<p className='text-sm sm:text-base text-gray-600'>
						Sign in to your account to continue
					</p>
				</div>

				<form onSubmit={handleSubmit(onSubmit)}>
					<FieldGroup>
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
								{...register("email", { required: "Email is required" })}
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
								{...register("password", { required: "Password is required" })}
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
								{isSubmitting ? "Logging in..." : "Login"}
							</Button>
						</Field>
					</FieldGroup>
				</form>

				<div className='mt-6 pt-6 border-t border-gray-200 text-center'>
					<p className='text-sm text-gray-600'>
						Don't have an account?{" "}
						<a
							href='/signup'
							className='text-blue-600 hover:text-blue-800 font-medium'
						>
							Sign up here
						</a>
					</p>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;

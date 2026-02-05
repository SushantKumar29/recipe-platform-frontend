import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { loginUser } from "@/slices/auth/authThunks";
import type { AppDispatch } from "@/app/store";
type LoginFormValues = {
	email: string;
	password: string;
};

const LoginPage = () => {
	const dispatch = useDispatch<AppDispatch>();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginFormValues>();

	const onSubmit = async (data: LoginFormValues) => {
		try {
			await dispatch(loginUser(data)).unwrap();
			toast.success("Logged in successfully");
		} catch (err: any) {
			toast.error(err?.message || "Login failed");
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<FieldGroup>
				<Field>
					<FieldLabel htmlFor='fieldgroup-name'>Email</FieldLabel>
					<Input
						id='fieldgroup-name'
						placeholder='name@example.com'
						type='email'
						{...register("email", { required: "Email is required" })}
					/>
					{errors.email && <p>{errors.email.message}</p>}
				</Field>
				<Field>
					<FieldLabel htmlFor='fieldgroup-email'>Password</FieldLabel>
					<Input
						id='fieldgroup-email'
						type='password'
						{...register("password", { required: "Password is required" })}
					/>
					{errors.password && <p>{errors.password.message}</p>}
				</Field>
				<Field orientation='horizontal'>
					<Button type='reset' variant='outline'>
						Reset
					</Button>
					<Button type='submit' disabled={isSubmitting}>
						{isSubmitting ? "Logging in..." : "Login"}
					</Button>
				</Field>
			</FieldGroup>
		</form>
	);
};

export default LoginPage;

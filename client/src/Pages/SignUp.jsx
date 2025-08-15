import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInFailure, signInSuccess } from '../redux/user/userSlice';

const SignUp = () => {
    const { loading, error: errorMessage } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            username: '',
            email: '',
            password: ''
        }
    });

    const onSubmit = async (formData) => {
        try {
            // dispatch(signInStart());
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success === false) {
                // dispatch(signInFailure(data.message));
                return;
            }

            if (response.ok) {
                // dispatch(signInSuccess(data));
                console.log(data);

                navigate('/sign-in');
            }
        } catch (error) {
            // dispatch(signInFailure(error.message));
        }
    };

    return (
        <div className="min-h-screen flex my-auto">
            <div className="flex p-3 gap-5 max-w-3xl mx-auto flex-col md:flex-row md:items-center">

                {/* Left side */}
                <div className="flex-1">
                    <Link to="/" className="font-bold text-5xl">
                        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                            Kasa's
                        </span>
                        Product
                    </Link>
                    <p className="text-lg font-normal mt-5">
                        This is a demo Project. You can signup with your email and password.
                    </p>
                </div>

                {/* Right side */}
                <div className="flex-1">
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <Label className="text-sm md:text-lg font-normal">Username</Label>
                            <TextInput
                                type="text"
                                placeholder="Username"
                                {...register('username', {
                                    required: 'Username is required',
                                    setValueAs: (v) => v.trim(),
                                })}
                            />
                            {errors.username && <span className="text-red-500">{errors.username.message}</span>}
                        </div>

                        <div>
                            <Label className="text-sm md:text-lg font-normal">Email</Label>
                            <TextInput
                                type="email"
                                placeholder="Email"
                                {...register('email', {
                                    required: 'Email is required',
                                })}
                            />
                            {errors.email && <span className="text-red-500">{errors.email.message}</span>}
                        </div>

                        <div>
                            <Label className="text-sm md:text-lg font-normal">Password</Label>
                            <TextInput
                                type="password"
                                placeholder="Password"
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be at least 6 characters',
                                    },
                                })}
                            />
                            {errors.password && <span className="text-red-500">{errors.password.message}</span>}
                        </div>

                        <Button
                            type="submit"
                            className="my-3 bg-gradient-to-r from-purple-500 to-pink-500 text-lg text-white hover:bg-gradient-to-l focus:ring-purple-200"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Spinner size="sm" />
                                    <span className="pl-3">Loading...</span>
                                </>
                            ) : (
                                'Sign Up'
                            )}
                        </Button>
                    </form>

                    <div className="text-sm gap-2 mt-5">
                        <span>Have an account?</span>
                        <Link to="/sign-in" className="text-blue-500">Sign In</Link>
                    </div>

                    {errorMessage && (
                        <Alert className="mt-5" color="failure">
                            {errorMessage}
                        </Alert>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SignUp;

import React from 'react';
import {Button, Container, TextInput, Title} from '@mantine/core';
import { Link } from 'react-router-dom';
import Header from '../Header'; 
import { IconX } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import {useSelector} from "react-redux";

const ResetPassword = () => {
    const {loggedUserId} = useSelector((state) => state.auth.user)


    const form = useForm({
        initialValues: {
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
        validate: {
            confirmPassword: (value, values) => (
                value !== values.newPassword ? 'Confirm passwords do not match' : null
            ),
        },
    });

    const handleSubmit = (values) => {
        console.log(values);
        // Perform form submission or other actions here
    };

    return (
        <>
            {/*<Header /> */}
            <div className='dashboard'> 
                <Container size="full">
                    <div className="lm-profile-form flex items-center justify-center h-[calc(100vh-65px)]">
                        <div className="rounded-md p-8 w-[416px] relative bg-white !border-radius-[16px] shadow-md">
                            <div className="flex justify-between mb-8">
                                {/*<h2 className="text-lg font-semibold">Reset password</h2>*/}
                                <Title order={4}>Reset password</Title>

                                <Link to={`/profile/${loggedUserId}`} className="text-gray-600 hover:text-gray-800 focus:shadow-none">
                                    <IconX size={24} color="#202020" /> 
                                </Link> 
                            </div> 
                            <form onSubmit={form.onSubmit(handleSubmit)}>
                                <div className="mb-4">
                                    <TextInput
                                        placeholder="Enter your old password"
                                        {...form.getInputProps('oldPassword')}
                                        radius="sm"
                                        size="md"
                                        styles={{
                                            width: '100%',
                                            borderColor: 'gray.3',
                                            backgroundColor: 'white',
                                            focus: {
                                            borderColor: 'blue.5',
                                            },
                                        }}
                                    />
                                </div>
                                <div className="mb-4"> 
                                    <TextInput
                                        placeholder="Create new password"
                                        {...form.getInputProps('newPassword')}
                                    />
                                </div>
                                <div className="mb-6"> 
                                    <TextInput
                                        placeholder="Confirm password"
                                        {...form.getInputProps('confirmPassword')}
                                        radius="sm"
                                        size="md"
                                        styles={{
                                            width: '100%',
                                            borderColor: 'gray.3',
                                            backgroundColor: 'white',
                                            focus: {
                                            borderColor: 'blue.5',
                                            },
                                        }}
                                    />
                                    {form.errors.confirmPassword && (
                                        <div className="text-red-500">{form.errors.confirmPassword}</div>
                                    )}
                                </div>
                                <div>
                                    <Button
                                        type="submit"
                                        variant="gradient"
                                        gradient={{ from: 'orange', to: 'orange' }} 
                                        radius="sm" // Ensure consistent corner radius
                                        size="md" // Adjust height if needed
                                        style={{ width: '100%' }} // Set full width
                                    >
                                        Confirm
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div> 
                </Container>
            </div>   
        </>
    );
}

export default ResetPassword;

import React, {Fragment, useEffect, useState} from 'react';
import {Button, Container, Group, ScrollArea, Select, TextInput, Text, Box, Title, Image, PasswordInput} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Link } from 'react-router-dom';
import useAuth from "../../utils/useAuth";
import logo from "../../img/logo.png"

const Login = () => {


    const form = useForm({
        initialValues: {
            email: '',
            password: '',
        },

        validate: {
            email: (value) => ( value.length < 1 ? 'Email is required': (/^\S+@\S+$/.test(value) ? null : 'Invalid email')),
            password: (value) => (value.length < 2 ? 'Password name is required' : null),
        },
    });

    const { signIn } = useAuth()
    const onSignIn = async (values) => {
        const { email, password } = values

        const result = await signIn({ email, password })
        console.log(result)
        /*if (result.status === 'error') {
            setMessage(result.message)
        }*/

    }
    const handleSubmit = (values) => {
        onSignIn(values)
        // dispatch(createUser(values))
        form.reset();
        // Perform form submission or other actions here
    };

    return (
        <Fragment>
            <div className='dashboard h-screen'>
                <Container size="full">
                    <div className="h-screen lm-profile-form flex items-center justify-center">
                        <Box m={4} p={32} radius="lg" bg="white" shadow="sm" style={{ maxWidth: '550px' }} className=" w-[416px]">
                            <Image
                             style={{ width: '70%', marginLeft: 'auto', marginRight: 'auto' }}
                            radius="md"
                                src={logo}
                                alt="Random unsplash image"
                            />
                            <div className="items-center text-center mb-4 mt-4">
                                <Title className="text-center" order={2}>Login</Title>
                            </div>
                            <form onSubmit={form.onSubmit(handleSubmit)}>

                                <TextInput
                                    type="email"
                                    placeholder="Email"
                                    mb={16}
                                    {...form.getInputProps('email')}
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

                                <PasswordInput
                                    size="md"
                                    mb={16}
                                    {...form.getInputProps('password')}
                                    radius="sm"
                                    placeholder="Password"
                                    styles={{
                                        width: '100%',
                                        borderColor: 'gray.3',
                                        backgroundColor: 'white',
                                        focus: {
                                            borderColor: 'blue.5',
                                        },
                                    }}
                                />


                                <div className="mb-4 text-center">
                                    <Link to="/forget-password"
                                          className="text-orange-500 font-semibold text-base leading-normal text-center mt-24 mb-24 focus:shadow-none">
                                        Forget Password
                                    </Link>
                                </div>
                                <Button
                                    type="submit"
                                    variant="gradient"
                                    gradient={{from: 'orange', to: 'orange'}}
                                    radius="sm"
                                    size="md"
                                    style={{width: '100%'}}
                                >
                                    Login
                                </Button>
                            </form>
                        </Box>
                    </div>
                </Container>
            </div>
        </Fragment>
    );
};

export default Login;

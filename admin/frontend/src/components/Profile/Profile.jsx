import React, {useEffect, useState} from 'react';
import {Button, Container, Group, ScrollArea, Select, TextInput, Text, Box, Title} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconX } from '@tabler/icons-react';
import Header from '../Header';
import {Link, useNavigate} from 'react-router-dom';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css'; // Import the CSS for react-phone-number-input
import { isValidPhoneNumber } from 'react-phone-number-input';
import {useDispatch, useSelector} from "react-redux";
import {fetchAllRoles} from "../../store/auth/roleSlice";
import {createUser} from "../../store/auth/userSlice";
// Import function for phone number validation

const Profile = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch();
    const {loggedInUser} = useSelector((state) => state.auth.session)
    useEffect(() => {
        dispatch(fetchAllRoles());
    }, []);
    const {roles} = useSelector((state) => state.auth.role);


    const form = useForm({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            roles: [],
        },

        validate: {
            firstName: (value) => (value.length < 2 ? 'First name is required' : null),
            email: (value) => ( value.length < 1 ? 'Email is required': (/^\S+@\S+$/.test(value) ? null : 'Invalid email')),
            phoneNumber: (value) => (value && !isValidPhoneNumber(value) ? 'Invalid phone number' : null),
        },
    });

    const onUserChange = (e) => {
        if(e){
            form.setFieldValue('roles', [{ id: e.value, name: e.label }]);
        }else {
            form.setFieldValue('roles', []);
        }
    };

    const handleSubmit = (values) => {
        values['loggedInUserId'] = loggedInUser ? loggedInUser.loggedUserId : null;
        dispatch(createUser(values))
        form.reset();
        // Perform form submission or other actions here
        navigate('/settings');
    };

    return (
        <>
            {/*<Header />*/}
            <div className='dashboard'>
                <Container size="full">
                    <div className="lm-profile-form flex items-center justify-center h-[calc(100vh-165px)]">
                        <Box m={4} p={32} radius="md" bg="white" shadow="sm" style={{ maxWidth: '416px' }}>
                            <div className="flex justify-between mb-8">
                                <Title className="text-center" order={4}>Create Profile</Title>
                                <Link to="/settings" className="text-gray-600 hover:text-gray-800 focus:shadow-none">
                                    <IconX size={24} color="#202020" /> 
                                </Link> 
                            </div>
                            <form onSubmit={form.onSubmit(handleSubmit)}>
                                <div className="flex gap-2 mb-4">
                                    <TextInput
                                        placeholder="First Name"
                                        {...form.getInputProps('firstName')}
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
                                    <TextInput
                                        placeholder="Last Name"
                                        {...form.getInputProps('lastName')}
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
                                    <Select
                                        size="md"
                                        placeholder="Select Role"
                                        data={roles && roles.length > 0 && roles.map((role) => ({
                                            value: role.id,
                                            label: role.name
                                        }))}
                                        defaultValue="React"
                                        searchable
                                        allowDeselect
                                        onChange={(e, option) => {
                                            onUserChange(option);
                                            if (form.getInputProps('roles').onChange)
                                                form.getInputProps('roles').onChange((option) => option);
                                        }}
                                    />

                                </div>
                                <div className="mb-4">
                                    <PhoneInput
                                        international
                                        defaultCountry="BD"
                                        className="w-full"
                                        numberInputProps={{
                                            className: "border !border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300 h-[40px]"
                                        }}
                                        placeholder="+12 344 678 98"
                                        {...form.getInputProps('phoneNumber')}
                                    />
                                    {form.errors.phoneNumber && (
                                        <Text color="red" mt={2}>
                                            {form.errors.phoneNumber}
                                        </Text>
                                    )}
                                </div>
                                <div className="mb-8">
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
                                </div>

                                    <Button
                                        type="submit"
                                        variant="gradient"
                                        gradient={{from: 'orange', to: 'orange'}}
                                        radius="sm"
                                        size="md"
                                        style={{width: '100%'}}
                                    >
                                        Save Changes
                                    </Button>
                            </form>
                        </Box>
                    </div>
                </Container>
            </div>
        </>
    );
};

export default Profile;

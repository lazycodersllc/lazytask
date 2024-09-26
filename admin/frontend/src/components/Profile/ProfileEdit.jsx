import React, {useEffect, useState} from 'react';
import {
    Button,
    Container,
    Group,
    ScrollArea,
    Select,
    TextInput,
    Text,
    Title,
    FileInput,
    rem, Avatar, Flex
} from '@mantine/core';
import { useForm } from '@mantine/form';
import Header from '../Header';
import {Link, useNavigate, useParams} from 'react-router-dom';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css'; // Import the CSS for react-phone-number-input
import { isValidPhoneNumber } from 'react-phone-number-input';
import {useDispatch, useSelector} from "react-redux";
import {fetchAllRoles} from "../../store/auth/roleSlice";
import {createUser, editUser, fetchUser, uploadProfilePhoto} from "../../store/auth/userSlice";
import {IconFileCv, IconPhoto} from "@tabler/icons-react";
import {hasPermission} from "../ui/permissions";

const ProfileEdit = () => {
    const {id} = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true);
    const {user} = useSelector((state) => state.auth.user);
    const icon = <IconPhoto style={{ width: "32px", height: "32px" }} stroke={1.5} />;
    const { loggedInUser } = useSelector((state) => state.auth.session)

    useEffect(() => {
        dispatch(fetchAllRoles());
        dispatch(fetchUser(id)).then(() => setLoading(false));
    }, [dispatch]);
    const {roles} = useSelector((state) => state.auth.role);

    const [file, setFile] = useState(null);
    const handleFileUpload = (file) => {
        setFile(file);
    };

    const handleSubmit = (values) => {
        const formData = new FormData();

        formData.append('firstName', values.firstName);
        formData.append('lastName', values.lastName);
        formData.append('email', values.email);
        formData.append('phoneNumber', values.phoneNumber);
        formData.append('roles', JSON.stringify(values.roles));
        formData.append('file', file);

        dispatch(editUser({id: id, data: formData}))
        navigate('/dashboard');
    };


    const form = useForm({
        name: user && user.id ? user.id : id,
        initialValues: {
            firstName: user && user.firstName ? user.firstName : '',
            lastName: user && user.lastName ? user.lastName : '',
            email: user && user.email ? user.email : '',
            phoneNumber: user && user.phoneNumber ? user.phoneNumber : '',
            roles: user && user.llc_roles && user.llc_roles.length>0 ? [{ id: user.llc_roles[0].id, name: user.llc_roles[0].name }]:[],
        },
        enableReinitialize: true,
        validate: {
            firstName: (value) => (value.length < 2 ? 'First name is required' : null),
            email: (value) => ( value.length < 1 ? 'Email is required': (/^\S+@\S+$/.test(value) ? null : 'Invalid email')),
            phoneNumber: (value) => (value && !isValidPhoneNumber(value) ? 'Invalid phone number' : null),
        },

    });
    useEffect(() => {
        if (user) {
            form.setFieldValue('firstName', user.firstName);
            form.setFieldValue('lastName', user.lastName);
            form.setFieldValue('email', user.email);
            form.setFieldValue('phoneNumber', user.phoneNumber);
            form.setFieldValue('roles', user && user.llc_roles && user.llc_roles.length>0 ? [{ id: user.llc_roles[0].id, name: user.llc_roles[0].name }]:[]);
        }
    }, [user]);

    const onUserRoleChangeHandler = (e) => {
        if(e){
            form.setFieldValue('roles', [{ id: e.value, name: e.label }]);
        }else {
            form.setFieldValue('roles', []);
        }
    };
    return (
        <>
            {/*<Header />*/}
            <ScrollArea>

            <div className='dashboard'>
                <Container size="full">
                    <div className="h-[calc(100vh-65px)] lm-profile-form flex items-center justify-center">
                        {!loading && (
                            <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
                                <div
                                    className="rounded-md p-8 w-[416px] relative bg-white shadow-md">
                                    <div className="flex justify-between mb-8">
                                        <Title className="text-center" order={4}>Edit Profile</Title>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="mb-4">
                                            <TextInput
                                                withAsterisk
                                                size="md"
                                                // label="First Name"
                                                placeholder="First Name"
                                                {...form.getInputProps('firstName')}
                                            />

                                        </div>
                                        <div className="mb-4">
                                            <TextInput
                                                size="md"
                                                // label="Last Name"
                                                placeholder="Last Name"
                                                {...form.getInputProps('lastName')}
                                            />

                                        </div>
                                    </div>
                                    {hasPermission(loggedInUser && loggedInUser.llc_permissions, ['superadmin']) &&
                                        <div className="mb-4">
                                            <Select
                                                size="md"
                                                placeholder="Select Role"
                                                data={roles && roles.length > 0 && roles.map((role) => ({
                                                    value: role.id,
                                                    label: role.name
                                                }))}
                                                defaultValue={user && user.llc_roles && user.llc_roles.length > 0 ? user.llc_roles[0].id.toString() : ''}
                                                searchable
                                                allowDeselect
                                                onChange={(e, option) => {
                                                    onUserRoleChangeHandler(option);
                                                    if (form.getInputProps('roles').onChange)
                                                        form.getInputProps('roles').onChange((option) => option);
                                                }}
                                            />

                                        </div>
                                    }

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
                                    <div className="mb-4">
                                    <TextInput
                                            size="md"
                                            withAsterisk
                                            // label="Last Name"
                                            placeholder="Email"
                                            {...form.getInputProps('email')}
                                        />
                                        {/*<input
                                        type="email"
                                        placeholder="Email"
                                        className="p-2 block w-full border !border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300 h-[40px]"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />*/}
                                    </div>
                                    <div className="mb-8">
                                        <Flex gap="md" align="center">
                                            { user && user.avatar &&
                                                <Avatar src={user?.avatar} alt={user?.name} radius="xl" size={40} />
                                            }
                                            <FileInput
                                                className={`!w-full`}
                                                size="md"
                                                accept="image/png,image/jpeg,image/jpg"
                                                clearable
                                                placeholder="Upload Profile Picture"
                                                leftSection={icon}
                                                leftSectionPointerEvents="none"
                                                onChange={handleFileUpload}
                                            />
                                        </Flex>
                                    </div>
                                    <div>
                                        <Button
                                            type="submit"
                                            // gradient={{from: 'orange', to: 'orange'}}
                                            radius="sm"
                                            size="md"
                                            fullWidth
                                            variant="filled"
                                            color="#ED7D31"
                                            justify="center"
                                        >
                                            Save Changes
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        )}

                    </div>
                </Container>
            </div>
            </ScrollArea>

        </>
    );
};

export default ProfileEdit;

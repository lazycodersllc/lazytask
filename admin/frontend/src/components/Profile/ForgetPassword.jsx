import React, {Fragment, useEffect, useState} from 'react';
import {
    Button,
    Container,
    Group,
    ScrollArea,
    Select,
    TextInput,
    Text,
    Box,
    Title,
    Image,
    Notification, Flex, LoadingOverlay
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {Link, useNavigate} from 'react-router-dom';
import useAuth from "../../utils/useAuth";
import logo from "../../img/logo.png"
import {IconX} from "@tabler/icons-react";
import {useDisclosure} from "@mantine/hooks";
import appConfig from "../../configs/app.config";

const ForgetPassword = () => {

    const navigate = useNavigate()

    const form = useForm({
        initialValues: {
            email: '',
        },

        validate: {
            email: (value) => ( value.length < 1 ? 'Email is required': (/^\S+@\S+$/.test(value) ? null : 'Invalid email')),
        },
    });

    const [visible, setVisible] = useState(false);


    const [message, setMessage] = useState('Please enter your email address. You will receive an email message with instructions on how to reset your password.');

    const { forgetPassword } = useAuth()
    const handleForgetPassword = async (values) => {
        const { email, password } = values

        const result = await forgetPassword({ email, password })
        console.log(result)
        if (result.status === 200) {
            setVisible(false)
            setMessage(result.message)
            navigate(appConfig.unAuthenticatedEntryPath)
        }else {
            setMessage(result.message)
            setTimeout(() => {
                setVisible(false)
            }, 1000)
        }

    }
    const handleSubmit = (values) => {
        setVisible(true)
        handleForgetPassword(values)
        form.reset();
        // Perform form submission or other actions here
    };


    return (
        <Fragment>
            <div className='dashboard'>
                <Container size="full">
                    <div className="lm-profile-form flex items-center justify-center h-[calc(100vh-65px)]">
                        <Flex className={`w-[416px]`} gap="lg" direction="column" align="center" justify="center">
                            <Notification withCloseButton={false} classNames={{
                                root: '!w-full',
                            }}>
                                <Text size="sm">{message}</Text>
                            </Notification>
                            <div className="rounded-md p-8 w-[416px] relative bg-white !border-radius-[16px] shadow-md">
                                <LoadingOverlay
                                    visible={visible}
                                    zIndex={1000}
                                    overlayProps={{ radius: 'sm', blur: 2 }}
                                />
                                <div className="flex justify-between mb-8">
                                    {/*<h2 className="text-lg font-semibold">Reset password</h2>*/}
                                    <Title order={4}>Forget password</Title>
                                    <Link to={`/lazy-login`}
                                          className="text-gray-600 hover:text-gray-800 focus:shadow-none">
                                        <IconX size={24} color="#202020"/>
                                    </Link>
                                </div>
                                <form onSubmit={form.onSubmit(handleSubmit)}>
                                    <div className="mb-4">
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

                                    <div>
                                        <Button
                                            type="submit"
                                            variant="gradient"
                                            gradient={{from: 'orange', to: 'orange'}}
                                            radius="sm" // Ensure consistent corner radius
                                            size="md" // Adjust height if needed
                                            style={{width: '100%'}} // Set full width
                                        >
                                            Get new password
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </Flex>
                    </div>
                </Container>
            </div>
        </Fragment>
    );
};

export default ForgetPassword;

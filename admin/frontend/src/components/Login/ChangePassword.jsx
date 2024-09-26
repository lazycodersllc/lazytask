import React, {useState} from 'react';
import {
    Button,
    Container,
    Flex,
    LoadingOverlay,
    Notification,
    PasswordInput,
    Text,
    TextInput,
    Title
} from '@mantine/core';
import {Link, useNavigate, useSearchParams} from 'react-router-dom';
import { IconX } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import appConfig from "../../configs/app.config";

const ChangePassword = () => {

    const navigate = useNavigate()
    const form = useForm({
        initialValues: {
            newPassword: '',
            confirmPassword: '',
        },
        validate: {
            newPassword: (value) => (
                value.length < 1 ? 'Password is required' : (value.length < 6 ? 'Password is min 6 character' : null)
            ),
            confirmPassword: (value, values) => (
                value !== values.newPassword ? 'Confirm passwords do not match' : null
            ),
        },
    });

    const handleSubmit = (values) => {
        console.log(values);
        // Perform form submission or other actions here
    };

    const [searchParams] = useSearchParams();

    const [message, setMessage] = useState('');
    const [visible, setVisible] = useState(false);

    const handlePasswordReset = async (e) => {
        setVisible(true);
        const key = searchParams.get('key');
        const login = searchParams.get('login');

        const data = {
            key,
            login,
            password: e.newPassword,
        };

        const response = await fetch(`${appConfig.liveApiUrl}/forget-password-store`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data ),
        });

        const result = await response.json();
        if (response.status === 200) {
            setVisible(false);
            setMessage( result.message || 'Password has been reset successfully.');
            navigate(appConfig.unAuthenticatedEntryPath)
        } else {
            setMessage(result.message || 'Failed to reset password.');
            setVisible(false);
        }

    };

    return (
        <>
            <div className='dashboard'>
                <Container size="full">
                    <div className="lm-profile-form flex items-center justify-center h-[calc(100vh-65px)]">
                        <Flex className={`w-[416px]`} gap="lg" direction="column" align="center" justify="center">
                            {message &&
                                <Notification withCloseButton={false} classNames={{
                                    root: '!w-full',
                                }}>
                                    <Text size="sm">{message}</Text>
                                </Notification>
                            }
                            <div className="rounded-md p-8 w-[416px] relative bg-white !border-radius-[16px] shadow-md">
                                <LoadingOverlay
                                    visible={visible}
                                    zIndex={1000}
                                    overlayProps={{ radius: 'sm', blur: 2 }}
                                />
                                <div className="flex justify-between mb-8">
                                    {/*<h2 className="text-lg font-semibold">Reset password</h2>*/}
                                    <Title order={4}>Reset password</Title>

                                    <Link to={`/lazy-login`} className="text-gray-600 hover:text-gray-800 focus:shadow-none">
                                        <IconX size={24} color="#202020"/>
                                    </Link>
                                </div>
                                <form onSubmit={form.onSubmit(handlePasswordReset)}>

                                    <div className="mb-4">
                                        <PasswordInput
                                            size="md"
                                            placeholder="Create new password"
                                            {...form.getInputProps('newPassword')}
                                        />
                                    </div>
                                    <div className="mb-6">
                                        <PasswordInput
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
                        </Flex>
                    </div> 
                </Container>
            </div>   
        </>
    );
}

export default ChangePassword;

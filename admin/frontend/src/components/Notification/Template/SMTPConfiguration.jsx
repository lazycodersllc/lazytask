import React, {Fragment, useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Button,
    Checkbox,
    Container,
    Divider, Fieldset,
    Grid,
    Group, NumberInput,
    Paper, PasswordInput,
    ScrollArea,
    Tabs,
    TextInput,
    Title
} from '@mantine/core';
import {useForm} from "@mantine/form";
import {editSetting, fetchSettings} from "../../Settings/store/settingSlice";
const SMTPConfiguration = () => {
    // const users = useSelector((state) => state.users);
    const { loggedInUser } = useSelector((state) => state.auth.session)
    const { settings } = useSelector((state) => state.settings.setting)
console.log(settings);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchSettings());
    }, [dispatch]);

    const [zohoHost, setZohoHost] = useState('');
    const [zohoUsername, setZohoUsername] = useState('');
    const [zohoPassword, setZohoPassword] = useState('');
    const [zohoSenderName, setZohoSenderName] = useState('');
    const [zohoSenderEmail, setZohoSenderEmail] = useState('');
    const [zohoPort, setZohoPort] = useState(587);



    const form = useForm({
        name: 'smtp-configuration',
        mode: 'uncontrolled',
        initialValues: {
            smtp_service_provider: 'zoho',
            smtp_host: zohoHost || '',
            smtp_username: zohoUsername || '',
            smtp_password: zohoPassword || '',
            smtp_sender_name: zohoSenderName || '',
            smtp_sender_email: zohoSenderEmail || '',
            smtp_port: zohoPort || 587,
        },

        validate: {
            smtp_host: (value) => (value.length < 1 ? 'Host is required' : null),
            smtp_username: (value) => (value.length < 1 ? 'Username is required' : null),
            smtp_password: (value) => (value.length < 1 ? 'Password is required' : null),
        },
    });


    useEffect(() => {
        if(settings && settings.smtp_configuration) {
            try {
                // Parse the JSON string
                const parsedData = JSON.parse(settings.smtp_configuration);

                // Check if the parsedData is defined and contains the smtp_username key
                if (parsedData && parsedData.smtp_host) {
                    setZohoHost(parsedData.smtp_host);
                    form.setFieldValue('smtp_host', parsedData.smtp_host);
                }
                if (parsedData && parsedData.smtp_username) {
                    setZohoUsername(parsedData.smtp_username);
                    form.setFieldValue('smtp_username', parsedData.smtp_username);
                }
                if(parsedData && parsedData.smtp_password) {
                    setZohoPassword(parsedData.smtp_password);
                    form.setFieldValue('smtp_password', parsedData.smtp_password);
                }
                if (parsedData && parsedData.smtp_sender_name) {
                    setZohoSenderName(parsedData.smtp_sender_name);
                    form.setFieldValue('smtp_sender_name', parsedData.smtp_sender_name);
                }
                if (parsedData && parsedData.smtp_sender_email) {
                    setZohoSenderEmail(parsedData.smtp_sender_email);
                    form.setFieldValue('smtp_sender_email', parsedData.smtp_sender_email);
                }
                if (parsedData && parsedData.smtp_port) {
                    setZohoPort(parsedData.smtp_port);
                    form.setFieldValue('smtp_port', parsedData.smtp_port);
                }
            } catch (error) {
                console.error("JSON parsing error:", error.message);
            }
        }
    }, [settings]);

    const handleSubmit = (values) => {
        const formData = new FormData();
        formData.append('settings', JSON.stringify({...settings, smtp_configuration: values, type:'smtp'}));
        dispatch(editSetting({ data: formData }));
    };

  return (
    <Fragment>
        <Paper>
            <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
                <Fieldset legend="Zoho SMTP Information">
                    <div className="mb-4">
                        <Grid>
                            <Grid.Col span={{md: 4, lg: 4}}>
                                <TextInput
                                    size="md"
                                    withAsterisk
                                    label="Host"
                                    placeholder="Enter host"
                                    key={form.key('smtp_host')}
                                    {...form.getInputProps('smtp_host')}
                                    defaultValue={zohoHost}
                                />
                            </Grid.Col>
                            <Grid.Col span={{md: 4, lg: 4}}>
                                <TextInput
                                    autoComplete={false}
                                    size="md"
                                    withAsterisk
                                    label="Username"
                                    placeholder="Enter username"
                                    key={form.key('smtp_username')}
                                    {...form.getInputProps('smtp_username')}
                                    defaultValue={zohoUsername}
                                />
                            </Grid.Col>
                            <Grid.Col span={{ md: 4, lg: 4}}>
                                <PasswordInput
                                    autoComplete={false}
                                    size="md"
                                    withAsterisk
                                    label="Password"
                                    placeholder="Enter password"
                                    key={form.key('smtp_password')}
                                    {...form.getInputProps('smtp_password')}
                                    defaultValue={zohoPassword}
                                />
                            </Grid.Col>
                            <Grid.Col span={{md: 4, lg: 4}}>
                                <TextInput
                                    size="md"
                                    withAsterisk
                                    label="Sender Name"
                                    placeholder="Enter sender name"
                                    key={form.key('smtp_sender_name')}
                                    {...form.getInputProps('smtp_sender_name')}
                                    defaultValue={zohoSenderName}
                                />
                            </Grid.Col>
                            <Grid.Col span={{md: 4, lg: 4}}>
                                <TextInput
                                    autoComplete={false}
                                    size="md"
                                    withAsterisk
                                    label="Sender Email"
                                    placeholder="Enter sender email"
                                    key={form.key('smtp_sender_email')}
                                    {...form.getInputProps('smtp_sender_email')}
                                    defaultValue={zohoSenderEmail}
                                />
                            </Grid.Col>
                            <Grid.Col span={{ md: 4, lg: 4}}>
                                <NumberInput
                                    size="md"
                                    label="Port"
                                    placeholder="Enter port"
                                    min={1} max={65535}
                                    defaultValue={zohoPort}
                                    key={form.key('smtp_port')}
                                    {...form.getInputProps('smtp_port')}
                                />
                            </Grid.Col>
                        </Grid>

                    </div>
                </Fieldset>


                <Group justify="flex-start" mt="md">
                    <Button variant="filled" color="#ED7D31" type="submit">Submit</Button>
                </Group>
            </form>
        </Paper>

    </Fragment>
  );
};

export default SMTPConfiguration;

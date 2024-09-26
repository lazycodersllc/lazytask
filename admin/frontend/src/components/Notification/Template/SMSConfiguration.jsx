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
const SMSConfiguration = () => {
    // const users = useSelector((state) => state.users);
    const { loggedInUser } = useSelector((state) => state.auth.session)
    const { settings } = useSelector((state) => state.settings.setting)

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchSettings());
    }, [dispatch]);

    const [reveApiUrl, setReveApiUrl] = useState('');
    const [reveApiSecretKey, setReveApiSecretKey] = useState('');
    const [reveApiKey, setReveApiKey] = useState('');
    const [smsSenderName, setSmsSenderName] = useState('');


    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            sms_service_provider: 'reve',
            sms_api_url: reveApiUrl || '',
            sms_api_secret_key: reveApiSecretKey || '',
            sms_api_key: reveApiKey || '',
            sms_sender_name: smsSenderName || '',
        },

        validate: {
            sms_api_url: (value) => (value.length < 1 ? 'Host is required' : null),
            sms_api_secret_key: (value) => (value.length < 1 ? 'Username is required' : null),
            sms_api_key: (value) => (value.length < 1 ? 'Password is required' : null),
        },
    });

    useEffect(() => {
        if(settings && settings.sms_configuration) {
            try {
                // Parse the JSON string
                const parsedData = JSON.parse(settings.sms_configuration);

                // Check if the parsedData is defined and contains the sms_api_secret_key key
                if (parsedData && parsedData.sms_api_url) {
                    setReveApiUrl(parsedData.sms_api_url);
                    form.setFieldValue('sms_api_url', parsedData.sms_api_url);
                }
                if (parsedData && parsedData.sms_api_secret_key) {
                    setReveApiSecretKey(parsedData.sms_api_secret_key);
                    form.setFieldValue('sms_api_secret_key', parsedData.sms_api_secret_key);
                }
                if(parsedData && parsedData.sms_api_key) {
                    setReveApiKey(parsedData.sms_api_key);
                    form.setFieldValue('sms_api_key', parsedData.sms_api_key);
                }
                if (parsedData && parsedData.sms_sender_name) {
                    setSmsSenderName(parsedData.sms_sender_name);
                    form.setFieldValue('sms_sender_name', parsedData.sms_sender_name);
                }
            } catch (error) {
                console.error("JSON parsing error:", error.message);
            }
        }
    }, [settings]);

    const handlerSMSConfigurationSubmit = (values) => {
        const formData = new FormData();
        formData.append('settings', JSON.stringify({...settings, sms_configuration: values , type:'sms'}));
        dispatch(editSetting({ data: formData }));
        // dispatch(editSetting({ data: {...settings, sms_configuration: values , type:'sms'} }));
    };

  return (
    <Fragment>
        <Paper>
            <form onSubmit={form.onSubmit((values) => handlerSMSConfigurationSubmit(values))}>
                <Fieldset legend=" Reve SMS Gateway Information ">
                    <div className="mb-4">
                        <Grid>
                            <Grid.Col span={{md: 12, lg: 12}}>
                                <TextInput
                                    size="md"
                                    withAsterisk
                                    label="API URL"
                                    placeholder="Enter api url"
                                    key={form.key('sms_api_url')}
                                    {...form.getInputProps('sms_api_url')}
                                    defaultValue={reveApiUrl}
                                />
                            </Grid.Col>
                            <Grid.Col span={{ md: 4, lg: 4}}>
                                <TextInput
                                    autoComplete={false}
                                    size="md"
                                    withAsterisk
                                    label="API Key"
                                    placeholder="Enter api key"
                                    key={form.key('sms_api_key')}
                                    {...form.getInputProps('sms_api_key')}
                                    defaultValue={reveApiKey}
                                />
                            </Grid.Col>
                            <Grid.Col span={{md: 4, lg: 4}}>
                                <TextInput
                                    autoComplete={false}
                                    size="md"
                                    withAsterisk
                                    label="API Secret Key"
                                    placeholder="Enter api secret key"
                                    key={form.key('sms_api_secret_key')}
                                    {...form.getInputProps('sms_api_secret_key')}
                                    defaultValue={reveApiSecretKey}
                                />
                            </Grid.Col>
                            <Grid.Col span={{md: 4, lg: 4}}>
                                <TextInput
                                    size="md"
                                    withAsterisk
                                    label="Sender Name"
                                    placeholder="Enter sender name"
                                    key={form.key('sms_sender_name')}
                                    {...form.getInputProps('sms_sender_name')}
                                    defaultValue={smsSenderName}
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

export default SMSConfiguration;

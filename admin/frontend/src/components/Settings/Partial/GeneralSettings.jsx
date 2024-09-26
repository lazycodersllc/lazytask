import React, {Fragment, useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Avatar,
    Button,
    Checkbox,
    Container,
    FileInput, Flex,
    Grid,
    Group, Image,
    Paper,
    ScrollArea,
    Tabs,
    TextInput,
    Title
} from '@mantine/core';
import {useForm} from "@mantine/form";
import {editSetting, fetchSettings} from "../store/settingSlice";
const GeneralSettings = () => {
    // const users = useSelector((state) => state.users);
    const { loggedInUser } = useSelector((state) => state.auth.session)
    const { settings } = useSelector((state) => state.settings.setting)

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchSettings());
    }, [dispatch]);

    const [siteTitle, setSiteTitle] = useState('');
    const [siteLogoPath, setSiteLogoPath] = useState('');

    const [file, setFile] = useState(null);
    const handleFileUpload = (file) => {
        setFile(file);
    };

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            site_title: siteTitle || '',
        },

        validate: {
            site_title: (value) => (value.length < 1 ? 'Site title is required' : null),
        },
    });

    useEffect(() => {
        if(settings && settings.core_setting) {
            try {
                // Parse the JSON string
                const parsedData = JSON.parse(settings.core_setting);
                // Check if the parsedData is defined and contains the site_title key
                if (parsedData && parsedData.site_title) {
                    setSiteTitle(parsedData.site_title);
                    form.setFieldValue('site_title', parsedData.site_title);
                }
                if(parsedData && parsedData.site_logo) {
                    setSiteLogoPath(parsedData.site_logo);
                }
            } catch (error) {
                console.error("JSON parsing error:", error.message);
            }
        }
    }, [settings]);

    const handleSubmit = (values) => {
        const formData = new FormData();
        formData.append('site_logo', file);
        formData.append('settings', JSON.stringify({...settings, core_setting: values, type:'general'}));
        dispatch(editSetting({ data: formData }));
    };

  return (
    <Fragment>
        <Paper>
            <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>

                <div className="mb-4">
                    <Grid>
                        <Grid.Col span={{ md: 4, lg: 4 }}>
                            <TextInput
                                size="md"
                                withAsterisk
                                label="Site title"
                                placeholder="Enter site title"
                                key={form.key('site_title')}
                                {...form.getInputProps('site_title')}
                                defaultValue={siteTitle}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ md: 4, lg: 4 }}>
                            <Flex align="end" gap={10}>
                                {siteLogoPath &&
                                    // <Avatar size={60} src={siteLogoPath} alt="it's me" />
                                    // <Image src={siteLogoPath} alt={siteTitle} width={`60px`} height="auto"} />
                                    <Image
                                    radius="md"
                                    h={60}
                                    w="auto"
                                    fit="contain"
                                    src={siteLogoPath}
                                />
                                }

                                <FileInput
                                    className={`min-w-[250px]`}
                                    size="md"
                                    accept="image/png,image/jpeg,image/jpg"
                                    label="Site Logo"
                                    placeholder="Upload site logo"
                                    key={form.key('site_logo')}
                                    onChange={handleFileUpload}
                                />
                            </Flex>
                        </Grid.Col>
                    </Grid>

                </div>


                <Group justify="flex-start" mt="md">
                    <Button variant="filled" color="#ED7D31" type="submit">Submit</Button>
                </Group>
            </form>
        </Paper>

    </Fragment>
  );
};

export default GeneralSettings;

import React, {Fragment, useCallback, useEffect, useState} from 'react';
import {Modal, Select, Tabs, Textarea, TextInput, Title} from '@mantine/core';
import { useSelector, useDispatch } from 'react-redux';
import {createNotificationTemplate} from "../store/notificationTemplateSlice";

const CreateTemplateModal = ({modalOpened, closeModal }) => {
    const dispatch = useDispatch();
    const {loggedUserId} = useSelector((state) => state.auth.user);
    const {notificationChannels, notificationActions} = useSelector((state) => state.notifications.notificationTemplate);
    const [title, setTitle] = useState('Type title here');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState([]);
    const [notificationAction, setNotificationAction] = useState(null);
    const [emailSubject, setEmailSubject] = useState( null);

    const handleTemplateCreation = () => {
        const newTemplateData = {
            title: title,
            created_by: loggedUserId,
            description: description,
            content: content,
            notification_action_name: notificationAction,
            email_subject: emailSubject
        };

        if(newTemplateData.title!=='' && newTemplateData.title!=='Type title here'){
            dispatch(createNotificationTemplate(newTemplateData));
            setTitle('Type title here');
            setDescription('');
            setContent([]);
            setNotificationAction(null);
            setEmailSubject('');
        }
    };


    return (
        <Fragment>
            <Modal.Root
                opened={modalOpened}
                onClose={() => {
                    closeModal()
                    handleTemplateCreation()
                }
            }
                centered
                size="100%"
            >
                <Modal.Overlay />
                <Modal.Content radius={15}>
                    <Modal.Header px={20} py={10}>
                        <Title order={5}>Create Template</Title>
                        <Modal.CloseButton />
                    </Modal.Header>
                    <Modal.Body>
                        <div className="create-form-box">

                            <div className="mb-4">
                                <TextInput
                                    label="Do action title"
                                    placeholder="Enter your title"
                                    radius="md"
                                    size="md"
                                    styles={{
                                        borderColor: "gray.3",
                                        backgroundColor: "white",
                                        focus: {
                                            borderColor: "blue.5",
                                        },
                                    }}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            <div className="mb-4">
                                {/*<Select
                                    placeholder="Select Action"
                                    data={notificationActions && Object.keys(notificationActions).map((action) => ({ value: action, label: notificationActions[action] }))}
                                    clearable
                                    onChange={(e) => { setNotificationAction(e)}}
                                />*/}
                                <TextInput
                                    label="Do action (hook)"
                                    placeholder="Enter action name"
                                    radius="md"
                                    size="md"
                                    styles={{
                                        borderColor: "gray.3",
                                        backgroundColor: "white",
                                        focus: {
                                            borderColor: "blue.5",
                                        },
                                    }}
                                    onChange={(e) => setNotificationAction(e.target.value)}
                                />
                            </div>

                            <div className="mb-4">
                                { notificationChannels && notificationChannels.length > 0 &&
                                    <Tabs color="orange" defaultValue={notificationChannels[0].slug}>
                                        <Tabs.List>
                                            { notificationChannels.map((channel) => (
                                                <Tabs.Tab value={channel.slug} key={channel.id}>
                                                    {channel.name}
                                                </Tabs.Tab>
                                                )
                                             )}
                                        </Tabs.List>

                                        { notificationChannels.map((channel) => (
                                            <Tabs.Panel value={channel.slug} key={channel.id}>

                                                {channel.slug === 'email' &&
                                                    <div className="mt-2">
                                                        <TextInput
                                                            label="Email subject"
                                                            placeholder="Enter email subject"
                                                            radius="md"
                                                            size="md"
                                                            styles={{
                                                                borderColor: "gray.3",
                                                                backgroundColor: "white",
                                                                focus: {
                                                                    borderColor: "blue.5",
                                                                },
                                                            }}
                                                            onChange={(e) => setEmailSubject(e.target.value)}
                                                            value={emailSubject}
                                                        />
                                                    </div>
                                                }

                                                <div className="mt-2">
                                                    <Textarea
                                                        rows={10}
                                                        label="Message body"
                                                        resize="vertical"
                                                        name={channel.slug}
                                                        placeholder={`Enter ${channel.name} content here`}
                                                        radius="md"
                                                        size="md"
                                                        onChange={(e) => {
                                                            setContent({
                                                                ...content,
                                                                [channel.slug]: e.target.value
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            </Tabs.Panel>
                                            )
                                        )}
                                    </Tabs>
                                }

                            </div>

                        </div>
                    </Modal.Body>
                </Modal.Content>
            </Modal.Root>
        </Fragment>
    );
}

export default CreateTemplateModal;
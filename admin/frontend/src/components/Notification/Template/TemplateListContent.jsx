import React, {useState, useEffect, Fragment, useRef} from 'react';
import {
    ActionIcon,
    Button,
    Input,
    Menu,
    rem,
    ScrollArea,
    Textarea,
    TextInput,
    Title,
    Text,
    useMantineTheme, Card, Group, Table, CloseButton, Avatar
} from '@mantine/core';
import { useSelector, useDispatch } from 'react-redux';
import {IconEdit, IconPlus, IconRowRemove, IconSettings, IconTrash} from "@tabler/icons-react";
import {useDisclosure} from "@mantine/hooks";
import EditTemplateModal from "./EditTemplateModal";
import {fetchNotificationTemplate, removeNotificationTemplate} from "../store/notificationTemplateSlice";
import {modals} from "@mantine/modals";
import CreateTemplateModal from "./CreateTemplateModal";

const TemplateListContent = () => {
    const dispatch = useDispatch();
    const {notificationTemplates} = useSelector((state) => state.notifications.notificationTemplate);
    const [templateData, setTemplateData] = useState(notificationTemplates && notificationTemplates.length > 0 ? notificationTemplates : []);

    useEffect(() => {
        setTemplateData(notificationTemplates && notificationTemplates.length > 0 ? notificationTemplates : []);
    }, [notificationTemplates]);

    const rows = templateData && templateData.length > 0 && templateData.map((element) => (
        <Table.Tr key={element.id} title={element.title}>
            <Table.Td title={element.title}>
                <Text fz="sm" title={element.title} lineClamp={1}>
                    {element.title}
                </Text>
            </Table.Td>
            <Table.Td>{ Object.keys(element.content).map((data) => data).join(', ') }</Table.Td>
            <Table.Td>{element.notification_action_name}</Table.Td>
            <Table.Td>
                <div className="flex items-center gap-3">
                    <button className="text-center rounded-md border border-solid border-orange-500 px-2 py-1"
                            onClick={() => editTemplateModalHandler(element.id)} >
                        <IconEdit size={20} color="#ED7D31" stroke={1.25}/>
                    </button>
                    {/*<IconEdit size={20} onClick={() => editTemplateModalHandler(element.id)}/>*/}
                    <IconTrash
                        onClick={() => {
                            templateDeleteHandler(element.id)
                        }}
                        size={20}
                        color="red"
                        stroke={1.25}
                    />
                </div>
            </Table.Td>
        </Table.Tr>
    ));


    const [notificationEditTemplateModalOpen, {
        open: openNotificationEditTemplateModal,
        close: closeNotificationEditTemplateModal
    }] = useDisclosure(false);


    const editTemplateModalHandler = (id) => {
        openNotificationEditTemplateModal();
        dispatch(fetchNotificationTemplate(id));
    };


    const [notificationTemplateModalOpen, { open: openNotificationTemplateModal, close: closeNotificationTemplateModal }] = useDisclosure(false);


    const createTemplateModalHandler = () => {
        openNotificationTemplateModal();
    };

    const templateDeleteHandler = (templateId) => modals.openConfirmModal({
        title: (
            <Title order={5}>Are you sure delete?</Title>
        ),
        size: 'sm',
        radius: 'md',
        withCloseButton: false,
        children: (
            <Text size="sm">
                This action is so important that you are required to confirm it with a modal. Please click
                one of these buttons to proceed.
            </Text>
        ),
        labels: { confirm: 'Confirm', cancel: 'Cancel' },
        onCancel: () => {
            console.log('Cancel');
        },
        onConfirm: () => {
            if(templateId && templateId!=='undefined'){
                dispatch(removeNotificationTemplate(templateId));
            }
        },
    });



    return (
        <>
            <Card withBorder shadow="sm" radius="md">
                <Card.Section px="xs">
                    <ScrollArea className="relative h-full pb-[2px]" scrollbarSize={4}>
                        <Table>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Title</Table.Th>
                                    <Table.Th>Chanel</Table.Th>
                                    <Table.Th>Do action hook</Table.Th>
                                    <Table.Th>
                                        <Avatar
                                            onClick={createTemplateModalHandler}
                                            size={32}
                                            bg="#ED7D31"
                                            color="#fff"
                                            title="Add New Notification Template"
                                        >
                                            <IconPlus className=' hover:scale-110' size={20}/>
                                        </Avatar>
                                    </Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>{rows}</Table.Tbody>
                        </Table>
                    </ScrollArea>
                </Card.Section>
            </Card>
            { notificationEditTemplateModalOpen && <EditTemplateModal modalOpened={notificationEditTemplateModalOpen} closeModal={closeNotificationEditTemplateModal} /> }

            {notificationTemplateModalOpen && <CreateTemplateModal modalOpened={notificationTemplateModalOpen}
                                                                   closeModal={closeNotificationTemplateModal}/>}

        </>
    );
};

export default TemplateListContent;

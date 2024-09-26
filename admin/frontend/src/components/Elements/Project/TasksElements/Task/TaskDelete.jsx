import {IconCheck, IconTrash} from '@tabler/icons-react';
import React, {Fragment, useEffect, useRef, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {deleteTask, removeSuccessMessage} from "../../../../Settings/store/taskSlice";
import {Button, Text, Title, useMantineTheme} from '@mantine/core';
import {modals} from "@mantine/modals";
import {hasPermission} from "../../../../ui/permissions";
import {notifications} from "@mantine/notifications";
const TaskDelete = ({ task, taskId, isSubtask }) => {
    const theme = useMantineTheme();
    const dispatch = useDispatch();
    const {loggedUserId} = useSelector((state) => state.auth.user)
    const {loggedInUser} = useSelector((state) => state.auth.session)
    const {success} = useSelector((state) => state.settings.task);


    //taskDeleteHandler
    const taskDeleteHandler = () => modals.openConfirmModal({
        title: (
            <Title order={5}>Are you sure this task delete?</Title>
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
        onCancel: () => console.log('Cancel'),
        onConfirm: () => {
            if(taskId && taskId!=='undefined'){
                if(task && (task.children && task.children.length > 0 || task.attachments && task.attachments.length > 0)){
                    modals.open({
                        withCloseButton: false,
                        centered: true,
                        children: (
                            <Fragment>
                                { task.children && task.children.length > 0 &&
                                    <Text size="sm">
                                        This task has {task.children.length} sub-tasks. Please delete all sub-tasks before deleting this task.
                                    </Text>
                                }
                                { task.attachments && task.attachments.length > 0 &&
                                    <Text size="sm">
                                        This task has {task.attachments.length} attachments. Please delete all attachments before deleting this task.
                                    </Text>
                                }
                                <div className="!grid w-full !justify-items-center">
                                    <Button justify="center" onClick={() => modals.closeAll()} mt="md">
                                        Ok
                                    </Button>
                                </div>
                            </Fragment>
                        ),
                    });
                }else{
                    const taskType = isSubtask ? 'sub-task' : 'task';
                    dispatch(deleteTask({id: taskId, data: {'deleted_by': loggedUserId, 'type': taskType}}));

                    if(success){
                        notifications.show({
                            color: theme.primaryColor,
                            title: success,
                            icon: <IconCheck />,
                            autoClose: 5000,
                            // withCloseButton: true,
                        });
                        const timer = setTimeout(() => {
                            dispatch(removeSuccessMessage());
                        }, 5000); // Clear notification after 3 seconds

                        return () => clearTimeout(timer);
                    }
                }

            }
        },
    });

    return (
        <>
            {hasPermission(loggedInUser && loggedInUser.llc_permissions, ['superadmin', 'admin', 'director', 'manager', 'line_manager', 'employee', 'task-delete']) &&
                <IconTrash
                    className="cursor-pointer"
                    onClick={()=> {taskDeleteHandler()}}
                    size={20}
                    stroke={1}
                    color="red"
                />
            }
        </>
    );
};

export default TaskDelete;

import {Button, Group, Modal, Text, Title, useMantineTheme} from '@mantine/core';
import {IconCheck} from '@tabler/icons-react';
import WorkspaceDeleteButton from '../../Button/WorkspaceDeleteButton';
import {useDispatch, useSelector} from "react-redux";
import {deleteCompany, removeSuccessMessage} from "../../../Settings/store/companySlice";
import {modals} from "@mantine/modals";
import React, {Fragment} from "react";
import {notifications} from "@mantine/notifications";
const DeleteWorkspaceModal = (props) => {
    const {
        id,
        name,
        projects,
        members
    } = props;
    const dispatch = useDispatch();
    const theme = useMantineTheme();
    const {loggedUserId} = useSelector((state) => state.auth.user)
    const {success} = useSelector((state) => state.settings.company);

    const deleteHandler = () => modals.openConfirmModal({
        title: (
            <Title order={5}>Are you sure this workspace delete?</Title>
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
            if(id && id!=='undefined'){
                if((members && members.length > 0 || projects && projects.length > 0)){
                    modals.open({
                        withCloseButton: false,
                        centered: true,
                        children: (
                            <Fragment>
                                { members && members.length > 0 &&
                                    <Text size="sm">
                                        This workspace has {members.length} members. Please delete all members before deleting this workspace.
                                    </Text>
                                }
                                { projects && projects.length > 0 &&
                                    <Text size="sm">
                                        This workspace has {projects.length} projects. Please delete all project before deleting this workspace.
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
                    dispatch(deleteCompany({id:id, data: {"deleted_by": loggedUserId}}))

                    if(success){
                        notifications.show({
                            color: theme.primaryColor,
                            title: 'Workspace Deleted Successfully',
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
            <WorkspaceDeleteButton onClick={deleteHandler} />
        );
}
 
export default DeleteWorkspaceModal;
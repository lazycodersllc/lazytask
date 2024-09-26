import { Button, Group, Modal, Text } from '@mantine/core'; 
import { useDisclosure } from '@mantine/hooks'; 
import ProjectDeleteButton from '../../Button/ProjectDeleteButton'; 
import { IconAlertTriangleFilled } from '@tabler/icons-react';
import {useDispatch, useSelector} from "react-redux";
import {deleteProject} from "../../../Settings/store/projectSlice";
const DeleteProjectModal = ({id}) => {

    const dispatch = useDispatch();

    const {loggedUserId} = useSelector((state) => state.auth.user)

    const [projectDeleteModalOpen, { open: deleteProjectModal, close: closeProjectDeleteModal }] = useDisclosure(false);

    const deleteHandler = () => {
        if(id === undefined || id === null || id === ''){
            return;
        }
        dispatch(deleteProject({id:id, data: {'deleted_by': loggedUserId}}));
    }

    return (
        <>
            <ProjectDeleteButton onClick={deleteProjectModal} />
            
            <Modal radius="15px" opened={projectDeleteModalOpen} centered size={475} padding="0px" withCloseButton={false}>
                <div className="dm-head flex justify-center items-center gap-2 p-6 border-b border-gray-300">
                
                    <IconAlertTriangleFilled style={{ color: 'orange' }} />
                    <Text ta="center" fz="xl" fw={500} c="#202020">
                        Delete Project
                    </Text>
                  
                </div>
                <div className="delete-c-box p-10"> 
                
                    <Text ta="center" fz="lg" fw={500} c="#202020" mb="xl">
                        You are going to delete “Project 1”.
                        Are you sure?
                    </Text>

                    <Group mt="xl" grow wrap="nowrap"  ta="center">
                        <Button onClick={closeProjectDeleteModal} style={{ '--button-bg': '#EBF1F4', color: '#4D4D4D' }}>No, Keep It.</Button>
                        <Button onClick={() => {
                            deleteHandler();
                            closeProjectDeleteModal()
                        }} color="orange">Yes, Delete !</Button>
                    </Group>
                </div>
            </Modal>
            </>
    );
}
 
export default DeleteProjectModal;
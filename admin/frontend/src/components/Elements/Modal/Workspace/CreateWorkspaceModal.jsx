import React, {useEffect, useState} from 'react';
import {Avatar, Button, Modal, ScrollArea, Text, TextInput, Title} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import WorkspaceCreateButton from '../../Button/WorkspaceCreateButton';
import { IconSearch } from '@tabler/icons-react';
import { IconX } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useSelector, useDispatch } from 'react-redux';
import { workspace, addWorkspace, updateWorkspaceUsers } from '../../../../reducers/workspaceSlice';
import {fetchAllMembers} from "../../../../store/auth/userSlice";
import {createCompany} from "../../../Settings/store/companySlice";
import UserAvatarSingle from "../../../ui/UserAvatarSingle"; // Import your Redux action creators for adding a workspace and updating workspace users

const CreateWorkspaceModal = () => { 
    const dispatch = useDispatch();
    const {allMembers} = useSelector((state) => state.auth.user);
    const {loggedUserId} = useSelector((state) => state.auth.user)

    useEffect(() => {
        dispatch(fetchAllMembers())
    }, [dispatch]);

    const [workspaceCreateModalOpen, { open: openWorkspaceCreateModal, close: closeWorkspaceCreateModal }] = useDisclosure(false);

    const [workspaceName, setWorkspaceName] = useState('');

    const [showMembersList, setShowMembersList] = useState(false);

    const [currentMemberData, setCurrentMemberData] = useState([
    ]);
    const handleDeleteCurrentMember = (id) => {
        // Remove the member with the specified ID from currentMemberData
        const updatedCurrentMembers = currentMemberData.filter((member) => member.id !== id);
        setCurrentMemberData(updatedCurrentMembers);
    
        // Remove the member's ID from the addedMembers array
        setAddedMembers((prevMembers) => prevMembers.filter((memberId) => memberId !== id));
    };
    
 

    const [searchValue, setSearchValue] = useState('');

    const handleSearchInputChange = (e) => {
        const inputValue = e.target.value;
        setSearchValue(inputValue);
        // console.log(matchingMembers);
        setShowMembersList(true);
        
    };
    const handleSearchInputFocus = (e) => {

        setShowMembersList(true);

    };


    const filteredMembers = allMembers && allMembers.length>0 && allMembers.filter(
        (member) =>
          member.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          member.email.toLowerCase().includes(searchValue.toLowerCase())
      );

      const [addedMembers, setAddedMembers] = useState([]);


      const handleButtonClick = (clickedMember) => {
        // Check if the member is not already in the current list
        if (!addedMembers.includes(clickedMember.id)) {
            // Add the clickedMember to the currentMemberData state with updated status
            const updatedClickedMember = { ...clickedMember, status: 'Added' };
            setCurrentMemberData((prevData) => [...prevData, updatedClickedMember]);
            // Update the state to indicate that the member has been added
            setAddedMembers((prevMembers) => [...prevMembers, clickedMember.id]);
        }
    };

    useEffect(() => {

        if(workspaceCreateModalOpen===false){
            setShowMembersList(workspaceCreateModalOpen);
            handleWorkspaceCreation();
        }
    }, [workspaceCreateModalOpen]);

    const handleWorkspaceCreation = () => {

        const newWorkspace = {
            name: workspaceName,
            members: currentMemberData,
            created_by: loggedUserId
        };
        if(newWorkspace.name!==''){
            dispatch(createCompany(newWorkspace));
        }
        setWorkspaceName('');
        setCurrentMemberData([]);
    };
    const handleWorkspaceAdd = () => {
        openWorkspaceCreateModal();
        setWorkspaceName('');
        setCurrentMemberData([]);
        setAddedMembers([]);
    };
    return (
        <>
            <WorkspaceCreateButton onClick={handleWorkspaceAdd} />
            {workspaceCreateModalOpen &&
                <Modal.Root
                    opened={workspaceCreateModalOpen}
                    onClose={closeWorkspaceCreateModal}
                    centered
                    size={475}
                >
                    <Modal.Overlay />
                    <Modal.Content radius={15}>
                        <Modal.Header px={20} py={10}>
                            <Title order={5}>Create Workspace</Title>
                            <Modal.CloseButton />
                        </Modal.Header>
                        <Modal.Body>
                            <div className="create-form-box">
                                <div className="mb-4">
                                    <TextInput
                                        placeholder="Enter your Workspace name"
                                        radius="md"
                                        size="md"
                                        styles={{
                                            borderColor: "gray.3",
                                            backgroundColor: "white",
                                            focus: {
                                                borderColor: "blue.5",
                                            },
                                        }}
                                        onChange={(e) => setWorkspaceName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <div
                                        className={`current-member-lists flex flex-wrap gap-4 ${currentMemberData.length > 0 ? 'mb-4' : ''}`}>
                                        {currentMemberData.map((member) => (
                                            <div key={member.id}
                                                 className="single-current-member flex items-center justify-between gap-2">
                                                {/*<Avatar src={member.avatar} size={22} radius={22}/>*/}
                                                <UserAvatarSingle user={member} size={22} />
                                                <Text size="sm" fw={100} c="#202020">{member.name}</Text>
                                                <button onClick={() => handleDeleteCurrentMember(member.id)}>
                                                    <IconX size={16} color="#202020"/>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="relative mb-4">
                                    <TextInput
                                        leftSection={<IconSearch size={16}/>}
                                        placeholder="Search members..."
                                        value={searchValue}
                                        onChange={handleSearchInputChange}
                                        onFocus={handleSearchInputFocus}
                                        radius="md"
                                        size="md"
                                        styles={{
                                            borderColor: "gray.3",
                                            backgroundColor: "white",
                                            paddingLeft: "40px", // Set left padding
                                            focus: {
                                                borderColor: "blue.5",
                                            },
                                        }}
                                    />
                                </div>
                                {showMembersList && (
                                    <div
                                        className="members-lists mt-3 border boder-solid border-[#6191A4] rounded-md p-3 pb-0">
                                        <Text size="sm" fw={700} c="#202020">{filteredMembers && filteredMembers.length} people
                                            available</Text>
                                        <div className="members-lists mt-3">
                                            <ScrollArea h={250} scrollbarSize={4} scrollHideDelay={500}>
                                                {filteredMembers && filteredMembers.length > 0 && filteredMembers.map((member) => (
                                                    <div key={member.id}
                                                         className="ml-single flex items-center border-b border-solid border-[#C2D4DC] py-3 justify-between">
                                                        <UserAvatarSingle user={member} size={32} />
                                                        <div className="mls-ne ml-2 w-full">
                                                            <Text size="sm" fw={700} c="#202020">{member.name}</Text>
                                                            <Text size="sm" fw={100} c="#202020">{member.email}</Text>
                                                        </div>
                                                        <Button
                                                            radius="sm"
                                                            height={24}
                                                            style={{
                                                                backgroundColor: addedMembers.includes(member.id) ? "#fff" : "#39758D", // Conditional background color
                                                                color: addedMembers.includes(member.id) ? "#A85923" : "#fff",
                                                                fontWeight: 400,
                                                                padding: "5px 0px",
                                                                width: "100px",
                                                            }}
                                                            disabled={addedMembers.includes(member.id)}
                                                            size="sm"
                                                            marginLeft={2}
                                                            onClick={() => handleButtonClick(member)}
                                                        >
                                                            {addedMembers.includes(member.id) ? 'Added' : 'Add'}
                                                        </Button>

                                                    </div>
                                                ))}

                                            </ScrollArea>
                                        </div>
                                    </div>
                                )}


                            </div>
                        </Modal.Body>
                    </Modal.Content>
                </Modal.Root>
            }

            </>
    );
}

export default CreateWorkspaceModal;
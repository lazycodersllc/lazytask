import React, {useState, useEffect, Fragment} from 'react';
import {Avatar, Button, Modal, ScrollArea, Text, TextInput, Title} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import WorkspaceEditButton from '../../Button/WorkspaceEditButton';
import { IconSearch } from '@tabler/icons-react';
import { IconX } from '@tabler/icons-react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchAllMembers} from "../../../../store/auth/userSlice";
import InlineEditForm from "../../../ui/InlineEditForm";
import {editCompany, fetchCompany, removeSuccessMessage} from "../../../Settings/store/companySlice";
import UserAvatarSingle from "../../../ui/UserAvatarSingle";
import {modals} from "@mantine/modals";

const EditWorkspaceModal = ({ workspaceData }) => {
    const dispatch = useDispatch();
    const {allMembers} = useSelector((state) => state.auth.user);
    const {loggedUserId} = useSelector((state) => state.auth.user)

    useEffect(() => {
        dispatch(fetchAllMembers())
    }, [dispatch]);

    const [isLoading, setIsLoading] = useState(false);
    const {company, success} = useSelector((state) => state.settings.company);


    const [workspaceEditModalOpen, { open: openWorkspaceEditModal, close: closeWorkspaceEditModal }] = useDisclosure(false);
    const [showMembersList, setShowMembersList] = useState(false);
    const [editedName, setEditedName] = useState(workspaceData.name); // State to hold edited name

    const editWorkspaceNameHandler = (props) => {
        const {id, input, fieldName} = props
        if(id === undefined || input === undefined || fieldName === undefined){
            return;
        }
        setIsLoading(true)
        dispatch(editCompany({id: id, data: {[fieldName]: input, 'updated_by': loggedUserId}}))
        setEditedName(input)
        setIsLoading(false)
    }
 
    const [currentMemberData, setCurrentMemberData] = useState(workspaceData.members);

    const handleDeleteCurrentMember = (id) => {
        setIsLoading(true);
        console.log(`Member with ID ${id} deleted`);
        console.log(company.projects);
        const isExistingMemberCheck = company.projects.filter(project =>
            project.members.some(member => member.id === id.toString())
        );
        if(isExistingMemberCheck.length > 0){
            setIsLoading(false);
            modals.open({
                withCloseButton: false,
                centered: true,
                children: (
                    <Fragment>
                        { isExistingMemberCheck && isExistingMemberCheck.length > 0 &&
                            <Text size="sm">
                                This member has assigned {isExistingMemberCheck.length} projects. Please delete all assigned member before deleting this workspace.
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
            // Remove the member with the specified ID from currentMemberData
            const updatedCurrentMembers = currentMemberData.filter((member) => member.id !== id);
            setCurrentMemberData(updatedCurrentMembers);

            // Remove the member's ID from the addedMembers array
            setAddedMembers((prevMembers) => prevMembers.filter((memberId) => memberId !== id));
            dispatch(editCompany({id: workspaceData.id, data: {'members': updatedCurrentMembers, 'updated_by': loggedUserId}}))
            setIsLoading(false);
        }

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



      const [addedMembers, setAddedMembers] = useState(workspaceData.members.map((member) => member.id));


      const handleButtonClick = (clickedMember) => {
        // Check if the member is not already in the current list
        if (!addedMembers.includes(clickedMember.id)) {

            const updatedClickedMember = { ...clickedMember, status: 'Added' };
            const updatedMembers = [...currentMemberData, updatedClickedMember];
            setCurrentMemberData((prevData) => {
                // const newData = [...prevData, updatedClickedMember];
                // console.log(newData)
                return [...prevData, updatedClickedMember];
            });
            // Update the state to indicate that the member has been added
            setAddedMembers((prevMembers) => [...prevMembers, clickedMember.id]);
            setIsLoading(true);
            dispatch(editCompany({id: workspaceData.id, data: {'members': updatedMembers, 'updated_by': loggedUserId}}))
            setIsLoading(false);

        }

    };


    useEffect(() => {
        if(workspaceEditModalOpen===false){
            setShowMembersList(workspaceEditModalOpen);
        }
        if(workspaceEditModalOpen===true){
            dispatch(fetchCompany(workspaceData.id))
        }
    }, [workspaceEditModalOpen]);

    useEffect(() => {
        setTimeout(() => {
            dispatch(removeSuccessMessage());
        }, 500); // Clear notification after 3 seconds

    }, [isLoading]);

    return (
        <Fragment>
            <WorkspaceEditButton onClick={openWorkspaceEditModal} />
            {workspaceEditModalOpen &&
                <Modal.Root
                    opened={workspaceEditModalOpen}
                    onClose={closeWorkspaceEditModal}
                    centered
                    size={475}
                >
                    <Modal.Overlay />
                    <Modal.Content radius={15}>
                        <Modal.Header px={20} py={10}>
                            <Title order={5}>Edit Workspace</Title>
                            <Modal.CloseButton />
                        </Modal.Header>
                        <Modal.Body>
                            <div className="edit-form-box">
                                <div className="mb-4">
                                    <InlineEditForm editHandler={(props) => {
                                        props['id'] = workspaceData.id;
                                        props['fieldName'] = 'name'
                                        editWorkspaceNameHandler(props)
                                    }} value={editedName}/>
                                </div>
                                <div>
                                    <div
                                        className={`current-member-lists flex flex-wrap gap-4 ${currentMemberData.length > 0 ? 'mb-4' : ''}`}>
                                        {currentMemberData && currentMemberData.length >0 && currentMemberData.map((member) => (
                                            <div key={member.id}
                                                 className="single-current-member flex items-center justify-between gap-2">
                                                {/*<Avatar src={member.avatar} size={22} radius={22}/>*/}
                                                <UserAvatarSingle user={member} size={22} stroke={1.25} />
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
                                        placeholder="Quick search member"
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
                                                        {/*<Avatar src={member.avatar} size={32} radius={32}/>*/}
                                                        <UserAvatarSingle user={member} size={32} stroke={1.25} />
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

        </Fragment>
    );
}

export default EditWorkspaceModal;
import React, {useCallback, useEffect, useState} from 'react';
import {Avatar, Button, Modal, ScrollArea, Select, Text, TextInput, Title} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import ProjectCreateButton from '../../Button/ProjectCreateButton';
import { IconSearch } from '@tabler/icons-react';
import { IconX } from '@tabler/icons-react';
import ProjectCreateButtonForWorkspace from '../../Button/ProjectCreateButtonForWorkspace'; 
import { useSelector, useDispatch } from 'react-redux';
import {createProject} from "../../../Settings/store/projectSlice";
import {fetchAllCompanies, fetchCompany} from "../../../Settings/store/companySlice";
import UserAvatarSingle from "../../../ui/UserAvatarSingle";

const CreateProjectModal = ({ buttonStyle, companyId, companyName, members }) => {
    const dispatch = useDispatch();
    const {loggedUserId} = useSelector((state) => state.auth.user);
    const [projectCreateModalOpen, { open: openProjectCreateModal, close: closeProjectCreateModal }] = useDisclosure(false);
    const [showMembersList, setShowMembersList] = useState(false);

    const [projectName, setProjectName] = useState('');
    const [workspaceId, setWorkspaceId] = useState(companyId?companyId:null);
    const [workspaceMembers, setWorkspaceMembers] = useState(members && members.length>0?members:[]);

 
    const [currentMemberData, setCurrentMemberData] = useState([]);
    
    const handleDeleteCurrentMember = (id) => {
        // Remove the member with the specified ID from currentMemberData
        const updatedCurrentMembers = currentMemberData.filter((member) => member.id !== id);
        setCurrentMemberData(updatedCurrentMembers);
    
        // Remove the member's ID from the addedMembers array
        setAddedMembers((prevMembers) => prevMembers.filter((memberId) => memberId !== id));
    };
    const handleSearchInputFocus = (e) => {
        setShowMembersList(true);
    };
    const [searchValue, setSearchValue] = useState('');

    const handleSearchInputChange = (e) => {
        const inputValue = e.target.value;
        setSearchValue(inputValue);
        setShowMembersList(true);
    };

    var filteredMembers = members && members.length>0 && members.filter(
        (member) =>
          member.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          member.email.toLowerCase().includes(searchValue.toLowerCase())
      );

      const [addedMembers, setAddedMembers] = useState([]);


      const handleButtonClick = (clickedMember) => {
        if (!addedMembers.includes(clickedMember.id)) {
            // Add the clickedMember to the currentMemberData state with updated status
            const updatedClickedMember = { ...clickedMember, status: 'Added' };
            setCurrentMemberData((prevData) => [...prevData, updatedClickedMember]);
            // Update the state to indicate that the member has been added
            setAddedMembers((prevMembers) => [...prevMembers, clickedMember.id]);
        }
    };

    useEffect(() => {
        if(projectCreateModalOpen===false){
            setShowMembersList(projectCreateModalOpen);
            handleProjectCreation();
        }
    }, [projectCreateModalOpen]);

    const handleProjectCreation = () => {
        const newProject = {
            name: projectName, // Use projectName state here
            members: currentMemberData,
            company_id: workspaceId,
            created_by: loggedUserId,
        };
        if(newProject.name!==''){
            dispatch(createProject(newProject));
        }
        setProjectName('');
        setCurrentMemberData([]);
        setAddedMembers([]);
    };

    const handleProjectAdd = () => {
        handleProjectCreation();
        openProjectCreateModal();
        setCurrentMemberData([]);
        setAddedMembers([]);
    };
    useEffect(() => {
        dispatch(fetchAllCompanies());
    }, []);
    const {companies, company} = useSelector((state) => state.settings.company);

    const onCompanyChange = useCallback(
        (e) => {
            if(e.value){
                dispatch(fetchCompany(e.value));
                setWorkspaceId(e.value);
                setCurrentMemberData([]);
            }else {
                setWorkspaceId(null);
            }
        },
        [dispatch],
    );
    if(company?.members?.length > 0){
         filteredMembers = company && company.members && company.members.length>0 && company.members.filter(
            (member) =>
                member.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                member.email.toLowerCase().includes(searchValue.toLowerCase())
        );
    }
    return (
        <>
            {buttonStyle === 'a' ? (
                <ProjectCreateButton onClick={handleProjectAdd} />
            ) : buttonStyle === 'b' ? (
                <ProjectCreateButtonForWorkspace onClick={handleProjectAdd} />
            ) : null}
            { projectCreateModalOpen &&
                <Modal.Root
                    opened={projectCreateModalOpen}
                    onClose={closeProjectCreateModal}
                    centered
                    size={475}
                >
                    <Modal.Overlay />
                    <Modal.Content radius={15}>
                        <Modal.Header px={20} py={10}>
                            <Title order={5}>Create Project</Title>
                            <Modal.CloseButton />
                        </Modal.Header>
                        <Modal.Body>
                            <div className="create-form-box">
                                <div className="mb-4">
                                    {companyName ? <Text
                                            style={{border: '1px solid #A4C0CB', padding: '7px 15px', borderRadius: '10px'}}
                                            title={companyName} lineClamp={1} size="lg" fw={700}
                                            c="#202020">{companyName}</Text>
                                        :
                                        <Select
                                            size="md"
                                            placeholder="Select Workspace"
                                            data={companies && companies.length > 0 && companies.map((company) => ({
                                                value: company.id,
                                                label: company.name
                                            }))}
                                            // defaultValue="React"
                                            allowDeselect
                                            onChange={(e, option) => {
                                                onCompanyChange(option);
                                                /*if(form.getInputProps('roles').onChange)
                                                    form.getInputProps('roles').onChange((option) => option);*/
                                            }}
                                        />
                                    }
                                </div>
                                <div className="mb-4">
                                    <TextInput
                                        placeholder="Enter your project name"
                                        radius="md"
                                        size="md"
                                        styles={{
                                            borderColor: "gray.3",
                                            backgroundColor: "white",
                                            focus: {
                                                borderColor: "blue.5",
                                            },
                                        }}
                                        onChange={(e) => setProjectName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <div
                                        className={`current-member-lists flex flex-wrap gap-4 ${currentMemberData.length > 0 ? 'mb-4' : ''}`}>
                                        {currentMemberData.map((member) => (
                                            <div key={member.id}
                                                 className="single-current-member flex items-center justify-between gap-2">
                                                <UserAvatarSingle user={member} size={22} />
                                                {/*<Avatar src={member.avatar} size={22} radius={22}/>*/}
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
                                        <Text size="sm" fw={700}
                                              c="#202020">{filteredMembers && filteredMembers.length > 0 && filteredMembers.length} people
                                            available</Text>
                                        <div className="members-lists mt-3">
                                            <ScrollArea h={250} scrollbarSize={4} scrollHideDelay={500}>
                                                {filteredMembers && filteredMembers.length > 0 && filteredMembers.map((member) => (
                                                    <div key={member.id}
                                                         className="ml-single flex items-center border-b border-solid border-[#C2D4DC] py-3 justify-between">
                                                        {/*<Avatar src={member.avatar} size={32} radius={32}/>*/}
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

export default CreateProjectModal;
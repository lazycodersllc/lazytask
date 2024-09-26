import React, {useEffect} from 'react';
import {Avatar, Button, Grid, Modal, ScrollArea, Text, TextInput, Title} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';  
import CreateWorkspaceModal from './CreateWorkspaceModal';
import WorkspaceCard from "../../WorkspaceCard";
import {useDispatch, useSelector} from "react-redux";
import {fetchAllCompanies} from "../../../Settings/store/companySlice";
import {IconSearch, IconX} from "@tabler/icons-react";

const WorkspaceModal = () => { 
    const [workspaceModalOpen, { open: openWorkspaceModal, close: closeWorkspaceModal }] = useDisclosure(false);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchAllCompanies());
    }, [dispatch]);

    const {companies} = useSelector((state) => state.settings.company);

    return (
        <>
            <button onClick={openWorkspaceModal} className="w-full border border-solid border-black text-black bg-white rounded-md p-1 mb-4 hover:bg-[#39758D] hover:text-white">
                Manage Workspace
            </button>
            { workspaceModalOpen &&
                <Modal.Root
                    opened={workspaceModalOpen}
                    onClose={closeWorkspaceModal}
                    centered
                    size={826}
                    padding="15px"
                >
                    <Modal.Overlay />
                    <Modal.Content radius={15}>
                        <Modal.Header px={30} py={10}>
                            <Title order={5}>Workspace</Title>
                            <Modal.CloseButton />
                        </Modal.Header>
                        <Modal.Body>
                            <ScrollArea className="h-full px-4 pb-3">
                                <Grid gutter={{base: 20}} overflow="hidden" align="stretch" spacing="sm" verticalSpacing="sm">
                                    <Grid.Col  span={{ base: 12, xs:6, sm:4, md: 4, lg: 4 }}>
                                        <CreateWorkspaceModal />
                                    </Grid.Col>
                                    {Array.isArray(companies) &&
                                        companies && companies.length>0 && companies.map((workspace, index) => (
                                            <Grid.Col key={index} span={{ base: 12, xs:6, sm:4, md: 4, lg: 4 }}>
                                                <WorkspaceCard key={index} {...workspace} />
                                            </Grid.Col>
                                        ))
                                    }
                                </Grid>
                            </ScrollArea>
                        </Modal.Body>
                    </Modal.Content>
                </Modal.Root>
            }

        </>
    );
}

export default WorkspaceModal;

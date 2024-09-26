import React, {useState, useEffect, Fragment, useRef} from 'react';
import {
    ScrollArea,
    Table, Text, Title, Card, Group
} from '@mantine/core';
import { useSelector, useDispatch } from 'react-redux';
import {BarChart} from "@mantine/charts";
import {IconGripVertical} from "@tabler/icons-react";
import {NavLink} from "react-router-dom";

const ProjectSummery = () => {
    const {userProjects} = useSelector((state) => state.settings.myTask);
    const rows = userProjects && userProjects.length > 0 && userProjects.map((element) => (
        <Table.Tr key={element.id} title={element.name}>
            <Table.Td title={element.name}>
                <Text fz="sm" title={element.name} lineClamp={1}>
                    <NavLink to={`/project/task/list/${element.id}`}>
                        {element.name}
                    </NavLink>
                </Text>
            </Table.Td>
            <Table.Td>{element.ACTIVE}</Table.Td>
            <Table.Td>{element.COMPLETED}</Table.Td>
            <Table.Td>{ parseInt(element.ACTIVE ? element.ACTIVE:0) + parseInt(element.COMPLETED ? element.COMPLETED:0) }</Table.Td>
        </Table.Tr>
    ));
    return (
        <Card withBorder shadow="sm" radius="md">
            <Card.Section withBorder inheritPadding py="xs" className="bg-[#EBF1F4]">
                <Group>
                    {/*<IconGripVertical size="20" />*/}
                    <Title order={6}>Project Summery</Title>
                </Group>
            </Card.Section>

            <Card.Section px="xs" pb="xs">
                <ScrollArea className="relative h-[250px] pb-[2px]" scrollbarSize={4}>
                    <Table>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Name</Table.Th>
                                <Table.Th>Active</Table.Th>
                                <Table.Th title="Completed">
                                    Comp.
                                </Table.Th>
                                <Table.Th>Total</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{rows}</Table.Tbody>
                    </Table>
                </ScrollArea>
            </Card.Section>
        </Card>

  );
};

export default ProjectSummery;

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
    useMantineTheme, Card, Group, Table
} from '@mantine/core';
import { useSelector, useDispatch } from 'react-redux';
import {createQuickTask} from "../Settings/store/quickTaskSlice";
import dayjs from "dayjs";
import {IconCalendar, IconDeviceFloppy, IconEdit} from "@tabler/icons-react";
import {Link} from "react-router-dom";

const TaskListContent = ({ tasks, header }) => {

    return (
        <Card withBorder shadow="sm" radius="md">
            <Card.Section withBorder inheritPadding py="xs" className="bg-[#EBF1F4]">
                <Group>
                    {/*<IconGripVertical size="20" />*/}
                    {/*<IconCalendar size={20} />*/}
                    <Title order={6}>{header}</Title>
                </Group>
            </Card.Section>

            <Card.Section px="xs">
                <ScrollArea className="relative h-[250px] pb-[2px]" scrollbarSize={4}>
                    <div className="">
                        {tasks && tasks.length > 0 && tasks.map((task, index) => (
                            <div className="border-b px-2 py-2">
                                <div className="content">
                                    <Text fz="sm">{task.name}</Text>
                                    {/*<h4 className="text-lg">{task.name}</h4>*/}
                                </div>
                            </div>
                        ))
                        }

                    </div>
                    {tasks && tasks.length > 0 &&
                        <div className="absolute bottom-2 right-0 bg-white">
                            <Link to={`/my-task`}>
                                <Button color="#ED7D31" radius="xl" size="compact-xs">
                                    More...
                                </Button>
                            </Link>
                        </div>
                    }
                </ScrollArea>
            </Card.Section>
        </Card>
    );
};

export default TaskListContent;

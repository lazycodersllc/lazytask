import React, {useState, useEffect, Fragment, useRef} from 'react';
import {
    ActionIcon,
    Button, Card, Group,
    Input,
    Menu,
    rem,
    ScrollArea, Table,
    Textarea,
    TextInput,
    Title,
    useMantineTheme
} from '@mantine/core';
import { useSelector, useDispatch } from 'react-redux';
import {BarChart} from "@mantine/charts";

const DashboardBarChart = ({slug, header}) => {
    const {userProjects} = useSelector((state) => state.settings.myTask);
    return (
        <Card withBorder shadow="sm" radius="md">
            <Card.Section withBorder inheritPadding py="xs" className="bg-[#EBF1F4]">
                <Group>
                    {/*<IconGripVertical size="20" />*/}
                    <Title order={6}>Project Summery Chart</Title>
                </Group>
            </Card.Section>

            <Card.Section px="xs" pt="xs">
                <BarChart
                    h={250}
                    data={userProjects}
                    dataKey="name"
                    type="stacked"
                    withLegend
                    legendProps={{ verticalAlign: 'bottom', height: 50 }}
                    series={[
                        // { name: 'TOTAL', color: 'violet.6' },
                        { name: 'ACTIVE', color: 'yellow.6' },
                        { name: 'COMPLETED', color: 'green.6' },
                    ]}
                />
            </Card.Section>
        </Card>
  );
};

export default DashboardBarChart;

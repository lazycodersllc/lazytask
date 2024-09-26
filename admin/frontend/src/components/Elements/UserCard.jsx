import React from 'react';
import {Avatar, Text, Paper, Menu, rem, Title, Flex} from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";
import {hasPermission} from "../ui/permissions";
import acronym from "../ui/acronym";
import useTwColorByName from "../ui/useTwColorByName";
import UserAvatarSingle from "../ui/UserAvatarSingle";

const UserCard = (props) => {
    const {
        id,
        avatar,
        name,
        email,
        phoneNumber,
        // onEditClick = () => console.log('Edit clicked'), // Default edit functionality
        // onDeleteClick = () => console.log('Delete clicked'), // Default delete functionality
    } = props;
    const { loggedInUser } = useSelector((state) => state.auth.session)
    const bgColor = useTwColorByName();
    const font_color = bgColor(name)["font-color"];
    const bg_color = avatar ? 'transparent' : bgColor(name)["bg-color"];

    return (
        <Paper className="min-h-[193px]" radius="md" withBorder p="15px" bg="var(--mantine-color-body)" style={{ border: '1px solid #A4C0CB', width: '100%', height:'100%' }}>

            <Flex justify="center" align="center" style={{ height: '50px' }}>
                <UserAvatarSingle user={{name, avatar}} size={50} stroke={1.25} />
            </Flex>
            <Title order={5} title={name} lineClamp={1} ta="center" mt="sm" c="#39758D">
                {name}
            </Title>

            <Text title={email} lineClamp={1} ta="center" fz="sm" fw={500} c="#202020">
                {email}
            </Text>

            <Text ta="center" c="#4D4D4D" fz="sm">
                {phoneNumber}
            </Text>

            {hasPermission(loggedInUser && loggedInUser.llc_permissions, ['superadmin', 'admin', 'director']) &&
                <div className="flex justify-center gap-2.5 mt-3">
                    <button className="text-center rounded-md border border-solid border-orange-500 px-2 py-1"
                            // onClick={onEditClick}
                    >
                        <Link to={`/profile/${id}`}>
                            <IconEdit
                                size={20}
                                stroke={1.25}
                                color={"#ED7D31"}
                            />
                        </Link>
                    </button>
                    <button className="text-center"
                            // onClick={onDeleteClick}
                    >
                        <IconTrash
                            size={20}
                            stroke={1.25}
                            color="red"
                        />
                    </button>
                </div>
            }
        </Paper>
    );
}

export default UserCard;

import React, {Fragment} from 'react';
import { Avatar, Text, Tooltip } from '@mantine/core'; 
import {IconPlus, IconUserCircle, IconUsers} from '@tabler/icons-react';
import acronym from "./acronym";
import useTwColorByName from "./useTwColorByName";
const UsersAvatarGroup = (props) => {
    const {
        users,
        sliceStart = 0,
        withArrow = false,
        size=40,
        maxCount
    } = props;
    const bgColor = useTwColorByName();
    return (
        <>
            <Tooltip.Group openDelay={300} closeDelay={100}>
                <Avatar.Group spacing="sm">
                    {users && users.length>0 ? (
                            <Fragment>
                            {users.slice(sliceStart, sliceStart + maxCount).map((user, index) => (
                                <Tooltip key={index} label={user.name} withArrow={withArrow}>
                                    <Avatar
                                        color={ `${bgColor(user.name)["font-color"]}` }
                                        bg={ `${bgColor(user.name)["bg-color"]}` }
                                        size={size} mr="-2"
                                        src={user.avatar?user.avatar:null}

                                    >
                                        { user.avatar ? '' : <Text style={{ "lineHeight":"14px"}} size="xs">{acronym(user.name)}</Text> }
                                        {/*<Text size="xs">{user.avatar?user.avatar:acronym(user.name)}</Text>*/}
                                    </Avatar>
                                </Tooltip>
                            ))}
                            {users.length > sliceStart + maxCount && (
                                <Tooltip
                                    withArrow
                                    label={
                                        <>
                                            {users.slice(sliceStart + maxCount).map((user, index) => (
                                                <div key={index}>{user.name}</div>
                                            ))}
                                        </>
                                    }
                                >
                                    <Avatar size={size} bg="#ED7D31" color="#fff">
                                        +{users.length - sliceStart - maxCount}
                                    </Avatar>
                                </Tooltip>
                            )}
                        </Fragment>
                        )
                        :
                        (
                            ''
                            // <IconUserCircle color="#4d4d4d" size={size} />
                        )
                    }

                </Avatar.Group>
            </Tooltip.Group>
        </>
        
    );
}

export default UsersAvatarGroup;
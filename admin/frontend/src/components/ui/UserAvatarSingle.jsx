import React from 'react';
import { Avatar, Text, Tooltip } from '@mantine/core'; 
import acronym from "./acronym";
import useTwColorByName from "./useTwColorByName";
const UserAvatarSingle = (props) => {
    const {
        user,
        withArrow = false,
        size=40,
        stroke=1.25,
        className='',
    } = props;

    const bgColor = useTwColorByName();
    const font_color = user && user.name ? bgColor(user.name)["font-color"] : '';
    const bg_color = user && user.avatar ? 'transparent' : (user && user.name ? bgColor(user.name)["bg-color"] : '');
    return (
        <Tooltip label={user && user.name} withArrow={withArrow}>
            <Avatar
                className={className}
                color={ font_color }
                bg={ bg_color }
                size={size} mr="-2"
                src={user && user.avatar?user.avatar:null}
                stroke={stroke}
            >
                { user && user.avatar ? '' : <Text style={{ "lineHeight":"14px"}} size="xs">{ user && user.name ? acronym(user.name) : "" }</Text> }
            </Avatar>
        </Tooltip>
        
    );
}

export default UserAvatarSingle;
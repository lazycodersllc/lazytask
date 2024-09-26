import React from 'react';
import { Text } from '@mantine/core'; 
import { IconPlus } from '@tabler/icons-react';
import {Link} from "react-router-dom";
const ProfileCreateButton = () => {
    return (
        <button
            className="relative w-full h-full min-h-[193px] rounded-lg border border-dashed border-blue-500 bg-white flex-row items-center justify-center align-items-center text-center"
        >
            <Link className="h-full w-full flex flex-col items-center justify-center align-items-center text-center" to={`/profile`}>
            <div className="text-center rounded-md border border-solid border-[#39758D] px-2 py-1 inline-block">
                <IconPlus size={20} color="#39758D"/>
            </div>
            <Text ta="center" fz="md" fw={500} c="#39758D" mt="12">
                Create new User
            </Text>
            </Link>
        </button>
    );
}

export default ProfileCreateButton;

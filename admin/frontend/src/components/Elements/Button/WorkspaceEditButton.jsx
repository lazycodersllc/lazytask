import { IconEdit } from '@tabler/icons-react';
import React from 'react'; 
const WorkspaceEditButton = ({ onClick }) => {  
    return (
        <>
           <button className="text-center rounded-md border border-solid border-orange-500 px-2 py-1" onClick={onClick}>
                <IconEdit stroke={1.25} size={20} color="#ED7D31" />
            </button>
        </>
        
    );
}

export default WorkspaceEditButton;
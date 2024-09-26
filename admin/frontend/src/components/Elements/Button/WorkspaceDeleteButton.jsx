import { IconTrash } from '@tabler/icons-react';
import React from 'react'; 
const WorkspaceDeleteButton = ({ onClick }) => {  
    return (
        <> 
            <button className="text-center" onClick={onClick}>
                <IconTrash
                    size={20}
                    color="red"
                    stroke={1.25}
                />
            </button>
        </>
        
    );
}

export default WorkspaceDeleteButton;
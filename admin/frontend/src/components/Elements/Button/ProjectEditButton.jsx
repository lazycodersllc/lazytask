import { IconEdit } from '@tabler/icons-react';
import React from 'react'; 
const ProjectEditButton = ({ onClick }) => {  
    return (
        <>
           <button className="text-center rounded-md border border-solid border-orange-500 px-2 py-1" onClick={onClick}>
                    <IconEdit size={20} color="#ED7D31" stroke={1.25} />
            </button>
        </>
        
    );
}

export default ProjectEditButton;
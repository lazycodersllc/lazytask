import React from 'react';
import { IconPlus } from '@tabler/icons-react';
const ProjectCreateButtonForWorkspace = ({ onClick }) => {  
    return (
        <> 
            <button className="text-center bg-orange-500 rounded-md border border-solid border-orange-500 px-2 py-1"  onClick={onClick}>
                <IconPlus size={20} color="#fff" />
            </button>
        </>
        
    );
}

export default ProjectCreateButtonForWorkspace;
import React from 'react';
import { Accordion } from '@mantine/core';   
import WorkspaceModal from './Modal/Workspace/WorkspaceModal';

const groceries = [];
const WorkspaceLists = () => {  
    const items = groceries && groceries.length > 0 && groceries.map((item) => (
        <Accordion.Item key={item.value} value={item.value}>
          <Accordion.Control className="!bg-white font-bold border-solid !border-[#545454] !rounded-t-md">
            {item.value}
        </Accordion.Control>
          <Accordion.Panel>
            <ul>
            {item.description.map((project, index) => (
                <li key={index}>
                    <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-[#39758D] hover:underline">
                    {project.name}
                    </a>
                </li>
            ))}
            </ul>
        </Accordion.Panel>
        </Accordion.Item>
      ));
    return (
        <> 
            <WorkspaceModal />
            <Accordion variant="separated" defaultValue="Apples">
                {items}
            </Accordion>
 
        </>
        
    );
}

export default WorkspaceLists;

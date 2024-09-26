import React, { useState, useEffect } from 'react';
import { ReactSortable } from 'react-sortablejs';
import ProjectContent from './ProjectContent';
import { IconGripVertical } from '@tabler/icons-react';
import { setTask } from '../../../../reducers/taskSlice';
import { useSelector, useDispatch } from 'react-redux';
import taskJson from '../../../Data/tasks.json';
import ContentEditable from 'react-contenteditable';
import AddTaskDrawer from './AddTaskDrawer';

const ProjectBoard = () => {
  const tasks = useSelector((state) => state.task); // Access Project data from Redux store
  const dispatch = useDispatch();

  useEffect(() => {
    // Dispatch an action to set initial Project data (if needed)
    dispatch(setTask(taskJson));
    // dispatch(setTask(Object.values(taskJson)));

  }, [dispatch]);

  const [accordionItems, setAccordionItems] = useState([]);
  useEffect(() => {
    if (tasks.taskListSectionsName) {
      const transformedItems = Object.entries(tasks.taskListSectionsName).map(([key, value]) => ({
        value: key,
        title: value.name,
      }));
      setAccordionItems(transformedItems);
    }
  }, [tasks]);

  const [hoveredItem, setHoveredItem] = useState(null);

  const handleTitleChange = (e, itemValue) => {
    const newAccordionItems = accordionItems.map((item) => {
      if (item.value === itemValue) {
        return { ...item, title: e.target.value };
      }
      return item;
    });
    setAccordionItems(newAccordionItems);
  };

  const handleAddSection = () => {
    const newItemValue = `project-${accordionItems.length + 1}`;
    const newItem = {
      value: newItemValue,
      title: `Project ${accordionItems.length + 1}`,
    };
    setAccordionItems([...accordionItems, newItem]);
  };

  return (
    <>

      <div className="project-cards flex flex-wrap gap-4">
          <div className="sections-wrapper" >
            <ReactSortable
              list={accordionItems}
              setList={setAccordionItems}
              className="accordion-sortable flex flex-wrap gap-4 w-auto"
              animation={150}
              style={{ transition: 'background-color 0.3s ease' }}
            >
              {accordionItems.map((item) => ( 
                <div key={item.value} className="projects-card-content border border-solid border-[#dddddd] rounded-t-md w-[310px]"> 
                  <div className="project-section-title p-3 flex items-center justify-between bg-[#EBF1F4]"> 
                    <div className="flex gap-1 items-center">
                      <IconGripVertical size="18" className="mr-1 cursor-move" /> 
                      <ContentEditable 
                        html={item.title} 
                        onChange={(e) => handleTitleChange(e, item.value)} 
                        className=" text-[#4d4d4d] font-bold text-[16px]" 
                        /> 
                    </div>
                    <AddTaskDrawer /> 
                  </div> 
                  <div className="flex items-center"> 
                    <ProjectContent view="cardView" taskSection={item.value} /> 
                  </div> 
                </div>
              ))}
            </ReactSortable>
            
          </div>
          <div className="w-[280px]">
              <button
                className="rounded-md border border-dashed border-1 border-[#ED7D31] px-4 py-2 mt-4 w-full coursor-pointer"
                onClick={handleAddSection}
                >
                <span className="text-sm font-medium text-[#ED7D31]">+ Add Section</span>
              </button>
          </div>
      </div>
 
      
    </>
  );
};

export default ProjectBoard;




      
import React, {useState, useEffect, Fragment, useRef} from 'react';
import {Accordion, Button, Checkbox, Flex, Group, List, Popover, Text, Title, useMantineTheme} from '@mantine/core';
import {
  IconAngle, IconCheck,
  IconChevronDown,
  IconDotsVertical,
  IconGripVertical,
  IconInputCheck,
  IconPlus,
  IconTrash, IconX
} from '@tabler/icons-react';
import { useSelector, useDispatch } from 'react-redux';
import {
  createTaskSection, deleteTaskSection,
  editSectionSortOrder, editTaskSection, editTaskSortOrder,
  fetchTasksByProject, markIsCompletedTaskSection, updateChildColumns, updateColumns,
  updateOrdered
} from "../../../Settings/store/taskSlice";
import TaskSectionName from "./Task/TaskSectionName";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {reorder, reorderQuoteMap} from "./utils";
import TaskListContent from "./TaskListContent";
import {modals} from "@mantine/modals";

import {hasPermission} from "../../../ui/permissions";
import {notifications} from "@mantine/notifications";

const TaskList = () => {
  const theme = useMantineTheme();
  // const tasks = useSelector(state => state.task);
  const dispatch = useDispatch();
  const {loggedUserId} = useSelector((state) => state.auth.user)
  const {loggedInUser} = useSelector((state) => state.auth.session)

  const {projectInfo, tasks, columns, ordered, taskListSections, childColumns} = useSelector((state) => state.settings.task);
  const contentEditableRef = useRef('');


  const [expandedItems, setExpandedItems] = useState([]); // Initialize with an empty array
// console.log(expandedItems, ordered)
  const [accordionItems, setAccordionItems] = useState([]);
  useEffect(() => {
    if (tasks && taskListSections) {
      const transformedItems = Object.entries(taskListSections).map(([key, value]) => ({
        value: key,
        title: value.name,
      })
      );
      setAccordionItems(transformedItems);
      // Set all accordion items as expanded
      setExpandedItems(transformedItems.map(item => item.value));
    }

  }, [ordered]);

  const [hoveredItem, setHoveredItem] = useState(null);

  const handleToggle = (itemValue) => {
    if (!expandedItems.includes(itemValue)) {
      setExpandedItems([...expandedItems, itemValue]);
    } else {
      setExpandedItems(expandedItems.filter((value) => value !== itemValue));
    }
  };

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
    const newItemValue = `untitle-section-${accordionItems.length + 1}`;
    const newItem = {
      value: newItemValue,
      title: `Type section name here`,
    };
    setAccordionItems([...accordionItems, newItem]);
    setExpandedItems([...expandedItems, newItemValue]);

   const newSection = {
     name: 'Type section name here',
     project_id: projectInfo.id,
     sort_order: ordered.length + 1,
     created_by: loggedUserId
   }

    dispatch(createTaskSection(newSection))
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return
    }

    const source = result.source
    const destination = result.destination

    if (
        source.droppableId === destination.droppableId &&
        source.index === destination.index
    ) {
      return
    }

    if (result.type === 'COLUMN') {
      const newOrdered = reorder(ordered, source.index, destination.index)

      const submittedData = {
        orderedList: newOrdered,
        project_id: projectInfo.id,
        updated_by: loggedUserId
      }
      dispatch(editSectionSortOrder({data:submittedData}))
      dispatch(updateOrdered(newOrdered))
      return
    }
    if(result.type === 'SUBTASK'){
      const data = reorderQuoteMap({
        quoteMap: childColumns,
        source,
        destination,
      })
      // console.log(data.quoteMap)
      const updateColumnData = {
        ...childColumns,
        ...data.quoteMap,
      }
      const combineUpdateChildData = {
        ...result,
        updateColumnData
      }

      const submittedData = {
        orderedList: combineUpdateChildData,
        project_id: projectInfo.id,
        updated_by: loggedUserId
      }

      dispatch(editTaskSortOrder({data:submittedData}))
      dispatch(updateChildColumns(updateColumnData))
      return
    }
    const data = reorderQuoteMap({
      quoteMap: columns,
      source,
      destination,
    })
    // console.log(data.quoteMap)
    const updateColumnData = {
      ...columns,
      ...data.quoteMap,
    }
    const combineUpdateData = {
      ...result,
      updateColumnData
    }

    const submittedData = {
      orderedList: combineUpdateData,
      project_id: projectInfo.id,
      updated_by: loggedUserId
    }

    dispatch(editTaskSortOrder({data:submittedData}))
    dispatch(updateColumns(updateColumnData))
  };


  //taskDeleteHandler
  const taskSectionDeleteHandler = (taskSectionId, noOfTasks) => modals.openConfirmModal({
    title: (
        <Title order={5}>Are you sure this section delete?</Title>
    ),
    centered: true,
    size: 'sm',
    radius: 'md',
    withCloseButton: false,
    children: (
        <Text size="sm">
          This action is so important that you are required to confirm it with a modal. Please click
          one of these buttons to proceed.
        </Text>
    ),
    labels: { confirm: 'Confirm', cancel: 'Cancel' },
    onCancel: () => console.log('Cancel'),
    onConfirm: () => {
      if(taskSectionId && taskSectionId!=='undefined'){
        if(noOfTasks > 0){
          modals.open({
            withCloseButton: false,
            centered: true,
            children: (
                <Fragment>
                  <Text size="sm">
                      This section has {noOfTasks} tasks. Please delete all tasks before deleting this section.
                  </Text>
                  <div className="!grid w-full !justify-items-center">
                    <Button justify="center" onClick={() => modals.closeAll()} mt="md">
                      Ok
                    </Button>
                  </div>
                </Fragment>
            ),
          });
        }else {
          console.log(taskSectionId, noOfTasks)
          dispatch(deleteTaskSection({id: taskSectionId, data: {'deleted_by': loggedUserId}}));
        }
      }
    },
  });


  const [disableOthers, setDisableOthers] = useState(false);
  const [ selectedMarkSectionName, setSelectedMarkSectionName] = useState('One');

  useEffect(() => {
    //selectedMarkSectionName
    const selectedMarkSection = Object.entries(taskListSections).filter(([key, value]) => value.mark_is_complete === 'complete');
    setSelectedMarkSectionName(selectedMarkSection.length > 0 ? selectedMarkSection[0][1].name : '');
    const isAnyComplete = Object.values(taskListSections).some(task => task.mark_is_complete === 'complete');
    setDisableOthers(isAnyComplete);
  }, [taskListSections]);

  // checkbox handler
  const markIsCompleteHandler = (event, markIsComplete) => {
    console.log(markIsComplete)
    if(markIsComplete==='disable'){
      notifications.show({
        color: theme.errorColor,
        title: 'Already '+selectedMarkSectionName+' section is marked as complete',
        icon: <IconX />,
        autoClose: 5000,
      });
      //event target unchecked
        event.target.checked = false;
    }else{
      dispatch(markIsCompletedTaskSection({id: event.target.value, data: { project_id: projectInfo ? projectInfo.id:null, markIsChecked: event.target.checked, updated_by: loggedInUser && loggedInUser.id ? loggedInUser.id : loggedUserId}}))
    }
  }

  return (
    <Fragment>
      <Accordion
          variant="separated"
          multiple={true}
          value={expandedItems}
          onChange={setExpandedItems}
         chevron={<IconChevronDown size={30} stroke={2} />}
         classNames={{
           control: '!w-[18px] !pl-0 !pr-2',
           content: '!pb-0 !pt-0',
         }}

      >

        <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
          <Droppable
              droppableId="droppable"
              type="COLUMN"
          >
            {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>

                  {ordered && ordered.length > 0 && ordered.map((taskListSection, index) => (

                      <Draggable key={taskListSection} draggableId={taskListSection} index={index}>
                        {(provided, snapshot) => (
                            <Accordion.Item
                                key={taskListSection}
                                value={taskListSections && taskListSections[taskListSection] && taskListSections[taskListSection].slug}
                                className="!border-solid !border-[#dddddd] !rounded-t-md accordion-item !bg-[#fcfcfc]"
                                expanded={expandedItems.includes(taskListSection)}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                            >
                              <div {...provided.dragHandleProps} className="flex items-center w-full border-b border-solid border-[#dddddd] !bg-[#fcfcfc]" >
                                <div className="flex w-full items-center font-bold py-3 pr-3 !pl-1">
                                  <IconGripVertical
                                      size={24}
                                      stroke={1.25}
                                      className="pl-2 px-1 w-[30px]" />
                                  <TaskSectionName
                                      taskSectionId={taskListSections[taskListSection] && taskListSections[taskListSection].id}
                                      nameOfTaskSection={taskListSections[taskListSection] && taskListSections[taskListSection].name}
                                      view="listView"
                                  />
                                </div>
                                {hasPermission(loggedInUser && loggedInUser.llc_permissions, ['superadmin', 'admin', 'director', 'manager', 'section-delete']) &&
                                    <div className="flex items-center gap-2 cursor-pointer">
                                      <Popover width={200} position="bottom-end" withArrow shadow="md">
                                        <Popover.Target>
                                          <IconDotsVertical size={20} stroke={1.25}/>
                                        </Popover.Target>
                                        <Popover.Dropdown>
                                          {hasPermission(loggedInUser && loggedInUser.llc_permissions, ['superadmin', 'admin', 'director', 'manager', 'section-delete']) &&

                                             <List
                                                 spacing="xs"
                                                 size="sm">
                                               <List.Item>
                                                 <Checkbox
                                                     label="Mark as complete"
                                                     defaultChecked={!!(taskListSections[taskListSection] && taskListSections[taskListSection].mark_is_complete === 'complete')}
                                                     onChange={(event) => {
                                                       const markIsComplete = disableOthers && taskListSections[taskListSection].mark_is_complete !== 'complete'? 'disable' : 'enable';
                                                       markIsCompleteHandler(event, markIsComplete)
                                                     }}
                                                     color="orange"
                                                     value={taskListSections[taskListSection] && taskListSections[taskListSection].id}
                                                 />
                                               </List.Item>
                                               <List.Item>
                                                 <Flex className={`cursor-pointer`} onClick={() => {
                                                      taskSectionDeleteHandler(taskListSections[taskListSection] && taskListSections[taskListSection].id, columns && columns && columns[taskListSection] ? columns[taskListSection].length : 0)
                                                      }}
                                                       gap={`sm`}>
                                                       <IconTrash
                                                           className="cursor-pointer"
                                                           size={20}
                                                           stroke={1.25}
                                                           color="var(--mantine-color-red-filled)"
                                                       /> <Text>Delete</Text>
                                                 </Flex>
                                               </List.Item>
                                             </List>
                                          }
                                        </Popover.Dropdown>
                                      </Popover>

                                      <Accordion.Control>
                                      </Accordion.Control>
                                    </div>
                                }
                              </div>
                              <Accordion.Panel>
                                <TaskListContent
                                    className={snapshot.isDragging ? 'is-dragging' : ''}
                                    listType="CONTENT"
                                    snapshot={snapshot}
                                    ref={provided.innerRef}
                                    view="listView"
                                    projectId={projectInfo.id}
                                    taskSection={taskListSection}
                                    taskSectionId={taskListSections[taskListSection] && taskListSections[taskListSection].id}
                                    contents={columns && columns && columns[taskListSection] ? columns[taskListSection] : []}
                                />
                              </Accordion.Panel>
                            </Accordion.Item>
                        )}
                      </Draggable>

                  ))}
                  {provided.placeholder}
                </div>
            )}
          </Droppable>
        </DragDropContext>
      </Accordion>
      {hasPermission(loggedInUser && loggedInUser.llc_permissions, ['superadmin', 'admin', 'director', 'manager', 'section-add']) &&
          <button
              className="rounded-md border border-dashed border-[#ED7D31] px-4 py-2 mt-4 w-full"
              onClick={handleAddSection}
          >
            <span className="text-lg font-bold text-[#ED7D31]"> + Add Section</span>
          </button>
      }

    </Fragment>
  );
};

export default TaskList;

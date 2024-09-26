import React, {useState, useEffect, Fragment} from 'react';
import {IconGripVertical, IconTrash} from '@tabler/icons-react';
import { useSelector, useDispatch } from 'react-redux';
import AddTaskDrawer from './AddTaskDrawer';
import {useParams} from "react-router-dom";
import {
  createTaskSection, deleteTaskSection,
  editSectionSortOrder, editTaskSortOrder,
  fetchTasksByProject, updateChildColumns, updateColumns,
  updateOrdered
} from "../../../Settings/store/taskSlice";
import TaskSectionName from "./Task/TaskSectionName";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {reorder, reorderQuoteMap} from "./utils";
import TaskBoardContent from "./TaskBoardContent";
import {modals} from "@mantine/modals";
import {Button, Text, Title} from "@mantine/core";
import {hasPermission} from "../../../ui/permissions";

const TaskBoard = () => {
  const {projectInfo, tasks, columns, ordered, taskListSections, childColumns} = useSelector((state) => state.settings.task);
  const {loggedUserId} = useSelector((state) => state.auth.user)
  const {loggedInUser} = useSelector((state) => state.auth.session)

  const dispatch = useDispatch();
  const {id}= useParams();

  useEffect(() => {
    dispatch(fetchTasksByProject({id:id}))
  }, [dispatch]);


  const [accordionItems, setAccordionItems] = useState([]);
  useEffect(() => {
    if (tasks && tasks.taskListSectionsName) {
      const transformedItems = Object.entries(tasks.taskListSectionsName).map(([key, value]) => ({
        value: key,
        title: value.name,
      }));
      setAccordionItems(transformedItems);
    }
  }, []);

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
    const newItemValue = `untitle-section-${accordionItems.length + 1}`;
    const newItem = {
      value: newItemValue,
      title: `Type section name here`,
    };
    setAccordionItems([...accordionItems, newItem]);

    const newSection = {
      name: 'Type section name here',
      project_id: projectInfo.id,
      sort_order: ordered.length + 1,
      created_by: loggedUserId
    }

    dispatch(createTaskSection(newSection))
  };

  const onDragEnd = (result) => {
    console.log(result)
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
        project_id: projectInfo.id
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
            dispatch(deleteTaskSection({id: taskSectionId, data: {'deleted_by': loggedUserId}}));
        }
      }
    },
  });


  return (
    <Fragment>

      <div className="project-cards flex flex-row flex-nowrap gap-4 pe-4 pb-4">
        {ordered && ordered.length > 0 &&
            <div className="sections-wrapper">
              <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
                <Droppable
                    droppableId="droppable"
                    type="COLUMN"
                    direction="horizontal"
                >
                  {(provided) => (
                      <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="accordion-sortable flex items-stretch flex-nowrap gap-4 w-auto overflow-x-auto"
                      >
                        {ordered && ordered.length > 0 && ordered.map((taskListSection, index) => (
                            <Draggable key={taskListSection} draggableId={taskListSection} index={index}>
                              {(provided, snapshot) => (
                                  <div
                                      key={taskListSection}
                                      className="flex-1 projects-card-content border border-solid border-[#dddddd] rounded-t-md w-[310px]"
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                  >
                                    <div {...provided.dragHandleProps}
                                        className="project-section-title p-3 flex items-center justify-between bg-[#EBF1F4]">
                                      <div className="flex gap-1 items-center">
                                        {hasPermission(loggedInUser && loggedInUser.llc_permissions, ['superadmin', 'admin', 'director', 'manager', 'section-delete']) &&
                                            <IconTrash
                                                className="cursor-pointer"
                                                onClick={()=> {
                                                  taskSectionDeleteHandler(taskListSections[taskListSection] && taskListSections[taskListSection].id, columns && columns && columns[taskListSection] ? columns[taskListSection].length:0 )
                                                }}
                                                size={20}
                                                stroke={1}
                                                color="var(--mantine-color-red-filled)"
                                            />
                                        }
                                        <IconGripVertical
                                            size={20}
                                            stroke={1.25}
                                            className="mr-1 cursor-move"/>
                                        <TaskSectionName
                                            taskSectionId={taskListSections[taskListSection] && taskListSections[taskListSection].id}
                                            nameOfTaskSection={taskListSections[taskListSection] && taskListSections[taskListSection].name}
                                            view="cardView"
                                        />
                                      </div>
                                      {hasPermission(loggedInUser && loggedInUser.llc_permissions, ['superadmin', 'admin', 'director', 'manager', 'line_manager', 'employee']) &&
                                          <AddTaskDrawer projectId={id}
                                                     taskSectionId={taskListSections[taskListSection] && taskListSections[taskListSection].id}/>
                                      }
                                    </div>
                                    <div className="flex items-stretch items-center pb-3"
                                         style={{height: 'calc(100% - 60px)', minHeight: '350px'}}>
                                      <TaskBoardContent
                                          className={snapshot.isDragging ? 'is-dragging' : ''}
                                          listType="CONTENT"
                                          snapshot={snapshot}
                                          ref={provided.innerRef}
                                          view="cardView"
                                          taskSection={taskListSection}
                                          contents={columns && columns && columns[taskListSection] ? columns[taskListSection] : []}
                                      />
                                    </div>
                                  </div>
                              )}

                            </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                  )}
                </Droppable>
              </DragDropContext>

            </div>
        }
        {hasPermission(loggedInUser && loggedInUser.llc_permissions, ['superadmin', 'admin', 'director', 'manager', 'section-add']) &&
          <div style={{minHeight:'335px', maxHeight: '800px'}} className={`w-[280px] rounded-md border border-dashed border-1 border-[#ED7D31] text-center ${ ordered && ordered.length > 3 ? 'flex-1':''}`}>
            <button
                className="px-4 py-2 w-full h-full coursor-pointer"
                onClick={handleAddSection}
            >
              <span className="text-lg font-bold text-[#ED7D31]"> + Add Section</span>
            </button>
          </div>
        }
      </div>


    </Fragment>
  );
};

export default TaskBoard;




      
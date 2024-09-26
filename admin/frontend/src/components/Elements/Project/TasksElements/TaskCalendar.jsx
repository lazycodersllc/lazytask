import React, {useState, useEffect, Fragment} from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useSelector, useDispatch } from 'react-redux';
import {useParams} from "react-router-dom";
import {
    createTaskSection, deleteTaskSection,
    editSectionSortOrder, editTaskSortOrder, fetchTask,
    fetchTasksByProject, setEditableTask, updateChildColumns, updateColumns,
    updateOrdered
} from "../../../Settings/store/taskSlice";
import {Box, Text} from "@mantine/core";
import UserAvatarSingle from "../../../ui/UserAvatarSingle";
import {IconUserCircle} from "@tabler/icons-react";
import {useDisclosure} from "@mantine/hooks";
import EditTaskDrawer from "./EditTaskDrawer";
import AddTaskDrawerFromCalendar from "./AddTaskDrawerFromCalendar";


// a custom render function
function renderEventContent(eventInfo) {
  return (
      <Fragment>
          <Box className="flex items-center items-justified-space-between pt-0.5 pb-1 px-1">
              <Text c={'black'} className="cursor-pointer" title={eventInfo.event.title} truncate="end" size={`sm`}
                    lineClamp={1}>{eventInfo.event.title}</Text>
              {eventInfo.event.extendedProps.assigned_to ?
                  <UserAvatarSingle user={eventInfo.event.extendedProps.assigned_to} size={20} className="ml-2"/>
                  :
                  <div
                      className="h-[20x] w-[20px] border border-dashed border-[#202020] rounded-full p-1 ml-1 cursor-pointer">
                      <IconUserCircle color="#4d4d4d" size="10" stroke={1.25}/>
                  </div>
              }
          </Box>
      </Fragment>
  )
}

const TaskCalendar = () => {
    const {projectInfo, columns} = useSelector((state) => state.settings.task);
    const {loggedUserId} = useSelector((state) => state.auth.user)
    const {loggedInUser} = useSelector((state) => state.auth.session)

  const dispatch = useDispatch();
  const {id}= useParams();

  useEffect(() => {
    dispatch(fetchTasksByProject({id:id}))
  }, [dispatch]);

    const events = Object.values(columns).flatMap(column =>
        column.map(task => ({
            id: task.id,
            title: task.name,
            start: task.start_date,
            end: task.end_date,
            assigned_to: task.assigned_to,
            task: task
        }))
    );

    const [taskEditDrawerOpen, { open: openTaskEditDrawer, close: closeTaskEditDrawer }] = useDisclosure(false);

    const [task, setTask] = useState(null);
    const onEventClick = (arg) => {
        const { start, end, id, title, extendedProps } = arg.event
        //previous state replace current state using callback
         setTask( {...extendedProps.task} );

        openTaskEditDrawer();
    }

    const onSubmit = (data) => {
        const newEvents = Object.values(columns).flatMap(column => column);

        const updatedTask = newEvents.find((task) => task.id === data.id);
        setTask(!updatedTask ? null : updatedTask);
        dispatch(setEditableTask(!updatedTask ? null : updatedTask))

    }

    const [taskAddDrawerOpenFromCalendar, { open: openTaskAddDrawerFromCalendar, close: closeTaskAddDrawerFromCalendar }] = useDisclosure(false);


    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const onCellSelect = (event) => {
        const { startStr, endStr } = event
        if(startStr && endStr){
            setStartDate(startStr);
            setEndDate(endStr);
            openTaskAddDrawerFromCalendar();
        }
    }

  return (
    <Fragment>

      <FullCalendar
          eventClick={onEventClick}
          select={onCellSelect}
          selectable
          dayMaxEventRows={3}
          datesSet={(arg) => {
              console.log(arg.startStr) //starting visible date
              console.log(arg.endStr) //ending visible date
          }}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView='dayGridMonth'
          weekends={true}
          events={events}
          eventContent={renderEventContent}
          headerToolbar={{
              left: "title",
              right: "today prev,next",
          }}
      />
        { task && taskEditDrawerOpen && <EditTaskDrawer taskObj={task} taskId={task && task.id} taskEditDrawerOpen={taskEditDrawerOpen} openTaskEditDrawer={openTaskEditDrawer} closeTaskEditDrawer={closeTaskEditDrawer} isCalendar={true} submit={onSubmit}/>}
        { projectInfo && startDate && <AddTaskDrawerFromCalendar startDate={startDate} endDate={endDate} project={projectInfo} taskAddDrawerOpen={taskAddDrawerOpenFromCalendar} openTaskAddDrawer={openTaskAddDrawerFromCalendar} closeTaskAddDrawer={closeTaskAddDrawerFromCalendar} />}
    </Fragment>
  );
};

export default TaskCalendar;




      
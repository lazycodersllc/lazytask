import React, {useState, useEffect, Fragment, useRef} from 'react';
import {Accordion, ScrollArea, Tabs} from '@mantine/core';
import { useSelector, useDispatch } from 'react-redux';
import {IconGripVertical} from "@tabler/icons-react";
import MyTaskListContent from "./MyTaskListContent";
import {updateColumns} from "../Settings/store/myTaskSlice";
import TaskHeader from "./Partial/TaskHeader";

const MyTaskList = () => {
const dispatch = useDispatch();

const {userTaskOrdered, userTaskListSections, userTaskColumns} = useSelector((state) => state.settings.myTask);
  const contentEditableRef = useRef('');
  const [expandedItems, setExpandedItems] = useState([]); // Initialize with an empty array
  const [accordionItems, setAccordionItems] = useState([]);
  useEffect(() => {
    if ( userTaskListSections ) {
      const transformedItems = Object.entries(userTaskListSections).map(([key, value]) => ({
        value: key,
        title: value,
      })
      );
      setAccordionItems(transformedItems);
      // Set all accordion items as expanded
      setExpandedItems(transformedItems.map(item => item.value));
    }
  }, [userTaskOrdered]);

  useEffect(() => {
    dispatch(updateColumns(userTaskColumns))
  }, [userTaskColumns]);


  return (
    <Fragment>
      <Tabs color="#39758D" variant="pills" radius="sm" defaultValue="today">
        <Tabs.List className="mb-3">
          {userTaskOrdered && userTaskOrdered.length > 0 && userTaskOrdered.map((taskListSection, index) => (
              <Tabs.Tab value={taskListSection} className="font-bold">
                  {userTaskListSections && userTaskListSections[taskListSection] && userTaskListSections[taskListSection]}
              </Tabs.Tab>
          ))}
        </Tabs.List>
        {userTaskOrdered && userTaskOrdered.length > 0 ?
            userTaskOrdered.map((taskListSection, index) => (
                <Tabs.Panel value={taskListSection}>
                  <TaskHeader />
                  <ScrollArea className="h-[calc(100vh-260px)] p-[3px]" scrollbarSize={4}>
                    {/*<LoadingOverlay
                                    visible={taskReload}
                                    zIndex={1000}
                                    overlayProps={{ radius: 'xs', blur: 1 }}
                                    loaderProps={{ color: 'red', type: 'bars' }}
                                />*/}
                    <MyTaskListContent
                        contents={userTaskColumns && userTaskColumns[taskListSection] ? userTaskColumns[taskListSection]:[]}
                    />
                  </ScrollArea>

                </Tabs.Panel>
            )) : <div className="text-center">No Task Found</div>
        }

      </Tabs>

    </Fragment>
  );
};

export default MyTaskList;

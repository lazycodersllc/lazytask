import React, {useEffect, useMemo, useState} from 'react';
import {Accordion, List, ScrollArea} from '@mantine/core';
import WorkspaceModal from '../Modal/Workspace/WorkspaceModal';
import { useSelector, useDispatch } from 'react-redux';
import {fetchAllCompanies} from "../../Settings/store/companySlice";
import {Link, NavLink, useLocation, useNavigate, useParams} from "react-router-dom";
import {fetchTasksByProject} from "../../Settings/store/taskSlice";
import {hasPermission} from "../../ui/permissions";
import {IconAngle, IconCheck} from "@tabler/icons-react";

const WorkspaceLists = () => {

  const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate()
    const { loggedInUser } = useSelector((state) => state.auth.session)

  useEffect(() => {
    dispatch(fetchAllCompanies());
  }, [dispatch]);

    const id = useParams().id;

    const [projectId, setProjectId] = useState(id);

  const {companies} = useSelector((state) => state.settings.company);
    const goToTasksList = (id) => {
        dispatch(fetchTasksByProject({id:id}))
        navigate(`/project/task/list/${id}`)
        setProjectId(id)
    }
    /*const {loggedUserId} = useSelector((state) => state.auth.user)
    console.log(loggedUserId)*/
  return (
    <>
    {/*{hasPermission(loggedInUser && loggedInUser.llc_permissions, ['superadmin']) &&
        <Link to="/workspace">
            <button className="w-full border border-solid border-black text-black bg-white rounded-md p-1 mb-4 hover:bg-[#39758D] hover:text-white">
                Manage Workspace
            </button>
        </Link>
        // <WorkspaceModal />
    }*/}

        <ScrollArea className="h-[calc(100vh-100px)] pr-1" scrollbarSize={4} offsetScrollbars={true}>
            <Accordion variant="separated" defaultValue="" classNames={{
                label: '!py-3 !font-semibold !text-sm',
                item:'!mt-2 !border-solid !border !border-gray-300',
                control: '!bg-white font-bold !rounded-md',
               /* content: '!px-0',
                label: '!py-0 !pt-1',
                chevron: '!mx-0 !ml-1',*/
                // chevron: classes.chevron
            }}>
                {companies && companies.length > 0 && companies.map((item) => (
            <Accordion.Item key={item.id} value={item.id.toString()}>
              <Accordion.Control>
                {item.name}
              </Accordion.Control>
              {item.projects && item.projects.length > 0 &&
              <Accordion.Panel>
                  <List classNames={{
                        root: '!bg-white !rounded-b-md',
                      itemWrapper: '!w-full',
                      itemLabel: '!w-full',
                        // item: '!py-2 !px-4',
                        // label: '!py-2 !px-4',
                  }}>
                      {item.projects && item.projects.map((project, index) => (
                          <List.Item

                              key={`${project.id}-${index}`}
                                     style={{"lineHeight":"normal"}}
                                     className="flex !text-[#346A80] hover:bg-[#EBF1F4] cursor-pointer !py-2 !px-4 rounded text-sm"
                                     onClick={() => goToTasksList(project.id)}>
                                  <div className={`flex items-center w-full`}>
                                      <p className={`w-full ${location && (location.pathname === '/project/task/list/'+project.id ||  location.pathname === '/project/task/board/'+project.id || location.pathname === '/project/task/calendar/'+project.id ) ? 'font-semibold text-black':'text-[#346A80]'}`}>
                                          {project.name}
                                      </p>
                                      {location && (location.pathname === '/project/task/list/'+project.id || location.pathname === '/project/task/board/'+project.id || location.pathname === '/project/task/calendar/'+project.id ) &&
                                          <IconCheck color={`#000000`} size={20} stroke={1.25} />
                                      }
                                  </div>
                          </List.Item>

                      ))}

                  </List>

              </Accordion.Panel>
              }
            </Accordion.Item>
          ))}
        </Accordion>
      </ScrollArea>
      
    </>
  );
};

export default WorkspaceLists;
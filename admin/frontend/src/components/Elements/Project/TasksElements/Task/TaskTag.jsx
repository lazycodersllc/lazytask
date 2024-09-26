import {IconTags, IconUserCircle, IconUsers} from '@tabler/icons-react';
import React, {useState, useRef, useEffect} from 'react';
import {Avatar, InputBase, MultiSelect, Pill, Popover, ScrollArea, TagsInput, Text} from '@mantine/core';
import {useDispatch, useSelector} from 'react-redux';
import {useClickOutside, useDisclosure} from "@mantine/hooks";
import {addTagToTask, deleteTagFromTask} from "../../../../Settings/store/taskSlice";
import useTwColorByName from "../../../../ui/useTwColorByName";
import {hasPermission} from "../../../../ui/permissions";

const TaskTag = ({taskId, taskTags}) => {
    const dispatch = useDispatch();
    const {loggedUserId} = useSelector((state) => state.auth.user)
    const {loggedInUser} = useSelector((state) => state.auth.session)

    const {tags} = useSelector((state) => state.settings.tag);
    const [showTagsList, setShowTagsList] = useState(false);
    // const [members, setTags] = useState(tags);
    const [selectedTags, setSelectedTags] = useState(taskTags && taskTags.length > 0 ? taskTags.map((tag)=> tag.name) : []);
    const [searchValue, setSearchValue] = useState('');
    const tagsListRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (tagsListRef.current && !tagsListRef.current.contains(event.target)) {
                close()
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [tagsListRef]);


    useEffect(() => {
        setSelectedTags(taskTags && taskTags.length > 0 ? taskTags.map((tag)=> tag.name) : []);
    }, [taskTags]);


    const [opened, { close, open }] = useDisclosure(false);

    const handleTagRemove = (removedTag) => {
        if(removedTag){
            const data= {
                'name': removedTag,
                'user_id': loggedUserId,
                'task_id': taskId
            };
            dispatch(deleteTagFromTask(data))
        }
    };

    const handleTagAdd = (addTag) => {
        if(addTag){
            const data={
                'name': addTag,
                'user_id': loggedUserId,
                'task_id': taskId
            };
            dispatch(addTagToTask(data))
            // dispatch(setEditableTask(task))
        }
    };
    const bgColor = useTwColorByName();


    return (
        <>
            <div className="tag-select-btn cursor-pointer flex gap-1 items-center pl-1">

                <div className="flex items-center gap-2 flex-wrap">

                    {/*<IconTags onClick={handleTagSelectButtonClick} color="#4d4d4d" size="22"/>*/}
                    <Popover ref={tagsListRef} width={300} position="bottom" withArrow shadow="md">
                        <Popover.Target>
                            <div className="flex items-center gap-2">

                                {selectedTags && selectedTags.length > 0 ?
                                    <>
                                        <div className={`w-[25px]`}>
                                            <IconTags
                                                onClick={open}
                                                color="#ED7D31"
                                                size="20"
                                                stroke={1.25}
                                            />
                                        </div>
                                        <div className={`w-[100%]`}>
                                            <InputBase component="span" multiline classNames={{
                                                // root: '!border-0',
                                                input: '!border-0 !p-0 !bg-transparent',
                                            }}>
                                                <Pill.Group>
                                                    {selectedTags.slice(0, 2).map((selectedTag, index) => (
                                                        <Pill size="md">{selectedTag}</Pill>
                                                        /*<div key={index}
                                                             // className="flex border	px-2 py-1 rounded-[25px] items-center gap-2 inline-flex text-black text-[12px]"
                                                             className={`flex border px-2 py-1 rounded-[25px] items-center gap-2 inline-flex text-black text-[12px] ${bgColor(selectedTag)}`}
                                                        >
                                                            {selectedTag}
                                                        </div>*/
                                                    ))}
                                                    {selectedTags.length > 2 && (
                                                        <Pill size="md">More ...({selectedTags.length - 2})</Pill>
                                                    )}
                                                </Pill.Group>
                                            </InputBase>

                                        </div>
                                    </>
                                    :
                                    <div
                                        className="h-[30px] w-[30px] border border-dashed border-[#4d4d4d] rounded-full p-1">
                                        <IconTags onClick={open}
                                                  stroke={1.25}
                                                  color="#4d4d4d"
                                                  size="20"/>
                                    </div>

                                }
                            </div>
                        </Popover.Target>
                        { hasPermission (loggedInUser && loggedInUser.llc_permissions, ['superadmin', 'admin', 'director', 'manager', 'line_manager', 'employee', 'task-edit']) &&
                            <Popover.Dropdown>
                                <TagsInput
                                    placeholder="Pick tag from list"
                                    data={(tags && tags.length > 0) ? tags.map((tag) => tag.name) : []}
                                    defaultValue={selectedTags && selectedTags.length>0 ? selectedTags: []}
                                    comboboxProps={{ withinPortal: false }}
                                    searchValue={searchValue}
                                    onSearchChange={
                                        (value) => {
                                            setSearchValue(value)
                                        }
                                    }
                                    onOptionSubmit={(value) => {
                                        handleTagAdd(value)
                                    }}
                                    onRemove={(removeTag)=>{
                                        handleTagRemove(removeTag)
                                    }}
                                    onChange={(value) => {
                                        setSelectedTags(value);
                                    }}

                                />
                            </Popover.Dropdown>
                        }

                    </Popover>


                </div>

            </div>
        </>
    );
};

export default TaskTag;

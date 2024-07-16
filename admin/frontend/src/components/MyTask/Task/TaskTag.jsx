import {IconTags, IconUserCircle, IconUsers} from '@tabler/icons-react';
import React, {useState, useRef, useEffect} from 'react';
import {Avatar, MultiSelect, Popover, ScrollArea, TagsInput, Text} from '@mantine/core';
import {useDispatch, useSelector} from 'react-redux';
import {useClickOutside, useDisclosure} from "@mantine/hooks";
import {addTagToMyTask, deleteTagFromMyTask} from "../../Settings/store/myTaskSlice";

const TaskTag = ({task, taskTags}) => {
    const dispatch = useDispatch();
    const {loggedUserId} = useSelector((state) => state.auth.user)

    const taskId = task.id;
    const {tags} = useSelector((state) => state.settings.tag);
    const [showTagsList, setShowTagsList] = useState(false);
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
            dispatch(deleteTagFromMyTask(data))
        }
    };

    const handleTagAdd = (addTag) => {
        if(addTag){
            const data={
                'name': addTag,
                'user_id': loggedUserId,
                'task_id': taskId
            };
            dispatch(addTagToMyTask(data))
            // dispatch(setEditableTask(task))
        }
    };

    return (
        <>
            <div className="tag-select-btn cursor-pointer inline-block flex gap-1 items-center pl-2">

                <div className="flex items-center gap-2 flex-wrap">

                    {/*<IconTags onClick={handleTagSelectButtonClick} color="#4d4d4d" size="22"/>*/}
                    <Popover ref={tagsListRef} width={300} position="bottom" withArrow shadow="md">
                        <Popover.Target>
                            <div className="flex items-center gap-2">
                                <IconTags onClick={open} color="#4d4d4d" size="22"/>
                                {selectedTags.length > 0 &&
                                    <>

                                        {selectedTags.slice(0, 2).map((selectedTag, index) => (
                                            <div key={index}
                                                 className="flex border	px-3 py-[3px] rounded-[25px] items-center gap-2 inline-flex text-black text-[12px]">
                                                {selectedTag}
                                            </div>
                                        ))}
                                        {selectedTags.length > 2 && (
                                            <div
                                                className="flex border px-3 py-1 rounded-[25px] items-center gap-2 inline-flex text-black text-[12px]">
                                                More ...({selectedTags.length - 2})
                                            </div>
                                        )}
                                    </>

                                }
                            </div>
                        </Popover.Target>
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
                    </Popover>


                </div>

            </div>
        </>
    );
};

export default TaskTag;

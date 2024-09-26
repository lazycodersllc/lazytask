import {IconTags, IconUserCircle, IconUsers} from '@tabler/icons-react';
import React, {useState, useRef, useEffect} from 'react';
import {Avatar, MultiSelect, Popover, ScrollArea, TagsInput, Text} from '@mantine/core';
import {useDispatch, useSelector} from 'react-redux';
import {useClickOutside, useDisclosure} from "@mantine/hooks";
import {addTagToTask, deleteTagFromTask} from "../../../../Settings/store/taskSlice";

const TaskTagForTaskAdd = (props) => {

    const {onChangeSelectedItem} = props;

    const dispatch = useDispatch();
    const {loggedUserId} = useSelector((state) => state.auth.user)

    const {tags} = useSelector((state) => state.settings.tag);
    const [showTagsList, setShowTagsList] = useState(false);
    // const [members, setTags] = useState(tags);
    const [selectedTags, setSelectedTags] = useState([]);
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


    const [opened, { close, open }] = useDisclosure(false);

    const handleTagRemove = (removedTag) => {
        if(removedTag){
            const data= {
                'name': removedTag,
                'user_id': loggedUserId,
                'task_id': null
            };
            dispatch(deleteTagFromTask(data))
        }
    };

    const handleTagAdd = (addTag) => {
        if(addTag){
            const data={
                'name': addTag,
                'user_id': loggedUserId,
                'task_id': null
            };
            dispatch(addTagToTask(data))
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
                                                 className="flex bg-emerald-200	px-2 py-1 rounded-[25px] items-center gap-2 inline-flex text-black text-[12px]">
                                                {selectedTag}
                                            </div>
                                        ))}
                                        {selectedTags.length > 2 && (
                                            <div
                                                className="flex bg-emerald-200 px-2 py-1 rounded-[25px] items-center gap-2 inline-flex text-black text-[12px]">
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

                                    onChangeSelectedItem(value);
                                }}

                            />
                        </Popover.Dropdown>
                    </Popover>


                </div>

            </div>


            {/*{showTagsList && (
                <div ref={tagsListRef}
                     className="z-[9] members-lists absolute w-[272px] bg-white mt-3 border border-solid border-[#6191A4] rounded-lg">

                    <ScrollArea h={272}>
                        <MultiSelect
                            placeholder="Tags"
                            searchable
                            hidePickedOptions
                            data={[
                                { value: 'react', label: 'React' },
                                { value: 'ng', label: 'Angular' },
                            ]}
                        />
                        <div className="p-3">
                            <Text size="sm" fw={700} c="#202020">{tags.length} tag available</Text>
                            <div className="mt-3">  
                                {tags && tags.length>0 && tags.map((tag) => (
                                    <div key={tag.id} className="ml-single flex items-center border-b border-solid border-[#C2D4DC] py-1 justify-between">
                                        <div className="mls-ne ml-3 w-full">
                                            <Text size="sm" fw={700} c="#202020">{tag.name}</Text>
                                        </div> 
                                        <button
                                            onClick={() => handleTagButtonClick(tag)}
                                            className={`rounded-md h-[32px] px-2 py-0 w-[115px] ml-3 ${selectedTags.some((selectedTag) => selectedTag.id === tag.id) ? 'bg-[#f00]' : 'bg-[#39758D]'}`}
                                        >
                                            <Text size="sm" fw={400} c="#fff">
                                                {selectedTags.some((selectedTag) => selectedTag.id === tag.id) ? 'Remove' : 'Tag'}
                                            </Text>
                                        </button>
                                    </div>   
                                ))} 
                            </div>
                        </div>
                    </ScrollArea>
                </div>
            )}*/}
        </>
    );
};

export default TaskTagForTaskAdd;

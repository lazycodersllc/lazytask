import React, {useState, useEffect, Fragment, useRef} from 'react';
import {ActionIcon, Button, Input, Menu, rem, ScrollArea, Textarea, TextInput, useMantineTheme} from '@mantine/core';
import { useSelector, useDispatch } from 'react-redux';
import {createQuickTask} from "../Settings/store/quickTaskSlice";
import dayjs from "dayjs";
import {IconDeviceFloppy, IconEdit} from "@tabler/icons-react";
import {Link} from "react-router-dom";
import TaskListContent from "./TaskListContent";

const TaskList = ({slug, header}) => {
    const {userTaskColumns} = useSelector((state) => state.settings.myTask);

    return (
      <TaskListContent tasks={userTaskColumns && userTaskColumns[slug] && userTaskColumns[slug].length>0?userTaskColumns[slug]:[]} header={header} />
  );
};

export default TaskList;

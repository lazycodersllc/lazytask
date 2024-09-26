import {Avatar, Button, Select, Text, Textarea, Timeline} from '@mantine/core';
import { IconChevronDown, IconPointFilled } from '@tabler/icons-react';
import React, { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import {useDispatch, useSelector} from "react-redux";
import dayjs from 'dayjs'
import {createComment} from "../../Settings/store/taskSlice";
import ActivityLogs from "../ActivityLogs";

const TaskActivity = ({task, selectedValue}) => {

  const dispatch = useDispatch();

  const [comments, setComments] = useState(task && task.comments ? task.comments : []);
  const [commentText, setCommentText] = useState('');
  const {loggedUserId, name} = useSelector((state) => state.auth.user)
  const dateTimeFormat = 'DD MMM YYYY hh:mm A'

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const commentTime = new Date(timestamp);
    const timeDiff = Math.abs(now - commentTime) / 1000; // in seconds

    if (timeDiff < 60) {
      return 'Just now';
    } else if (timeDiff < 3600) {
      const minutes = Math.floor(timeDiff / 60);
      return `${minutes} min ago`;
    } else if (timeDiff < 86400) {
      const hours = Math.floor(timeDiff / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return commentTime.toLocaleString();
    }
  };

  const handleAddComment = () => {
    const timestamp = new Date().toISOString();
    const newComment = {
      user_id: loggedUserId,
      user_name: name,
      commentable_id: task && task.id ? task.id : null,
      commentable_type: 'task',
      content: commentText,
      created_at: formatTimestamp(timestamp)
    };
    dispatch(createComment(newComment));
    setComments([newComment, ...comments]);
    setCommentText(''); // Clear textarea
  };

  return (
    <>
      <Timeline>
        {task.logActivities && task.logActivities.length > 0 ? (
            task.logActivities && task.logActivities.length > 0 && task.logActivities.map((activity, index) => (
                    /*<Timeline.Item bullet={<IconGitBranch size={12} />} title="New branch">
                      <Text c="dimmed" size="sm">You&apos;ve created new branch <Text variant="link" component="span" inherit>fix-notifications</Text> from master</Text>
                      <Text size="xs" mt={4}>2 hours ago</Text>
                    </Timeline.Item>*/
                <Timeline.Item
                    key={activity.id + index} title={activity.user_name && activity.user_name}
                    /*media={activity.user &&
                        <UsersAvatarGroup avatarProps={{size: 35}}
                                          users={[activity.causer]}/>}*/
                >
                  <Text size="xs" mt={4}>{activity.created_at ? dayjs(activity.created_at).format(dateTimeFormat) : ''}</Text>

                  <ActivityLogs activity={activity}/>
                </Timeline.Item>
            ))
        ) : (
            <Timeline.Item>No Activities</Timeline.Item>
        )}
      </Timeline>
    </>
  );
};

export default TaskActivity;

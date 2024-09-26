import { Avatar, Button, Select, Text, Textarea } from '@mantine/core';
import { IconChevronDown, IconPointFilled } from '@tabler/icons-react';
import React, {useEffect, useState} from 'react';
import { useDisclosure } from '@mantine/hooks';
import {useDispatch, useSelector} from "react-redux";
import {createComment} from "../../Settings/store/taskSlice";
// import {createComment} from "../../../Settings/store/taskSlice";

const TaskComment = ({task, selectedValue}) => {

  const dispatch = useDispatch();

  const [comments, setComments] = useState(task && task.comments ? task.comments : []);
  const [commentText, setCommentText] = useState('');
  const {loggedUserId, name} = useSelector((state) => state.auth.user)
  const {loggedInUser} = useSelector((state) => state.auth.session)

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
      <div className="comments-lists max-h-[400px] overflow-y-scroll scrollbar-width-thin">
        {selectedValue==='Only Comments' && comments && comments.length>0 && comments.map((comment, index) => (
            <div key={index} className="single-comment mb-4">
              <div className="sc-head flex items-center gap-2">
                {/*<Avatar size={32} src={comment.avatarSrc} alt={comment.user_name} />*/}
                <Text fw={500} fz={14} c="#202020">{comment.user_name}</Text>
                <Text fw={400} fz={12} c="#39758D"><IconPointFilled size={14} /></Text>
                <Text fw={400} fz={12} c="#39758D">{comment.created_at}</Text>
              </div>
              <div className="comment-body pl-[40px]">
                <Text fw={400} fz={14} c="#4D4D4D">{comment.content}</Text>
              </div>
            </div>
        ))}
      </div>

      {selectedValue === 'Only Comments' &&
          <div className="write-comments">
            <div className="flex gap-2 mb-2">

              <Avatar size={32}
                      src={loggedInUser && loggedInUser.avatar ? loggedInUser.avatar : ''}
                      alt={loggedInUser && loggedInUser.name}/>
              <Textarea
                  description=""
                  style={{width: '100%'}}
                  autosize
                  minRows={4}
                  placeholder="Type your comment here"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <Button variant="filled" color="#39758D" size="md" onClick={handleAddComment}>Comment</Button>
            </div>
          </div>
      }
    </>
  );
};

export default TaskComment;

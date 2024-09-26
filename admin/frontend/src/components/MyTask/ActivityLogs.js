import React, {Fragment} from 'react'
import classNames from 'classnames'

const HighlightedText = ({ children, className }) => {
    return (
        <span
            className={classNames(
                'font-semibold text-gray-900 dark:text-gray-100',
                className
            )}
        >
            {children}
        </span>
    )
}

const ActivityLogs = ({ activity }) => {
    return (
        activity.properties.attributes && Object.keys(activity.properties.attributes).length>0 && Object.keys(activity.properties.attributes).map((attrName, attrIndex)=>{
            return (
                <Fragment key={attrIndex}>

                    {activity?.subject_name==='task' && activity?.event==='created' && attrName==='name' && (
                        <div className="mt-4">
                            <HighlightedText>{activity.properties.attributes[attrName]}</HighlightedText>
                            <span className="mx-1"> is created. </span>
                        </div>
                    )}

                    {activity?.subject_name==='task' && activity?.event === 'updated' &&
                        <>

                            {attrName==='name' &&
                                <p>Title change <strong>{activity.properties.old[attrName]}</strong> to <strong>{activity.properties.attributes[attrName]}</strong></p>
                            }
                            {attrName==='description' &&
                                <p>Description change <strong>{activity.properties.old[attrName]}</strong> to <strong>{activity.properties.attributes[attrName]}</strong></p>
                            }
                            {attrName==='assignedTo_name' &&
                                <p>Assigned <strong>{activity.properties.old[attrName]}</strong> to <strong>{activity.properties.attributes[attrName]}</strong></p>
                            }
                            {attrName==='priority_name' &&
                                <>Priority <strong>{activity.properties.old[attrName]}</strong> to <strong>{activity.properties.attributes[attrName]}</strong></>
                            }
                            {attrName==='start_date' &&
                                <p> Start date change <strong>{activity.properties.old[attrName]}</strong> to <strong>{activity.properties.attributes[attrName]}</strong></p>
                            }
                            {attrName==='end_date' &&
                                <p>End date change <strong>{activity.properties.old[attrName]}</strong> to <strong>{activity.properties.attributes[attrName]}</strong></p>
                            }
                            {attrName==='section_name' &&
                                <>Section change <strong>{activity.properties.old[attrName]}</strong> to <strong>{activity.properties.attributes[attrName]}</strong></>
                            }
                        </>
                    }

                    {activity?.subject_name==='task' && activity?.event === 'removed' && attrName==='name' &&
                        <>
                            <div className="mt-4">
                                <HighlightedText>{activity.properties.attributes[attrName]}</HighlightedText>
                                <span className="mx-1"> is deleted. </span>
                            </div>

                        </>
                    }
                    {activity?.subject_name==='task' && activity?.event === 'attachment-removed' && attrName==='name' &&
                        <>
                            <div className="mt-4">
                                <HighlightedText>{activity.properties.attributes[attrName]}</HighlightedText>
                                <span className="mx-1"> is deleted. </span>
                            </div>

                        </>
                    }
                    {activity?.subject_name==='task' && activity?.event === 'attachment-upload' && attrName==='name' &&
                        <>
                            <div className="mt-4">
                                <HighlightedText>{activity.properties.attributes[attrName]}</HighlightedText>
                                <span className="mx-1"> is upload. </span>
                            </div>

                        </>
                    }
                </Fragment>
            )
        })
    )
}

export default ActivityLogs

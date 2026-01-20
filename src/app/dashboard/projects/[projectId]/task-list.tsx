"use client"

import { useEffect, useState } from "react"
import AssignTask from "./task-assign"
import TaskStatus from "./task-status-update"

export default function TaskList({
  projectId,
  members,
  role,
  userId,
}: any) {
  const [tasks, setTasks] = useState<any[]>([])

  useEffect(() => {
    fetch(`/api/projects/${projectId}/tasks`)
      .then((r) => r.json())
      .then(setTasks)
  }, [projectId])

  return (
    <div>
      <h2 className="font-semibold mb-3">Tasks</h2>

      <ul className="space-y-3">
        {tasks.map((t) => (
          <li key={t.id} className="border p-3 rounded">
            <div className="font-medium">{t.title}</div>
            <div className="text-sm">Status: {t.status}</div>

            {t.assignee && (
              <div className="text-sm text-gray-500">
                Assigned to: <strong>{t.assignee.name}</strong>
              </div>
            )}

            <TaskStatus
              projectId={projectId}
              taskId={t.id}
              status={t.status}
              canEdit={
                t.role !== "MEMBER" || t.assigneeId === t.userId
              }
            />

            {(role === "ADMIN" || role === "MANAGER") && (
              <AssignTask
                projectId={projectId}
                taskId={t.id}
                members={members}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

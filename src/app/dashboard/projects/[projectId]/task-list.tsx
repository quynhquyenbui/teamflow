"use client"

import { useEffect, useState } from "react"
import TaskStatusUpdater from "./task-status-update"
import AssignTask from "./task-assign"

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
                Assigned to: {t.assignee.name}
              </div>
            )}

            <TaskStatusUpdater
              task={t}
              role={role}
              userId={userId}
            />

            {(role === "ADMIN" || role === "MANAGER") && (
              <AssignTask
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

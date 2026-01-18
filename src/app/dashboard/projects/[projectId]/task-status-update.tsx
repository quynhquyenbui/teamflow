"use client"

export default function TaskStatusUpdater({
  task,
  role,
  userId,
}: any) {
  const canUpdate =
    role !== "MEMBER" || task.assigneeId === userId

  if (!canUpdate) return null

  async function update(status: string) {
    await fetch(`/api/tasks/${task.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })

    location.reload()
  }

  return (
    <div className="mt-2 space-x-2">
      <button onClick={() => update("TODO")}>Todo</button>
      <button onClick={() => update("IN_PROGRESS")}>
        In Progress
      </button>
      <button onClick={() => update("DONE")}>Done</button>
    </div>
  )
}

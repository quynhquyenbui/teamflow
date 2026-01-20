"use client"

export default function TaskStatus({
projectId,
taskId,
status,
canEdit,
}: {
projectId: string
taskId: string
status: string
canEdit: boolean
}) {
async function update(nextStatus: string) {
await fetch(`/api/projects/${projectId}/tasks/${taskId}/status`, {
method: "PATCH",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ status: nextStatus }),
})

location.reload()

}

if (!canEdit) {
return ( <span className="text-xs text-gray-500">Status: {status}</span>
)
}

return (
<select
className="border text-xs px-2 py-1 rounded"
value={status}
onChange={(e) => update(e.target.value)}>
    <option value="TODO">TODO</option>
    <option value="IN_PROGRESS">IN PROGRESS</option>
    <option value="DONE">DONE</option> </select>
)
}

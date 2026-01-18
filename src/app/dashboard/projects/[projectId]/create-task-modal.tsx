"use client"

import { useState } from "react"

export default function CreateTaskModal({
    projectId,
    onClose,
}: {
    projectId: string
    onClose: () => void
}) {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [deadline, setDeadline] = useState<string>("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [open, setOpen] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (!title.trim()) {
            setError("Title is required")
            return
        }

        setLoading(true)
        setError("")

        const res = await fetch(`/api/projects/${projectId}/tasks`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title,
                description,
                deadline: deadline || null,
            }),
        })

        setLoading(false)

        if (!res.ok) {
            const data = await res.json()
            setError(data.message || "Failed to create task")
            return
        }

        onClose()
        location.reload()

    }

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="mb-4 border px-3 py-1 rounded"
            >
                + Create Task
            </button>
            {open && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"> <div className="bg-white w-full max-w-md rounded p-6"> <h2 className="text-lg font-semibold mb-4">Create Task</h2>

                {error && (
                    <p className="text-sm text-red-500 mb-2">{error}</p>
                )}

                <form onSubmit={handleSubmit}>
                    <input
                        className="border w-full px-3 py-2 mb-3 rounded"
                        placeholder="Task title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <textarea
                        className="border w-full px-3 py-2 mb-3 rounded"
                        placeholder="Description (optional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <input
                        type="date"
                        className="border w-full px-3 py-2 mb-4 rounded"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                    />

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            className="px-4 py-2 text-sm border rounded"
                            onClick={() => setOpen(false)}
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-4 py-2 text-sm bg-black text-white rounded disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? "Creating..." : "Create"}
                        </button>
                    </div>
                </form>
            </div>
            </div>
            )}
        </>
    )
}

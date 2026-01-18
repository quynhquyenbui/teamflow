"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CreateProjectForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  async function submit(e: React.FormEvent) {
    e.preventDefault()

    await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    })

    setName("")
    setDescription("")
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="space-y-2 mb-6">
      <input
        className="border p-2 w-full"
        placeholder="Project name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        className="border p-2 w-full"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button className="bg-black text-white px-4 py-2">
        Create Project
      </button>
    </form>
  )
}

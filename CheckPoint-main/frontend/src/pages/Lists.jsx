import React, { useState, useEffect } from "react"
import { X, ImageIcon, Plus, Eye, Users, Lock } from "lucide-react"
import { useLocation } from "react-router-dom"
import { MainNav } from "../components/MainNav"
import ListCard from "../components/ListCard"

export default function List() {
  const location = useLocation();
  const baseUrl = import.meta.env.VITE_BASE_URL
  const [isCreating, setIsCreating] = useState(false);
  const [lists, setLists] = useState([])
  const [fields, setFields] = useState({
    title: "",
    tags: "",
    createdBy: "",
    description: "",
    whoCanView: "public",
    coverImage: null,
  })

  // Show/hide the input fields
  const showInputsValue = location.state?.showInputs || false;
  const [showInputs, setShowInputs] = useState(showInputsValue)
  const [imagePreview, setImagePreview] = useState(null)
  const [dragActive, setDragActive] = useState(false)

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFields((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle file upload
  const handleFileUpload = (file) => {
    if (file && file.type.startsWith("image/")) {
      setFields((prev) => ({
        ...prev,
        coverImage: file,
      }))

      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle drag and drop
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  // Remove image
  const removeImage = () => {
    setFields((prev) => ({
      ...prev,
      coverImage: null,
    }))
    setImagePreview(null)
  }

  // Reset form
  const resetForm = () => {
    setFields({
      title: "",
      tags: "",
      createdBy: "",
      description: "",
      whoCanView: "public",
      coverImage: null,
    })
    setImagePreview(null)
    setShowInputs(false)
  }

  const handleSubmit = async () => {
    setIsCreating(true);
    const formData = new FormData()
    formData.append("title", fields.title)
    formData.append("tags", fields.tags)
    formData.append("description", fields.description)
    formData.append("whoCanView", fields.whoCanView)
    if (fields.coverImage) {
      formData.append("coverImage", fields.coverImage)
    }

    const response = await fetch(`${baseUrl}/list/create`, {
      method: "POST",
      body: formData,
      credentials: "include",
    })

    const data = await response.json()
    console.log(data);
    setLists([...lists, data.list]);
    setIsCreating(false);
    resetForm()
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${baseUrl}/list/`, {
        method: "GET",
      })
      const data = await response.json()
      console.log(data)
      if (!response.ok) return
      setLists(data.list)
    }
    fetchData()
  }, [baseUrl]);

  const getVisibilityIcon = (visibility) => {
    switch (visibility) {
      case "private":
        return <Lock className="w-4 h-4" />
      case "friends":
        return <Users className="w-4 h-4" />
      default:
        return <Eye className="w-4 h-4" />
    }
  }

  return (
    <>
      <MainNav />
      <div className="min-h-screen bg-black text-white">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-gray-900 to-black border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">My Lists</h1>
                <p className="text-gray-400">Create and manage your game lists</p>
              </div>
              <button
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
                onClick={() => setShowInputs((v) => !v)}
              >
                {showInputs ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                {showInputs ? "Cancel" : "Create List"}
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Create List Form */}
          {showInputs && (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-8 mb-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Plus className="w-6 h-6 text-purple-500" />
                Create New List
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Cover Image */}
                <div>
                  <label className="block text-gray-300 mb-3 font-medium">Cover Image</label>

                  {!imagePreview ? (
                    <div
                      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${dragActive ? "border-purple-500 bg-purple-500/10" : "border-gray-600 hover:border-gray-500"
                        }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e.target.files[0])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <ImageIcon className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400 mb-2">Drag and drop an image here, or click to select</p>
                      <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  ) : (
                    <div className="relative rounded-xl overflow-hidden">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Cover preview"
                        className="w-full h-64 object-cover"
                      />
                      <button
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Right Column - Form Fields */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="title"
                      value={fields.title}
                      onChange={handleChange}
                      className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Enter list title"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Tags</label>
                    <input
                      name="tags"
                      value={fields.tags}
                      onChange={handleChange}
                      className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="action, adventure, rpg"
                    />
                    <p className="text-sm text-gray-500 mt-1">Separate tags with commas</p>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">
                      Created By <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="createdBy"
                      value={fields.createdBy}
                      onChange={handleChange}
                      className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Your name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Visibility</label>
                    <select
                      name="whoCanView"
                      value={fields.whoCanView}
                      onChange={handleChange}
                      className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    >
                      <option value="public">🌍 Public - Everyone can see</option>
                      <option value="friends">👥 Friends - Only friends can see</option>
                      <option value="private">🔒 Private - Only you can see</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Description - Full Width */}
              <div className="mt-6">
                <label className="block text-gray-300 mb-2 font-medium">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={fields.description}
                  onChange={handleChange}
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                  placeholder="Describe your list..."
                  rows={4}
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 mt-8">
                <button
                  onClick={handleSubmit}
                  disabled={!fields.title || !fields.description || !fields.createdBy || isCreating}
                  className="flex-1 py-3 px-6 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:transform-none"
                >
                  {isCreating ? "Creating..." : "Create List"}
                </button>
                <button
                  onClick={resetForm}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Lists Display */}
          <div>
            {lists && lists.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gray-900 rounded-xl p-8 max-w-md mx-auto border border-gray-800">
                  <ImageIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">No lists yet</h3>
                  <p className="text-gray-500 mb-4">Create your first list to get started!</p>
                  <button
                    onClick={() => setShowInputs(true)}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
                  >
                    Create List
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lists?.map((list) => (
                  <ListCard {...list} key={list._id} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

// import React from "react";

// export default function ListCard({
//   coverImage,
//   title,
//   createdBy,
//   createdAt,
//   items,
//   tags = [],
//   description,
// }) {
//   return (
//     <div
//       className="flex rounded-2xl shadow-xl overflow-hidden border-2 border-[#2b1b4b] hover:border-[#7000FF] transition-colors duration-200 min-h-[220px] card-bg"
//       style={{
//         background: "linear-gradient(135deg, #23204a 60%, #2e225c 100%)",
//         boxShadow: "0 0 24px 0 rgba(112,0,255,0.12)",
//       }}
//     >
//       {/* coverImage */}
//       <div className="flex-shrink-0 w-48 h-56 bg-[#221a39] flex items-center justify-center">
//         <img
//           src={coverImage}
//           alt={title}
//           className="object-cover w-full h-full rounded-l-2xl"
//           style={{ minWidth: 120, minHeight: 120, maxHeight: 224 }}
//         />
//       </div>

//       {/* Content */}
//       <div className="flex flex-col flex-1 p-6 text-white">
//         <div className="flex items-center justify-between">
//           <h2 className="text-2xl font-bold text-[#A885FF]">{title}</h2>
//           <span className="text-xs text-[#A885FF] bg-[#2b1b4b] px-2 py-1 rounded">
//             {items} item{items !== 1 ? "s" : ""}
//           </span>
//         </div>
//         <div className="text-xs text-[#b3a6d9] mt-1 mb-2">
//           Created by <span className="font-semibold">{createdBy.userName}</span> &middot; {createdAt}
//         </div>
//         <div className="flex flex-wrap gap-2 mb-2">
//           {tags.map((tag, idx) => (
//             <span
//               key={idx}
//               className="bg-[#2b1b4b] text-[#A885FF] text-xs px-2 py-1 rounded-full"
//             >
//               #{tag}
//             </span>
//           ))}
//         </div>
//         <div className="text-base text-[#ded6f3] mt-1">
//           {description}
//         </div>
//       </div>
//     </div>
//   );
// }
import { Calendar, User, Hash, Eye, Users, Lock } from "lucide-react"
import { Link } from 'react-router-dom'

export default function ListCard({
  _id,
  coverImage,
  title,
  createdBy,
  createdAt,
  items,
  tags = [],
  description,
  whoCanView = "public",
}) {
  const getVisibilityIcon = () => {
    switch (whoCanView) {
      case "private":
        return <Lock className="w-3 h-3" />
      case "friends":
        return <Users className="w-3 h-3" />
      default:
        return <Eye className="w-3 h-3" />
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <>
    <Link to={`/lists/${_id}`} className={`block`}>
    <div className="group bg-gray-900 rounded-xl border border-gray-800 overflow-hidden hover:border-gray-600 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10">
      {/* coverImage Section */}
      <div className="relative aspect-video bg-gray-800 overflow-hidden">
        {coverImage ? (
          <img
            src={coverImage || "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <Hash className="w-12 h-12 text-gray-600" />
          </div>
        )}

        {/* Overlay with item count */}
        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1">
          <span className="text-xs font-semibold text-white">
            {items} item{items !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Visibility indicator */}
        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm rounded-lg p-1.5">
          <div className="text-gray-300">{getVisibilityIcon()}</div>
        </div>

        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
          {title}
        </h3>

        {/* Creator and Date Info */}
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span className="font-medium text-gray-300">{createdBy?.userName || createdBy}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(createdAt)}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">{description}</p>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 4).map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 bg-purple-600/20 text-purple-300 text-xs px-2 py-1 rounded-full border border-purple-600/30 hover:bg-purple-600/30 transition-colors"
              >
                <Hash className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
            {tags.length > 4 && <span className="text-xs text-gray-500 px-2 py-1">+{tags.length - 4} more</span>}
          </div>
        )}
      </div>

      {/* Bottom border accent */}
      <div className="h-1 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
    </Link>
    </>
  )
}

import { useState } from 'react'
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable'
import WindowButton from '~/components/WindowButton'

export default function BrowserIndex() {
  const [position, setPosition] = useState({ x: 100, y: -200 })
  const [isMaximized, setIsMaximized] = useState(false)

  const handleDrag = (e: DraggableEvent, data: DraggableData) => {
    if (!isMaximized) {
      setPosition({ x: data.x, y: data.y })
    }
  }

  const handleMaximize = () => {
    setIsMaximized(!isMaximized)
    if (!isMaximized) {
      setPosition({ x: 0, y: 0 })
    } else {
      setPosition({ x: 100, y: -200 })
    }
  }

  const handleMinimize = () => {
    setIsMaximized(false)
  }

  const handleClose = () => {
    // Unmount the component
    return null
  }

  return (
    <Draggable
      handle=".handle"
      position={isMaximized ? { x: 0, y: 0 } : position}
      onDrag={handleDrag}
      disabled={isMaximized}
    >
      <div
        className={`absolute flex flex-col border-2 border-white bg-windows-gray-primary shadow-md ${
          isMaximized ? 'left-0 top-0 h-full w-full' : 'h-3/4 w-3/4'
        }`}
      >
        {/* Title bar */}
        <div className="handle flex h-6 cursor-move items-center justify-between bg-windows-blue px-1 text-white">
          <div className="flex items-center">
            <img
              src="/html-0.png"
              alt="Browser icon"
              className="mr-1 h-4 w-4"
            />
            <span className="font-micro text-xl">Portfolio Hub</span>
          </div>
          <div className="flex items-center">
            <WindowButton
              onClick={handleMinimize}
              imageName="/minimize.png"
              imageAlt="Minimize"
            ></WindowButton>
            <WindowButton
              onClick={handleMaximize}
              imageName="/maximize.png"
              imageAlt="Maximize"
            ></WindowButton>
            <WindowButton
              onClick={handleClose}
              imageName="/close.png"
              imageAlt="Close"
            ></WindowButton>
          </div>
        </div>

        {/* Content area with padding and shadow */}
        <div className="flex-grow bg-windows-gray-primary p-1 shadow-inner">
          <div className="h-full overflow-auto bg-white p-4">
            <h1 className="mb-4 text-2xl font-bold">Welcome to Ppconde OS</h1>
            <p className="mb-2">
              This is a simulated Windows 98-style browser window.
            </p>
            <p>Explore the desktop icons and start menu for more features!</p>
          </div>
        </div>

        {/* Status bar */}
        <div className="flex h-5 items-center justify-between border-t border-gray-600 bg-windows-gray-primary px-2 text-xs">
          <span>Done</span>
          <span>My Computer</span>
        </div>
      </div>
    </Draggable>
  )
}

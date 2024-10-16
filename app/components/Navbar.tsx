import Start from './Start'

export default function Navbar() {
  return (
    <nav className="fixed bottom-0 left-0 flex h-8 w-full items-center bg-windows-gray-primary px-1">
      <div className="h-[80%]">
        <Start />
      </div>
    </nav>
  )
}

import WebGLCanvas from './components/WebGLCanvas'

export default function App() {
  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gray-900">
      <div className="aspect-square w-[min(100vw,100vh)]">
        <WebGLCanvas />
      </div>
    </div>
  )
}

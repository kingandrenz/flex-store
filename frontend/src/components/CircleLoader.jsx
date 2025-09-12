import { Circles } from "react-loader-spinner";

function CircleLoader() {
  return (
    <div className="min-h-screen w-full flex justify-center items-center">
      <Circles 
        height={120}
        width={120}
        color="rgba(127, 29,29)"
        visible={true}
      />
    </div>
  )
}

export default CircleLoader

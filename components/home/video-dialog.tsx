export function VideoDialog() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="hidden sm:block">
        <video
          src="/home/portfoliofy-demo.mp4"
          autoPlay
          loop
          muted
          className="rounded-3xl w-[1300px] mx-auto shadow-lg"
        />
      </div>
      <div className="block sm:hidden">
        <video
          src="/home/portfoliofy-mobile-demo.mp4"
          autoPlay
          loop
          muted
          className="rounded-3xl w-11/12 max-w-xl mx-auto shadow-lg"
        />
      </div>
    </div>
  );
}

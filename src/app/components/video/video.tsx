import "./video.css"

export default function VideoComponet() {
    return (
        <section className="py-8 px-4">
            <div className="mx-auto w-full md:w-9 lg:w-7">
                <div className="video-container">
                    {/* Overlay com botão */}
                    <div className="flex flex-column h-full align-items-center justify-content-center">
                        <button
                            // onClick={() => setIsVideoPlaying(true)}
                            className="w-4rem h-4rem border-circle flex align-items-center justify-content-center bg-white-alpha-20 hover:bg-white-alpha-30 transition-all"
                        >
                            <i className="pi pi-play text-4xl" />
                        </button>
                    </div>
                </div>
            </div>
        </section>

    )
}
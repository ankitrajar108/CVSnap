import Image from "next/image";
import Link from "next/link";

export default function Pitch1() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-mainBlack text-white">
      <div className="max-w-section mx-auto px-section">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-semibold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl mb-4 leading-tight">
            92% of Customers
            <span className="block mt-2 md:mt-4">
              Recommend Our AI Headshots
            </span>
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="border border-cyan-400/30 bg-gray-900/50 rounded-2xl shadow-xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-no-repeat bg-center bg-cover opacity-5" style={{backgroundImage: 'url(/path-to-grid-background.svg)'}}></div>
            <div className="absolute inset-0 bg-mainBlack bg-opacity-5 rounded-2xl"></div>
            <div className="p-8 relative">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-extrabold flex items-center text-white">
                  <svg
                    className="w-12 h-12 mr-4 text-cyan-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  With CVSNAP
                </h2>
                <div className="bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 font-bold py-2 px-3 text-sm sm:text-base sm:px-4 rounded-lg whitespace-nowrap">
                  Studio Quality
                </div>
              </div>
              <ol className="space-y-6">
                {[
                  [
                    "Upload your images",
                    "2 minutes",
                    "Choose from your existing photos or capture new selfies on the spot.",
                  ],
                  [
                    "Our AI works its magic",
                    "1-2 hours",
                    "Our AI will pull your most photogenic qualities from the photos you uploaded.",
                  ],
                  [
                    "Select your top picks",
                    "",
                    "It's that simple! Choose your favorites and enjoy your new professional portraits.",
                  ],
                ].map((item, index) => (
                  <li
                    key={index}
                    className="bg-white/5 p-6 rounded-xl border border-white/10 shadow-lg transition-all duration-300 hover:shadow-xl hover:bg-white/10 hover:border-white/20"
                  >
                    <div className="flex items-center mb-3">
                      <span className="font-black text-4xl text-cyan-400 mr-4">
                        {index + 1}
                      </span>
                      <h3 className="font-bold text-xl text-white">
                        {item[0]}
                      </h3>
                    </div>
                    {item[1] && (
                      <p className="font-semibold text-gray-400 mb-2">
                        ({item[1]})
                      </p>
                    )}
                    <p className="text-gray-300 text-lg">{item[2]}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="bg-gray-900/50 border border-white/10 rounded-2xl shadow-lg overflow-hidden opacity-80 hover:opacity-100 transition-all duration-300">
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-8 flex items-center text-gray-400">
                <svg
                  className="w-10 h-10 mr-3 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Traditional photoshoot
              </h2>
              <ul className="space-y-4">
                {[
                  "Spend hours finding photographer",
                  "Reach out and await their response",
                  "Spend a meeting to find a convenient time",
                  "Spend hours on clothing and makeup",
                  "Travel to the photographer's studio",
                  "Do the shootings that take hours",
                  "Wait days for the delivery of your edited photos",
                  "Pay a lot of money for the photoshoot",
                ].map((step, index) => (
                  <li
                    key={index}
                    className="flex items-center bg-white/5 p-4 rounded-lg border border-white/10 shadow-md transition-all duration-300 hover:shadow-lg hover:bg-white/10"
                  >
                    <span className="font-semibold text-gray-500 mr-3">
                      {index + 1}.
                    </span>
                    <span className="text-gray-300 text-lg">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center mb-12">
          <Link
            href="/signup"
            className="inline-block bg-gradient-to-br from-cyan-400 to-blue-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
          >
            Generate Your AI Headshots Now
          </Link>
        </div>

        <div className="text-center max-w-xl mx-auto">
          <div className="flex justify-center items-center mb-2">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="w-6 h-6 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
          <p className="italic mb-2">
            &quot;I upgraded my profile picture using this service. It&apos;s
            more affordable than a studio session, yet the quality surpasses a
            home photoshoot.&quot;
          </p>
          <div className="flex items-center justify-center">
            {/* <Image
              src="/placeholder.svg"
              alt="User"
              width={32}
              height={32}
              className="rounded-full mr-2"
            /> */}
            <span className="font-semibold">Alexander</span>
          </div>
        </div>
      </div>
    </section>
  );
}

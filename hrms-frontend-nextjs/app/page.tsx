import NavigateButton from "@/components/NavigateButton/NavigateButton";

export default function LandingPage() {
  return (
    <>
      <header className="mt-12 bg-gray-300 mb-10">
        <h1 className="text-center text-5xl font-bold">
          Landing page in progress ...
        </h1>
      </header>
      <div className="flex flex-wrap justify-center gap-6 mt-10 font-semibold">
        <NavigateButton
          href="/login"
          className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transform transition-transform hover:scale-110"
        >
          Login
        </NavigateButton>
        <NavigateButton
          href="/admin"
          className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transform transition-transform hover:scale-110"
        >
          Admin Home
        </NavigateButton>
      </div>
    </>
  );
}

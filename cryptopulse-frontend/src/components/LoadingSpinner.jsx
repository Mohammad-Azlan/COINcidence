const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin"></div>
        <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <div className="ml-4 text-gray-300">
        <p className="text-lg font-semibold">Analyzing sentiment...</p>
        <p className="text-sm text-gray-400">Processing social media data</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;

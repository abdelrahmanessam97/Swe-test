const Loading = () => {
  return (
    <div className="h-[calc(100vh-200px)] flex items-center justify-center bg-white">
      <img src="/main_logo.gif" alt="Logo Loader" className="w-[236px] h-[102px] animate-vanishPulse" />
    </div>
  );
};

export default Loading;

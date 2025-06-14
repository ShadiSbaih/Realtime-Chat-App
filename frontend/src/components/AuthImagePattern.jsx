const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      <div className="max-w-md text-center">
        <div className="grid grid-cols-5 gap-3 mb-8">
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-2xl bg-primary transition-all duration-1000 animate-pulse "
                }`}
              style={{

                animationDelay: i % 2 === 0 ? `${i * 200}ms` : `${i * 100}ms`
              }}
            />
          ))}
        </div>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-base-content/60">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
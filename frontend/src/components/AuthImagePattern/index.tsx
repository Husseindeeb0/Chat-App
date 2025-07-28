import type { AuthImagePatternProps } from "../../types";

const AuthImagePattern = ({ title, subtitle }: AuthImagePatternProps) => {
  return (
    <div className="hidden max-h-screen lg:flex items-center justify-center bg-base-200 pt-2 px-10 mt-16">
      <div className="max-w-md text-center">
        <div className="grid grid-cols-3 gap-2 mb-2">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square w-36 max-h-32 rounded-2xl bg-primary/10 ${
                i % 2 === 0 ? "animate-pulse" : ""
              }`}
            />
          ))}
        </div>
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-base-content/60">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;

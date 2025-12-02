import { LoaderIcon } from "../icons";
import { Input } from "../ui";

interface ResetPasswordConfirmContentProps {
  userEmail: string;
  password: string;
  setPassword: (password: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  isLoading: boolean;
  error: string;
  token: string | null;
  handleSubmit: (e: React.FormEvent) => void;
}

export default function ResetPasswordConfirmContent({
  userEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  isLoading,
  error,
  token,
  handleSubmit,
}: ResetPasswordConfirmContentProps) {
  return (
    <div className="w-full max-w-[440px] space-y-8">
      <div className="text-left">
        <h2 className="mb-3 text-[18px] font-normal text-design-black">
          {userEmail || 'Reset Password'}
        </h2>
        <h2 className="mb-6 text-[29px] font-bold text-design-black md:mb-4 md:font-semibold lg:text-[32px]">
          Choose a new password
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 pt-10">
        <div className="flex flex-col gap-3 md:flex-row md:gap-4">
          <div className="relative w-full">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={isLoading || !token}
              className="h-12 w-full rounded-lg border-0 bg-[#F5F5F5] px-4 pr-[76px] text-base outline-none placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 flex h-8 w-[60px] -translate-y-1/2 items-center justify-center rounded bg-white text-xs font-semibold text-black shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition-all hover:bg-gray-50 active:scale-95 active:bg-gray-200 active:shadow-none"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={isLoading || !token || !password}
          className="flex w-full items-center justify-center gap-3 rounded-lg bg-design-black px-6 py-3 text-sm font-semibold tracking-tight text-white shadow-lg transition-all duration-300 ease-out hover:bg-design-black/80 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? (
            <>
              <LoaderIcon />
            </>
          ) : (
            'Save Password'
          )}
        </button>
      </form>
    </div>
  );
}

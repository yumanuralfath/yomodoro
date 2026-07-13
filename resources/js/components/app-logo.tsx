import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-red-600 text-white shadow-sm shadow-red-600/20">
                <AppLogoIcon className="size-5 text-white" />
            </div>
            <div className="ml-2.5 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                    Yomodoro
                </span>
            </div>
        </>
    );
}

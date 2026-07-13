import { Head, Link } from '@inertiajs/react';
import { Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { login } from '@/routes';

type Props = {
    email?: string;
};

export default function RegisterSuccess({ email }: Props) {
    return (
        <>
            <Head title="Verify Email" />

            <div className="flex flex-col items-center justify-center gap-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400">
                    <Mail className="h-8 w-8" />
                </div>

                <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                        We've sent a verification link to:
                    </p>
                    <p className="font-semibold text-neutral-900 dark:text-neutral-50 break-all">
                        {email || 'your email address'}
                    </p>
                </div>

                <div className="rounded-xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 p-4 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-sm">
                    💡 <span className="font-semibold text-neutral-800 dark:text-neutral-200">Tidak menerima email?</span> Silakan periksa folder <span className="font-semibold text-red-600 dark:text-red-400">Spam</span> atau <span className="font-semibold text-red-600 dark:text-red-400">Junk Mail</span> Anda. Email verifikasi terkadang bisa tersaring ke sana.
                </div>

                <Button asChild className="w-full mt-2">
                    <Link href={login()}>
                        Back to Login <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </div>
        </>
    );
}

RegisterSuccess.layout = {
    title: 'Check your email',
    description: 'We sent a verification link to your email inbox',
};

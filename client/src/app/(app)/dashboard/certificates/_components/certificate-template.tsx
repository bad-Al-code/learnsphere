import { Logo } from '@/components/shared/logo';

// --- PROPS INTERFACE ---
interface CertificateTemplateProps {
  name?: string;
  event?: string;
  company?: string;
  date?: string;
  signerLeft?: string;
  signerLeftRole?: string;
  signerRight?: string;
  signerRightRole?: string;
}

export function CertificateElegant({
  name = 'Adeline Palmerston',
  event = 'Digital Marketing Workshop',
  company = 'Wardiere Company',
  date = '6 June 2025',
  signerLeft = 'Adira Monteiro',
  signerLeftRole = 'Chief Executive Officer',
  signerRight = 'Shohi Takahashi',
  signerRightRole = 'Chief Operating Officer',
}: CertificateTemplateProps) {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="bg-background relative h-[600px] w-[950px] overflow-hidden rounded-xl border shadow-xl">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 h-40 w-40 rounded-tr-3xl border-t-8 border-l-8 border-neutral-800"></div>

          <div className="absolute right-0 bottom-0 h-40 w-40 rounded-bl-3xl border-r-8 border-b-8 border-neutral-800"></div>

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,black,transparent_70%)] opacity-5"></div>
        </div>

        <div className="relative z-10 flex h-full flex-col justify-between px-16 py-12 text-center">
          <div>
            <h1 className="text-3xl font-bold tracking-wide">CERTIFICATE</h1>
            <p className="text-muted-foreground text-sm tracking-[0.25em] uppercase">
              of Completion
            </p>
          </div>

          <div>
            <p className="text-muted-foreground">This is to certify that</p>
            <h2 className="font-[\Dancing Script\,cursive] mt-4 text-5xl">
              {name}
            </h2>

            <p className="text-foreground mx-auto mt-6 max-w-2xl">
              For successfully participating in the{' '}
              <span className="font-semibold">{event}</span> held by {company}{' '}
              on {date}.
            </p>
          </div>

          <div className="mt-12 flex items-center justify-between">
            <div className="text-left">
              <div className="mb-1 h-10 w-40 border-b border-neutral-400"></div>
              <p className="font-semibold">{signerLeft}</p>
              <p className="text-foreground/80 text-xs">{signerLeftRole}</p>
            </div>

            <div className="border-foreground/20 flex h-20 w-20 items-center justify-center rounded-full border-4 shadow-inner">
              <Logo variant="icon" />
            </div>

            <div className="text-right">
              <div className="mb-1 ml-auto h-10 w-40 border-b border-neutral-400"></div>
              <p className="font-semibold">{signerRight}</p>
              <p className="text-foreground/80 text-xs">{signerRightRole}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ClassicTemplate({
  name = 'Student Name',
  event = 'Data Science Fundamentals',
  company = 'LearnSphere',
  date = 'August 21, 2025',
  signerLeft = 'John Doe',
  signerLeftRole = 'Lead Instructor',
  signerRight = 'Jane Smith',
  signerRightRole = 'Program Director',
}: CertificateTemplateProps) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border bg-white text-black shadow-lg">
      <div className="absolute top-0 left-0 h-40 w-40 rounded-br-3xl border-t-8 border-l-8 border-neutral-800"></div>
      <div className="absolute right-0 bottom-0 h-40 w-40 rounded-tl-3xl border-r-8 border-b-8 border-neutral-800"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,black,transparent_70%)] opacity-5"></div>
      <div className="relative z-10 flex h-full flex-col justify-between px-16 py-12 text-center">
        <div>
          <h1 className="text-3xl font-bold tracking-wide">CERTIFICATE</h1>
          <p className="text-sm tracking-[0.25em] text-neutral-500 uppercase">
            of Completion
          </p>
        </div>
        <div>
          <p className="text-neutral-500">This is to certify that</p>
          <h2 className="mt-4 font-['Dancing_Script',cursive] text-5xl">
            {name}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-neutral-800">
            For successfully participating in the{' '}
            <span className="font-semibold">{event}</span> held by {company} on{' '}
            {date}.
          </p>
        </div>
        <div className="mt-12 flex items-center justify-between">
          <div className="text-left">
            <div className="mb-1 h-10 w-40 border-b border-neutral-400"></div>
            <p className="font-semibold">{signerLeft}</p>
            <p className="text-xs text-neutral-600">{signerLeftRole}</p>
          </div>
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-neutral-200 shadow-inner">
            <Logo variant="icon" />
          </div>
          <div className="text-right">
            <div className="mb-1 ml-auto h-10 w-40 border-b border-neutral-400"></div>
            <p className="font-semibold">{signerRight}</p>
            <p className="text-xs text-neutral-600">{signerRightRole}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ModernTemplate({
  name = 'Student Name',
  ...props
}: CertificateTemplateProps) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border bg-gray-800 p-2 text-white shadow-lg">
      <div className="flex h-full w-full flex-col justify-between border-4 border-blue-500 p-12 text-center">
        <h1 className="text-4xl font-bold tracking-widest">CERTIFICATE</h1>
        <div>
          <p className="text-gray-300">AWARDED TO</p>
          <h2 className="mt-4 font-serif text-5xl">{name}</h2>
        </div>
        <p className="text-sm text-gray-400">
          For successfully completing the course.
        </p>
      </div>
    </div>
  );
}

export function ElegantTemplate({
  name = 'Student Name',
  ...props
}: CertificateTemplateProps) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border bg-black p-2 text-white shadow-lg">
      <div className="flex h-full w-full flex-col justify-between border-2 border-amber-300 p-12 text-center">
        <h1 className="text-2xl font-light tracking-[0.5em] text-amber-300">
          CERTIFICATE OF ACHIEVEMENT
        </h1>
        <div>
          <p className="text-gray-300">PROUDLY PRESENTED TO</p>
          <h2 className="mt-4 font-['Dancing_Script',cursive] text-6xl text-amber-100">
            {name}
          </h2>
        </div>
        <p className="text-sm text-gray-400">
          In recognition of outstanding dedication and performance.
        </p>
      </div>
    </div>
  );
}

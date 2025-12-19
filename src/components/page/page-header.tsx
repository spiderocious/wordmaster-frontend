interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

/**
 * Page Header Component
 *
 * Displays the page title and optional subtitle with consistent styling.
 *
 * Usage:
 * <PageHeader title="Dashboard" subtitle="Welcome back!" />
 */
export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        {subtitle && (
          <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
        )}
      </div>
    </header>
  );
}

import { PageWithOutlet } from '@components/page/page-with-outlet';
import { PageHeader } from '@components/page/page-header';
import { PageContent } from '@components/page/page-content';
import { FaHome, FaRocket, FaCheckCircle } from '@icons';

/**
 * Home Screen
 *
 * Example feature screen demonstrating the FSD architecture.
 * This shows the proper structure and patterns for building features.
 */
export function HomeScreen() {
  return (
    <PageWithOutlet>
      <PageHeader
        title="Welcome to AlphaGame"
        subtitle="Built with Feature-Sliced Design Architecture"
      />
      <PageContent>
        <div className="space-y-6">
          {/* Hero Section */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center gap-4 mb-6">
              <FaHome className="text-5xl text-blue-600" />
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Home Feature
                </h2>
                <p className="text-gray-600 mt-1">
                  Example implementation following FSD principles
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-start gap-3 text-green-600 mb-4">
                <FaRocket className="text-2xl flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    Ready to Build
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Your project is configured and ready for development.
                    Start building amazing features!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              title="Path Aliases"
              description="Import from @app, @components, @features, @shared, @ui, and @icons"
              icon={<FaCheckCircle className="text-green-500" />}
            />
            <FeatureCard
              title="Tailwind CSS"
              description="Utility-first CSS framework configured and ready to use"
              icon={<FaCheckCircle className="text-green-500" />}
            />
            <FeatureCard
              title="React Router v6"
              description="JSON-based route configuration for easy route management"
              icon={<FaCheckCircle className="text-green-500" />}
            />
            <FeatureCard
              title="Icons Proxy"
              description="All react-icons available through @icons import"
              icon={<FaCheckCircle className="text-green-500" />}
            />
            <FeatureCard
              title="TypeScript"
              description="Full type safety with strict mode enabled"
              icon={<FaCheckCircle className="text-green-500" />}
            />
            <FeatureCard
              title="FSD Architecture"
              description="Feature-Sliced Design for scalable application structure"
              icon={<FaCheckCircle className="text-green-500" />}
            />
          </div>

          {/* Getting Started */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-blue-900 mb-3">
              Getting Started
            </h3>
            <div className="space-y-2 text-blue-800">
              <p>
                <strong>1.</strong> Create a new feature in{' '}
                <code className="bg-blue-100 px-2 py-1 rounded">
                  src/features/your-feature/
                </code>
              </p>
              <p>
                <strong>2.</strong> Define routes in{' '}
                <code className="bg-blue-100 px-2 py-1 rounded">
                  src/shared/constants/routes.ts
                </code>
              </p>
              <p>
                <strong>3.</strong> Create route configuration in{' '}
                <code className="bg-blue-100 px-2 py-1 rounded">
                  your-feature.routes.ts
                </code>
              </p>
              <p>
                <strong>4.</strong> Register in{' '}
                <code className="bg-blue-100 px-2 py-1 rounded">
                  src/app.routes.ts
                </code>
              </p>
            </div>
          </div>
        </div>
      </PageContent>
    </PageWithOutlet>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-3">
        <div className="text-2xl flex-shrink-0">{icon}</div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
}

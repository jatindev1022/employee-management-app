'use client';

export default function StatsCard({ title, value, icon, color = 'blue', trend }) {
  const colors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500'
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`w-8 h-8 rounded-md ${colors[color]} flex items-center justify-center`}>
            <i className={`${icon} text-white text-lg`}></i>
          </div>
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">{value}</div>
              {trend && (
                <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                  trend.type === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <i className={`${trend.type === 'increase' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'} text-xs mr-1`}></i>
                  {trend.value}
                </div>
              )}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  );
}
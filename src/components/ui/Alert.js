'use client';

export default function Alert({ type = 'info', title, message, onClose }) {
  const types = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'ri-check-circle-line text-green-400',
      title: 'text-green-800',
      text: 'text-green-700'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'ri-error-warning-line text-red-400',
      title: 'text-red-800',
      text: 'text-red-700'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: 'ri-alert-line text-yellow-400',
      title: 'text-yellow-800',
      text: 'text-yellow-700'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'ri-information-line text-blue-400',
      title: 'text-blue-800',
      text: 'text-blue-700'
    }
  };
  
  const config = types[type];
  
  return (
    <div className={`rounded-lg border p-4 ${config.bg} ${config.border}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <i className={`${config.icon} text-xl`}></i>
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`text-sm font-medium ${config.title}`}>
              {title}
            </h3>
          )}
          {message && (
            <div className={`text-sm ${config.text} ${title ? 'mt-2' : ''}`}>
              {message}
            </div>
          )}
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                onClick={onClose}
                className={`inline-flex rounded-md p-1.5 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 ${config.text}`}
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
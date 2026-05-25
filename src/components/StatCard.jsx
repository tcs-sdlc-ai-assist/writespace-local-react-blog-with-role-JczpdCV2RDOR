import React from 'react';
import PropTypes from 'prop-types';

/**
 * StatCard component for displaying a statistic on the admin dashboard.
 * Shows a numeric value, a descriptive label, and an icon with a colored background.
 *
 * @param {Object} props
 * @param {number|string} props.value - The statistic number to display.
 * @param {string} props.label - Descriptive label for the statistic.
 * @param {React.ReactNode} props.icon - Icon element to render inside the colored circle.
 * @param {string} [props.bgColor='bg-indigo-100'] - Tailwind background color class for the icon container.
 * @param {string} [props.textColor='text-indigo-600'] - Tailwind text color class for the icon.
 * @returns {JSX.Element} A styled stat tile card.
 */
function StatCard({ value, label, icon, bgColor, textColor }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div
        className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${bgColor} ${textColor}`}
      >
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        <span className="text-sm text-gray-500">{label}</span>
      </div>
    </div>
  );
}

StatCard.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  bgColor: PropTypes.string,
  textColor: PropTypes.string,
};

StatCard.defaultProps = {
  bgColor: 'bg-indigo-100',
  textColor: 'text-indigo-600',
};

export default StatCard;
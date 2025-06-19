import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    // Add role="status" to announce the loading state
    // aria-live="polite" will inform screen readers of the change when they finish current tasks
    <div role="status" aria-live="polite">
      Loading...
    </div>
  );
};

export default LoadingSpinner;
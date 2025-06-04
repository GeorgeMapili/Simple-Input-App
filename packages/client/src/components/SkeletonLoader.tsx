/**
 * Skeleton loader for submissions list
 */
export function SubmissionsSkeletonLoader() {
  return (
    <div className="submissions-container skeleton">
      <div className="skeleton-header" />
      <ul className="submissions-list skeleton">
        {Array.from({ length: 5 }).map((_, i) => (
          <SubmissionItemSkeleton key={i} />
        ))}
      </ul>
    </div>
  );
}

/**
 * Skeleton loader for individual submission item
 */
function SubmissionItemSkeleton() {
  return (
    <li className="submission-item skeleton">
      <div className="skeleton-line skeleton-text" />
      <div className="skeleton-line skeleton-time" />
    </li>
  );
}

/**
 * Add this to your CSS:
 *
 * .skeleton {
 *   animation: pulse 1.5s ease-in-out infinite;
 * }
 *
 * .skeleton-header {
 *   height: 32px;
 *   width: 140px;
 *   background-color: #e2e8f0;
 *   margin-bottom: 20px;
 *   border-radius: 4px;
 * }
 *
 * .skeleton-line {
 *   background-color: #e2e8f0;
 *   border-radius: 4px;
 *   margin-bottom: 8px;
 * }
 *
 * .skeleton-text {
 *   height: 20px;
 *   width: 90%;
 * }
 *
 * .skeleton-time {
 *   height: 16px;
 *   width: 120px;
 * }
 *
 * @keyframes pulse {
 *   0% {
 *     opacity: 0.6;
 *   }
 *   50% {
 *     opacity: 0.8;
 *   }
 *   100% {
 *     opacity: 0.6;
 *   }
 * }
 */

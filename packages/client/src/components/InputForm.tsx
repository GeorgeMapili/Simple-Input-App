import { useState, useEffect, useCallback } from "react";
import { trpc } from "../utils/api";
import toast from "react-hot-toast";
import {
  type InputItem,
  formatDate,
  truncateText,
  INPUT_CONSTRAINTS,
} from "shared";
import { SubmissionsSkeletonLoader } from "./SkeletonLoader";

// Debounce function for autosave
const debounce = <T extends (...args: any[]) => any>(fn: T, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

export function InputForm() {
  const [inputText, setInputText] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [cursor, setCursor] = useState<number | undefined>(undefined);

  // Get saved draft from localStorage on initial load
  useEffect(() => {
    const savedDraft = localStorage.getItem("inputDraft");
    if (savedDraft) {
      setInputText(savedDraft);
    }
  }, []);

  const utils = trpc.useContext();

  const {
    data,
    isLoading: isLoadingInputs,
    error: fetchError,
    isFetching,
  } = trpc.getInputs.useQuery(
    {
      limit: 10,
      cursor,
    } as any,
    {
      retry: 1,
      onError: (err) => {
        console.error("Failed to fetch inputs:", err);
        toast.error("Failed to load submissions");
      },
      // Keep previous data while fetching new data
      keepPreviousData: true,
    }
  );

  const createInput = trpc.createInput.useMutation({
    onMutate: async (newInput) => {
      // Cancel any outgoing refetches
      await utils.getInputs.cancel();

      // Snapshot the previous value
      const previousData = utils.getInputs.getData({ limit: 10 } as any);

      // Optimistically update to the new value
      utils.getInputs.setData({ limit: 10 } as any, (old: any) => {
        if (!old) return old;

        const optimisticInput = {
          id: Date.now(), // Temporary ID
          text: newInput.text,
          createdAt: new Date().toISOString(),
        };

        return {
          ...old,
          items: [optimisticInput, ...old.items],
        };
      });

      return { previousData };
    },
    onSuccess: () => {
      setInputText("");
      localStorage.removeItem("inputDraft");
      setLastSaved(null);

      // Show success toast
      toast.success("Successfully submitted!");

      // Reset cursor and invalidate query to refetch
      setCursor(undefined);
      utils.getInputs.invalidate();
    },
    onError: (err, _, context) => {
      if (context?.previousData) {
        utils.getInputs.setData({ limit: 10 } as any, context.previousData);
      }

      console.error("Failed to create input:", err);
      toast.error("Failed to save: " + (err.message || "Connection error"));
      setError(`Failed to save: ${err.message || "Connection error"}`);
    },
    onSettled: () => {
      // Always refetch after error or success
      utils.getInputs.invalidate();
    },
  });

  // Autosave draft to localStorage
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const saveInputDraft = useCallback(
    debounce((text: string) => {
      if (text.trim()) {
        localStorage.setItem("inputDraft", text);
        setIsSaving(false);
        setLastSaved(new Date());
      } else {
        localStorage.removeItem("inputDraft");
        setLastSaved(null);
      }
    }, 1000),
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setInputText(newText);
    setIsSaving(true);
    saveInputDraft(newText);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input before submitting
    if (!inputText.trim()) {
      setError("Input cannot be empty");
      toast.error("Input cannot be empty");
      return;
    }

    if (inputText.length > INPUT_CONSTRAINTS.MAX_LENGTH) {
      const errorMsg = `Input must be less than ${INPUT_CONSTRAINTS.MAX_LENGTH} characters`;
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setError("");
    createInput.mutate({ text: inputText });
  };

  const loadMore = () => {
    if (data?.nextCursor) {
      setCursor(data.nextCursor);
    }
  };

  // Show connection error if there's a problem with the API
  const connectionError = fetchError ? (
    <div className="connection-error">
      <h3>Connection Error</h3>
      <p>Could not connect to the server. Please check if:</p>
      <ul>
        <li>The server is running (npm run dev:server)</li>
        <li>The database is running (npm run db:up)</li>
        <li>You've run migrations (npm run prisma:migrate)</li>
      </ul>
      <p className="error-message">{fetchError.message}</p>
    </div>
  ) : null;

  return (
    <div className="container">
      <h1>Simple Input App</h1>

      {connectionError}

      <form onSubmit={handleSubmit} className="input-form">
        <div className="input-container">
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            placeholder="Enter your text..."
            className="text-input"
            maxLength={INPUT_CONSTRAINTS.MAX_LENGTH}
          />
          <button
            type="submit"
            className="submit-button"
            disabled={createInput.isLoading || !!fetchError}
          >
            {createInput.isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>

        {/* Autosave indicator */}
        <div className="autosave-indicator">
          {isSaving ? (
            <span className="saving">Saving draft...</span>
          ) : lastSaved ? (
            <span className="saved">
              Draft saved at {formatDate(lastSaved)}
            </span>
          ) : null}
        </div>

        {error && <div className="error-message">{error}</div>}

        {createInput.error && (
          <div className="error-message">
            {createInput.error.message || "An error occurred"}
          </div>
        )}
      </form>

      {!fetchError &&
        (isLoadingInputs && !data ? (
          <SubmissionsSkeletonLoader />
        ) : (
          <>
            <SubmissionsList inputs={data?.items || []} />

            {/* Load more button */}
            {data?.nextCursor && (
              <div className="load-more-container">
                <button
                  onClick={loadMore}
                  disabled={isFetching}
                  className="load-more-button"
                >
                  {isFetching ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </>
        ))}
    </div>
  );
}

interface SubmissionsListProps {
  inputs: InputItem[];
}

function SubmissionsList({ inputs }: SubmissionsListProps) {
  return (
    <div className="submissions-container">
      <h2>Submissions</h2>

      {inputs.length === 0 ? (
        <p className="no-submissions">No submissions yet</p>
      ) : (
        <ul className="submissions-list">
          {inputs.map((input) => (
            <SubmissionItem key={input.id} input={input} />
          ))}
        </ul>
      )}
    </div>
  );
}

interface SubmissionItemProps {
  input: InputItem;
}

// Export the component so it can be tested
export function SubmissionItem({ input }: SubmissionItemProps) {
  return (
    <li className="submission-item">
      <div className="submission-text">{truncateText(input.text, 150)}</div>
      <div className="submission-time">{formatDate(input.createdAt)}</div>
    </li>
  );
}

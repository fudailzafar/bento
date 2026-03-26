import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PageData, UserProfile } from '@/lib/server';
import { PageDataSchema } from '@/lib';
import { useRouter } from 'next/navigation';

const fetchPage = async (): Promise<{ page: PageData | undefined }> => {
  const response = await fetch('/api/page');
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch page');
  }
  return await response.json();
};

const fetchUsername = async (): Promise<{ username: string }> => {
  const response = await fetch('/api/username');
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch username');
  }
  return await response.json();
};

const fetchUserProfile = async (): Promise<{
  profile: UserProfile | undefined;
}> => {
  const response = await fetch('/api/user/profile');
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch user profile');
  }
  return await response.json();
};

const checkUsernameAvailability = async (
  username: string
): Promise<{ available: boolean }> => {
  const response = await fetch(
    `/api/check-username?username=${encodeURIComponent(username)}`,
    { method: 'POST' }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to check username availability');
  }
  return await response.json();
};

export function usePageActions() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const pageQuery = useQuery({
    queryKey: ['page'],
    queryFn: fetchPage,
  });

  const usernameQuery = useQuery({
    queryKey: ['username'],
    queryFn: fetchUsername,
  });

  const userProfileQuery = useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile,
  });

  const internalUsernameUpdate = async (newUsername: string) => {
    const response = await fetch('/api/username', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: newUsername }),
    });

    if (!response.ok) {
      const error = await response.json();
      return Promise.reject(error);
    }

    return { success: true };
  };

  const updateUsernameMutation = useMutation({
    mutationFn: internalUsernameUpdate,
    onSuccess: (data, newUsername) => {
      queryClient.invalidateQueries({ queryKey: ['username'] });
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', `/${newUsername}`);
      }
    },
    throwOnError: false,
  });

  const checkUsernameMutation = useMutation({
    mutationFn: checkUsernameAvailability,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['username-availability'] });
    },
  });

  const savePageChanges = async (newPageData: PageData) => {
    try {
      PageDataSchema.parse(newPageData);

      const response = await fetch('/api/page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPageData),
      });

      if (!response.ok) {
        const error = await response.json();
        const message =
          typeof error === 'object' && error !== null
            ? (error.error || 'Unknown error') +
              (error.details ? ': ' + JSON.stringify(error.details) : '')
            : String(error);
        throw new Error(message);
      }

      return { success: true };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Validation failed: ${error.message}`);
      }
      throw error;
    }
  };

  const savePageMutation = useMutation({
    mutationFn: savePageChanges,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page'] });
    },
  });

  return {
    pageQuery,
    usernameQuery,
    updateUsernameMutation,
    checkUsernameMutation,
    savePageMutation,
    userProfileQuery,
  };
}

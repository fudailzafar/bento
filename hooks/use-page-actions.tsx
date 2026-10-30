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

// Posts the page. `keepalive` lets the request finish after the tab closes.
export async function postPage(page: PageData, keepalive = false) {
  PageDataSchema.parse(page);
  const response = await fetch('/api/page', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(page),
    keepalive,
  });
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(
      (error && typeof error === 'object' && error.error) || 'Failed to save'
    );
  }
}

export function usePageActions() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const pageQuery = useQuery({
    queryKey: ['page'],
    queryFn: fetchPage,
    // Loaded once: the editor owns the page from then on.
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
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

  const savePageMutation = useMutation({
    mutationFn: (page: PageData) => postPage(page),
    // The editor keeps its own copy while editing; only the cache is
    // updated, so no refetch ever replaces what is being typed.
    onSuccess: (_data, page) => {
      queryClient.setQueryData(['page'], { page });
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

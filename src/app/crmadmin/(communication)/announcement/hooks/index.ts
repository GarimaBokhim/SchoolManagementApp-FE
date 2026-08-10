import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { Toast } from '@/components/Toast/toast'
import { AddAnnouncementPayload, AddAnnouncementResponse, AnnouncementResponse, IPin, IPublish, PinRequest, PublishRequest, UpdateAnnouncementPayload } from '../types/IAnnouncement'
import { IPaginationCrmResponse } from '@/types/IPaginationResponse'


export const AnnouncementEndpoints = {
  filter: '/api/CrmCommunication/FilterAnnouncement',
  add: '/api/CrmCommunication/AddAnnouncement',
  update: '/api/CrmCommunication/UpdateAnnouncement',
  delete: '/api/CrmCommunication/DeleteAnnouncement',
  publish: '/api/CrmCommunication/PublishAnnouncement',
  unpublish: '/api/CrmCommunication/UnPublishAnnouncement',
  getById:'/api/CrmCommunication/Announcement',
  pin:'/api/CrmCommunication/PinAnnouncement',
  unPin:'/api/CrmCommunication/UnPinAnnouncement'
}


export const AnnouncementQueryKeys = {
  all: ['Announcement']
}

const normalizePinPayload = (data: IPin): PinRequest => ({
  announcementId: String(data.announcementId ?? '').trim()
});

const normalizeUnPinPayload = (data: IPin): PinRequest => ({
  announcementId: String(data.announcementId ?? '').trim()
});

const normalizePublishPayload = (data: IPublish): PublishRequest => ({
  announcementId: String(data.announcementId ?? '').trim()
});

const normalizeUnPublishPayload = (data: IPublish): PublishRequest => ({
  announcementId: String(data.announcementId ?? '').trim()
});




const normalizeUpdateAnnouncementPayload = (data: UpdateAnnouncementPayload): UpdateAnnouncementPayload => ({
  id: String(data.id ?? '').trim(),
  title: String(data.title ?? '').trim(),
  description: String(data.description ?? '').trim(),
  announcementPriority: data.announcementPriority ?? 0
});


const normalizeAnnouncementPayload = (data: AddAnnouncementPayload): AddAnnouncementPayload => ({
  title: String(data.title ?? '').trim(),
  description: String(data.description ?? '').trim(),
  announcementPriority: data.announcementPriority ?? 0
});


export const usePinAnnouncement = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: PinRequest) => {
      const normalizedPayload = normalizePinPayload(payload)

      const response = await api.post<IPaginationCrmResponse<IPin>>(
        AnnouncementEndpoints.pin,
        normalizedPayload
      )

      return response.data
    },

    onSuccess: (response) => {
    //   Toast.success(response?.Message || 'Announcement Pinned successfully')

      queryClient.invalidateQueries({
        queryKey: AnnouncementQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to Pinned Announcement'
      )
    },
  })
};

export const useUnPinAnnouncement = () => {
   const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: PinRequest) => {
      const normalizedPayload = normalizeUnPinPayload(payload)

      const response = await api.post<IPaginationCrmResponse<IPin>>(
        AnnouncementEndpoints.unPin,
        normalizedPayload
      )

      return response.data
    },

    onSuccess: (response) => {
    //   Toast.success(response?.Message || 'Announcement UnPin successfully')

      queryClient.invalidateQueries({
        queryKey: AnnouncementQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to UnPin Announcement'
      )
    },
  })
};



export const usePublishAnnouncement = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: PublishRequest) => {
      const normalizedPayload = normalizePublishPayload(payload)

      const response = await api.post<IPaginationCrmResponse<IPublish>>(
        AnnouncementEndpoints.publish,
        normalizedPayload
      )

      return response.data
    },

    onSuccess: (response) => {
    //   Toast.success(response?.Message || 'Announcement published successfully')

      queryClient.invalidateQueries({
        queryKey: AnnouncementQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to published Announcement'
      )
    },
  })
};

export const useUnPublishAnnouncement = () => {
   const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: PublishRequest) => {
      const normalizedPayload = normalizeUnPublishPayload(payload)

      const response = await api.post<IPaginationCrmResponse<IPublish>>(
        AnnouncementEndpoints.unpublish,
        normalizedPayload
      )

      return response.data
    },

    onSuccess: (response) => {
    //   Toast.success(response?.Message || 'Announcement Unpublished successfully')

      queryClient.invalidateQueries({
        queryKey: AnnouncementQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to Unpublished Announcement'
      )
    },
  })
};

export const useGetAllAnnouncement = (queryParams?: string) => {
    return useQuery({
        queryKey: [...AnnouncementQueryKeys.all, queryParams],

        queryFn: async () => {
            const params = Object.fromEntries(
                new URLSearchParams(queryParams?.replace(/^&/, "") || "")
            );

            const response = await api.get(
                AnnouncementEndpoints.filter,
                { params }
            );

            return response.data;
        },

        select: (response) => ({
            items: response?.Data?.Items ?? [],
            pagination: {
                totalItems: response?.Data?.TotalItems ?? 0,
                pageIndex: response?.Data?.PageIndex ?? 1,
                pageSize: response?.Data?.PageSize ?? 10,
                totalPages: response?.Data?.TotalPages ?? 1,
            },
        }),

        staleTime: 0,
        refetchOnMount: "always",
        refetchOnWindowFocus: true,
    });
};


export const useAddAnnouncement = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: AddAnnouncementPayload) => {
      const normalizedPayload = normalizeAnnouncementPayload(payload)

      const response = await api.post<IPaginationCrmResponse<AddAnnouncementResponse>>(
        AnnouncementEndpoints.add,
        normalizedPayload
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'Announcement added successfully')

      queryClient.invalidateQueries({
        queryKey: AnnouncementQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to add Announcement'
      )
    },
  })
}


export const useDeleteAnnouncement = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(
        `${AnnouncementEndpoints.delete}/${id}`
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'Announcement deleted successfully')

      queryClient.invalidateQueries({
        queryKey: AnnouncementQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to delete Announcement'
      )
    },
  })
}

export const useUpdateAnnouncement = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateAnnouncementPayload
    }) => {
      const response = await api.patch(
        `${AnnouncementEndpoints.update}/${id}`,
        normalizeUpdateAnnouncementPayload(payload)
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'Announcement updated successfully')

      queryClient.invalidateQueries({
        queryKey: AnnouncementQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to update Announcement'
      )
    },
  })
}


export const useAnnouncementById = (AnnouncementId: string) => {
  return useQuery({
    queryKey: ["AnnouncementId", AnnouncementId],

    queryFn: async (): Promise<AnnouncementResponse> => {
      if (!AnnouncementId) {
        throw new Error("Id is required to get Announcement");
      }

      const response = await api.get<AnnouncementResponse>(
        `${AnnouncementEndpoints.getById}/${AnnouncementId}`
      );

      return response.data;
    },

    staleTime: 0,
    gcTime: 0, // 
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};



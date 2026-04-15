import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { IDisplayNotice, INotice, IPublish } from "../types/INotice";

const NoticeEndPoints = {
  getAllNotices: "/api/Communication/all-Notice",
  createNotices: "/api/Communication/AddNotice",
  getNoticesById: "/api/Communication/NoticesBy",
  publishNotice: "/api/Communication/PublishNotice",
  unPublishNotice: "/api/Communication/UnPublishNotice",
  filterNoticeByDate: "/api/Communication/FilterNotice",
  DisplayNotice: "/api/Communication/DisplayNotice",
  updateNotice: "/api/Communication/UpdateNotice",
  deleteNotice: "/api/Communication/DeleteNotice",
};

const queryKey = "Notice";
const filterQueryKey = "filteredNotice";
const publishQuery = "publish";
const unPublishQuery = "unPublish";

type NoticeRequest = {
  id?: string;
  title: string;
  contentHtml: string;
  shortDescription: string;
};

type UpdateNoticeRequest = {
  id: string;
  title: string;
  contentHtml: string;
  shortDescription: string;
  modifiedBy: string;
  modifiedAt: string;
};

type PublishRequest = {
  noticeId: string;
};

export const useAddNotice = () => {
  const queryClient = useQueryClient();
  return useMutation<INotice, Error, NoticeRequest>({
    mutationFn: async (formData: NoticeRequest): Promise<INotice> => {
      const response = await api.post(NoticeEndPoints.createNotices, formData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({ queryKey: [filterQueryKey] });
    },
    onError: (error) => {
      console.error("Error adding Notice:", error);
    },
  });
};

export const useUpdateNotice = () => {
  const queryClient = useQueryClient();
  return useMutation<INotice, Error, UpdateNoticeRequest>({
    mutationFn: async (data: UpdateNoticeRequest): Promise<INotice> => {
      const { id, ...body } = data;
      const response = await api.put(
        `${NoticeEndPoints.updateNotice}/${id}`,
        body
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({ queryKey: [filterQueryKey] });
    },
    onError: (error) => {
      console.error("Error updating Notice:", error);
    },
  });
};

export const useDeleteNotice = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (id: string): Promise<void> => {
      await api.delete(`${NoticeEndPoints.deleteNotice}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({ queryKey: [filterQueryKey] });
    },
    onError: (error) => {
      console.error("Error deleting Notice:", error);
    },
  });
};

export const useGetNoticeById = (NoticeId: string) => {
  return useQuery({
    queryKey: [queryKey, NoticeId],
    queryFn: async (): Promise<INotice> => {
      if (!NoticeId) {
        throw new Error("Id is required to get a Notice");
      }
      const response = await api.get<INotice>(
        `${NoticeEndPoints.getNoticesById}/${NoticeId}`
      );
      return response.data;
    },
    enabled: !!NoticeId,
    staleTime: 0,
    retry: false,
  });
};

export const useGetAllNotices = () => {
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const url = `${NoticeEndPoints.DisplayNotice}`;
      const response = await api.get<IDisplayNotice[]>(url);
      return (
        response.data ?? {
          data: [],
          PageIndex: 0,
          isPagination: 1,
          pageSize: 10,
        }
      );
    },
  });
};

export const useFilterNoticeByDate = (params?: string) => {
  return useQuery({
    queryKey: [filterQueryKey, params, queryKey],
    queryFn: async () => {
      const url = params
        ? `${NoticeEndPoints.filterNoticeByDate}${params}`
        : NoticeEndPoints.filterNoticeByDate;
      const response = await api.get<IPaginationResponse<INotice>>(url);
      return response.data;
    },
    staleTime: 0,
    retry: false,
  });
};

export const usePublishNotice = () => {
  const queryClient = useQueryClient();
  return useMutation<IPublish, Error, PublishRequest>({
    mutationFn: async (data: PublishRequest): Promise<IPublish> => {
      const response = await api.post(NoticeEndPoints.publishNotice, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({ queryKey: [publishQuery] });
      queryClient.invalidateQueries({ queryKey: [filterQueryKey] });
    },
    onError: (error) => {
      console.error("Error publishing Notice:", error);
    },
  });
};

export const useUnPublishNotice = () => {
  const queryClient = useQueryClient();
  return useMutation<IPublish, Error, PublishRequest>({
    mutationFn: async (data: PublishRequest): Promise<IPublish> => {
      const response = await api.post(NoticeEndPoints.unPublishNotice, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({ queryKey: [unPublishQuery] });
      queryClient.invalidateQueries({ queryKey: [filterQueryKey] });
    },
    onError: (error) => {
      console.error("Error unpublishing Notice:", error);
    },
  });
};
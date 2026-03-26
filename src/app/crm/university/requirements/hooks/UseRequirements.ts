// hooks/UseRequirements.ts

import { useState, useEffect } from "react";
import { api } from "@/utils/instance";
import toast from "react-hot-toast";
import { ApiResponse, CourseApiResponse, IRequirement } from "../types/IRequirement";

interface UseRequirementsReturn {
  requirements: IRequirement[];
  filtered: IRequirement[];
  loading: boolean;
  courseMap: Record<string, string>;
  fetchRequirements: (queryParams?: string) => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
}

const useRequirements = (): UseRequirementsReturn => {
  const [requirements, setRequirements] = useState<IRequirement[]>([]);
  const [filtered, setFiltered] = useState<IRequirement[]>([]);
  const [loading, setLoading] = useState(false);
  const [courseMap, setCourseMap] = useState<Record<string, string>>({});

  const fetchCourses = async () => {
    try {
      const res = await api.get<CourseApiResponse>("api/AcademicPrograms/FilterCourse");
      const items = res.data?.Items ?? [];
      const map: Record<string, string> = {};
      items.forEach((c) => { 
        map[String(c.id)] = c.title; 
      });
      setCourseMap(map);
    } catch (error) {
      console.error("Failed to load courses:", error);
      toast.error("Failed to load courses.");
    }
  };

  const fetchRequirements = async (queryParams?: string) => {
    try {
      setLoading(true);
      const paramObj: Record<string, unknown> = {};
      
      if (queryParams) {
        const parsed = new URLSearchParams(queryParams.replace(/^&/, ""));
        parsed.forEach((value, key) => { 
          paramObj[key] = value; 
        });
      }
      
      const res = await api.get<ApiResponse>(
        "api/AcademicPrograms/FilterRequirements",
        { params: paramObj }
      );
      
      const items = res.data?.Items ?? [];
      
      // Map the data to ensure all fields are properly structured
      const mappedItems: IRequirement[] = items.map((item: any) => ({
        id: item.id,
        descriptions: item.descriptions,
        countryId: item.countryId || "",
        courseId: item.courseId,
        createdAt: item.createdAt,
        createdBy: item.createdBy,
        modifiedAt: item.modifiedAt,
        modifiedBy: item.modifiedBy,
        isActive: item.isActive,
        schoolId: item.schoolId,
        DocumentsCheckListDTOs: item.DocumentsCheckListDTOs || []
      }));
      
      setRequirements(mappedItems);
      setFiltered(mappedItems);
    } catch (error) {
      console.error("Failed to load requirements:", error);
      toast.error("Failed to load requirements.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/AcademicPrograms/DeleteRequirement/${id}`);
      toast.success("Requirement deleted successfully!");
      await fetchRequirements();
    } catch (error) {
      console.error("Failed to delete requirement:", error);
      toast.error("Failed to delete requirement.");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchCourses(), fetchRequirements()]);
      setLoading(false);
    };
    loadData();
  }, []);

  return { 
    requirements, 
    filtered, 
    loading, 
    courseMap, 
    fetchRequirements, 
    handleDelete 
  };
};

export default useRequirements;
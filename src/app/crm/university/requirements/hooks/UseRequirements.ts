import { useState, useEffect } from "react";
import { api } from "@/utils/instance";
import toast from "react-hot-toast";

interface RequirementItem {
  id: string;
  descriptions: string;
  courseId: string;
  isActive: boolean;
  schoolId: string;
  createdBy: string;
  createdAt: string;
  modifiedBy: string;
  modifiedAt: string;
}

interface ApiResponse {
  Items: RequirementItem[];
  TotalItems: number;
}

interface Course {
  id: string;
  title: string;
}

interface CourseApiResponse {
  Items: Course[];
}

interface UseRequirementsReturn {
  requirements: RequirementItem[];
  filtered: RequirementItem[];
  loading: boolean;
  courseMap: Record<string, string>;
  fetchRequirements: (queryParams?: string) => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
}

const useRequirements = (): UseRequirementsReturn => {
  const [requirements, setRequirements] = useState<RequirementItem[]>([]);
  const [filtered, setFiltered] = useState<RequirementItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [courseMap, setCourseMap] = useState<Record<string, string>>({});

  const fetchCourses = async () => {
    try {
      const res = await api.get<CourseApiResponse>("api/AcademicPrograms/FilterCourse");
      const items = res.data?.Items ?? [];
      const map: Record<string, string> = {};
      items.forEach((c) => { map[String(c.id)] = c.title; });
      setCourseMap(map);
    } catch {
      toast.error("Failed to load courses.");
    }
  };

  const fetchRequirements = async (queryParams?: string) => {
    try {
      const paramObj: Record<string, unknown> = {};
      if (queryParams) {
        const parsed = new URLSearchParams(queryParams.replace(/^&/, ""));
        parsed.forEach((value, key) => { paramObj[key] = value; });
      }
      const res = await api.get<ApiResponse>(
        "api/AcademicPrograms/FilterRequirements",
        { params: paramObj }
      );
      const items = res.data?.Items ?? [];
      setRequirements(items);
      setFiltered(items);
    } catch {
      toast.error("Failed to load requirements.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/AcademicPrograms/DeleteRequirement/${id}`);
      toast.success("Requirement deleted successfully!");
      await fetchRequirements();
    } catch {
      toast.error("Failed to delete requirement.");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchCourses();
      await fetchRequirements();
      setLoading(false);
    };
    loadData();
  }, []);

  return { requirements, filtered, loading, courseMap, fetchRequirements, handleDelete };
};

export type { RequirementItem };
export default useRequirements;
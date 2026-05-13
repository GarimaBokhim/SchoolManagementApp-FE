"use client";
import { useEffect, useState } from "react";
import { IModules } from "../types/IModules";
import { useGetAllModules } from "../hooks";
import { useForm } from "react-hook-form";
import { EditButton } from "@/components/Buttons/EditButton";
import EditModule from "../pages/Edit";
import DeleteButton from "@/components/Buttons/DeleteButton";
import { useRemoveModule } from "../hooks";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Edit, Plus, Trash } from "lucide-react";
import Pagination from "@/components/Pagination";
import Add from "../pages/Add";

const AllModuleForm = () => {
  const [modal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");

  const buttonElement = (id: string) => {
    return (
      <ButtonElement
        icon={<Edit size={14} />}
        type="button"
        text=""
        onClick={() => {
          setShowModal(true);
          setSelectedId(id);
        }}
        className="!text-xs font-semibold !bg-blue-500 hover:!bg-blue-600"
      />
    );
  };

  const [paginationParams, setPaginationParams] = useState({
    pageSize: 10,
    pageIndex: 1,
    isPagination: true,
  });

  const [addModal, setAddModal] = useState(false);

  // Build query string with pagination params
  const query = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&isPagination=${paginationParams.isPagination}`;

  // Pass query as a dependency to ensure refetch when pagination changes
  const { data: allModules, refetch, isLoading, error } = useGetAllModules(query);

  type SearchParam = {
    pageSize: number;
    pageIndex: number;
    isPagination: boolean;
  };

  const deleteModule = useRemoveModule();

  const handleDelete = async (id: string | undefined) => {
    try {
      await deleteModule.mutateAsync(id);
      // Refetch after successful deletion
      refetch();
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const handleSubmit = useForm<SearchParam>({
    defaultValues: {},
  });

  // Refetch when pagination params change
  useEffect(() => {
    refetch();
  }, [paginationParams.pageSize, paginationParams.pageIndex, paginationParams.isPagination, refetch]);

  const handleSearch = (params: SearchParam) => {
    params.pageSize = paginationParams.pageSize;
    setPaginationParams(params);
  };

  // Debug logging
  console.log("Query string:", query);
  console.log("All modules data:", allModules);
  console.log("Loading state:", isLoading);
  console.log("Error state:", error);
  console.log("Items array:", allModules?.Items);

  return (
    <div className="md:px-4 px-4">
      <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl dark:bg-[#353535]">
        <div className="flex w-full justify-between p-3 px-4 pt-4 items-center">
          <h1 className="text-xl font-semibold">All Modules</h1>
          <ButtonElement
            icon={<Plus size={24} />}
            type="button"
            text="Add New Module"
            onClick={() => setAddModal(true)}
            className="!text-md !font-bold"
          />
        </div>

        {isLoading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-gray-500">Loading modules...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8 text-red-500">
            Error loading modules: {error.message}
          </div>
        )}

        {!isLoading && !error && (
          <table className="min-w-full table-auto text-left border border-gray-200 rounded-xl">
            <thead>
              <tr className="bg-gray-50 dark:text-white text-gray-700 dark:bg-[#80878c] uppercase text-sm font-semibold border-b border-gray-200">
                <th className="py-3 px-4">SN</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Descriptions</th>
                <th className="py-3 px-4">Target URL</th>
                <th className="py-3 px-4">Icon URL</th>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {allModules && allModules?.Items?.length > 0 ? (
                allModules.Items.map((module: IModules, index: number) => (
                  <tr
                    key={module.Id || index}
                    className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors border-b border-gray-100 dark:text-gray-100 text-gray-700"
                  >
                    <td className="py-3 px-4">
                      {(paginationParams.pageIndex - 1) * paginationParams.pageSize + index + 1}
                    </td>
                    <td className="py-3 px-4 font-medium">{module.Name || "N/A"}</td>
                    <td className="py-3 px-4 font-medium">{module.Description || "N/A"}</td>
                    <td className="py-3 px-4">{module.TargetUrl || "-"}</td>
                    <td className="py-3 px-4">{module.IconUrl || "-"}</td>
                    <td className="py-3 px-4">{module.Rank || "-"}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center space-x-3">
                        <DeleteButton
                          headerText={<Trash className="w-4 h-4" />}
                          content="By confirming, you will permanently delete this module. Proceed?"
                          onConfirm={() => handleDelete(module.Id)}
                        />
                        <EditButton button={buttonElement(module.Id ?? "")} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-gray-500 italic">
                    No modules found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {allModules && allModules?.Items?.length > 0 && (
        <Pagination
          form={handleSubmit}
          pagination={{
            currentPage: allModules?.PageIndex ?? 1,
            firstPage: allModules?.FirstPage ?? 1,
            lastPage: allModules?.LastPage ?? 1,
            nextPage: allModules?.NextPage ?? 1,
            previousPage: allModules?.PreviousPage ?? 1,
          }}
          handleSearch={handleSearch}
        />
      )}

      {selectedId && (
        <EditModule
          visible={modal}
          onClose={() => {
            setShowModal(false);
            setSelectedId("");
            refetch(); // Refetch after closing edit modal
          }}
          modulesId={selectedId}
        />
      )}

      <Add
        visible={addModal}
        onClose={() => {
          setAddModal(false);
          refetch(); // Refetch after adding new module
        }}
      />
    </div>
  );
};

export default AllModuleForm;
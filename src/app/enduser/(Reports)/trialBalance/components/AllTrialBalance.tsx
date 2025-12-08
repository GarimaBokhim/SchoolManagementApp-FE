"use client";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useGetTrialBalance } from "../hooks";
import Pagination from "@/components/Pagination";
import React from "react";
import { useGetAllMaster } from "@/app/enduser/(Accountings)/_Master/hooks";
import { useGetAllLedgers } from "@/app/enduser/(Accountings)/Ledger/hooks";
import { useTranslation } from "react-i18next";
import { IFilterTrialBalanceByCompany } from "../types/ITrialBalance";
import { useGetAllSubLedgerGroups } from "@/app/enduser/(Accountings)/_SubLedgerGroup/hooks";

const AllTrialBalanceForm = () => {
  const { t } = useTranslation();
  const [paginationParams, setPaginationParams] = useState({
    pageSize: 10,
    pageIndex: 1,
    isPagination: true,
  });
  const query = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`;
  const { data: allTrialBalance } = useGetTrialBalance(query);
  const [creditTotal, setCreditTotal] = useState(0);
  const [debitTotal, setDebitTotal] = useState(0);

  type SearchParam = {
    pageSize: number;
    pageIndex: number;
    isPagination: boolean;
  };

  const { data: allMasters } = useGetAllMaster();
  const { data: allLedgerGroup } = useGetAllSubLedgerGroups();
  const { data: allLedgers } = useGetAllLedgers();

  const handleSearch = (params: SearchParam) => {
    setPaginationParams((prev) => ({
      ...prev,
      ...params,
    }));
  };

  useEffect(() => {
    if (allTrialBalance?.Items) {
      let debitSum = 0;
      let creditSum = 0;
      allTrialBalance.Items.forEach((item) => {
        debitSum += item.debitAmount;
        creditSum += item.creditAmount;
      });
      setDebitTotal(debitSum);
      setCreditTotal(creditSum);
    }
  }, [allTrialBalance]);

  const handleSubmit = useForm<IFilterTrialBalanceByCompany>({
    defaultValues: {
      companyId: "",
    },
  });

  return (
    <div className="m-6">
      {Array.isArray(allTrialBalance?.Items) &&
      allTrialBalance.Items.length > 0 ? (
        <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="">
              <tr className="bg-gray-50 dark:text-white text-gray-700 dark:bg-[#80878c] uppercase text-sm font-semibold border-b border-gray-200">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
                  {t("Account Type")}
                </th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-700 dark:text-gray-200">
                  {t("Debit")}
                </th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-700 dark:text-gray-200">
                  {t("Credit")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {allTrialBalance.Items.map((item, index) => (
                <React.Fragment key={index}>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-2 font-semibold text-gray-800 dark:text-white">
                      {
                        allMasters?.Items?.find((i) => i.id === item.masterId)
                          ?.Name
                      }
                    </td>
                    <td className="px-4 py-2 text-right text-gray-600 dark:text-gray-300">
                      {item.debitAmount}
                    </td>
                    <td className="px-4 py-2 text-right text-gray-600 dark:text-gray-300">
                      {item.creditAmount}
                    </td>
                  </tr>
                  {item.ledgerGroupLevels.map((group, gIndex) => (
                    <React.Fragment key={gIndex}>
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-8 py-2 text-gray-700 dark:text-gray-400">
                          {
                            allLedgerGroup?.Items?.find(
                              (i) => i.id === group.subLedgerGroupId
                            )?.name
                          }
                        </td>
                        <td className="px-4 py-2 text-right text-gray-500 dark:text-gray-400">
                          {group.debitAmount ?? "-"}
                        </td>
                        <td className="px-4 py-2 text-right text-gray-500 dark:text-gray-400">
                          {group.creditAmount ?? "-"}
                        </td>
                      </tr>
                      {group.ledgersLevels.map((ledger, lIndex) => (
                        <tr
                          key={lIndex}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <td className="px-12 py-2 text-gray-600 dark:text-gray-300">
                            {
                              allLedgers?.Items?.find(
                                (i) => i.id === ledger.ledgerId
                              )?.name
                            }
                          </td>
                          <td className="px-4 py-2 text-right text-gray-500 dark:text-gray-400">
                            {ledger.debitAmount ?? "-"}
                          </td>
                          <td className="px-4 py-2 text-right text-gray-500 dark:text-gray-400">
                            {ledger.creditAmount ?? "-"}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end mt-4 space-x-8 pr-4 dark:text-white">
            <div className="flex space-x-2">
              <span className="font-semibold">{t("Total Debit")}:</span>
              <span>{debitTotal}</span>
            </div>
            <div className="flex space-x-2">
              <span className="font-semibold">{t("Total Credit")}:</span>
              <span>{creditTotal}</span>
            </div>
          </div>
          <div className="my-4">
            <Pagination
              form={handleSubmit}
              pagination={{
                currentPage: paginationParams.pageIndex,
                firstPage: 1,
                lastPage: allTrialBalance?.LastPage ?? 1,
                nextPage:
                  allTrialBalance?.NextPage ?? paginationParams.pageIndex + 1,
                previousPage:
                  allTrialBalance?.PreviousPage ??
                  paginationParams.pageIndex - 1,
              }}
              handleSearch={handleSearch}
            />
          </div>
        </div>
      ) : (
        <p className="text-center text-sm text-gray-500 dark:text-gray-300 mt-6">
          {t("No Trial Balance found")}.
        </p>
      )}
    </div>
  );
};

export default AllTrialBalanceForm;

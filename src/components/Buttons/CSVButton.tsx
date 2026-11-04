import excelIcon from "../../../public/assets/excel.png";

type Props = {
  file?: string;
};

export const DownloadTemplateCSV = ({ file }: Props) => {
  if (!file) return null;

  const fileName = file.split("/").pop() || "template.xlsx";

  return (
    <a
      href={file}
      download={fileName}
      className="cursor-pointer"
      aria-label="Download template"
    >
      <div className="tooltip">
        <img
          src={excelIcon.src}
          alt="Download Template"
          className="w-20 h-20 mx-auto"
        />
      </div>
    </a>
  );
};
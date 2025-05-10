import { FileIcon, CircleIcon, FolderIcon, ClockIcon } from "lucide-react";

interface FileInfoProps {
  data: {
    name: string;
    size: number;
    filePath: string;
    modTime: string;
  };
}

export default function FileInfo({ data }: FileInfoProps) {
  return (
    <div className="w-full mb-4 bg-blue-50 rounded-lg p-4 border border-blue-100">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <FileIcon className="h-5 w-5 text-blue-500" />
          <span className="font-medium text-blue-900">{data.name}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-blue-700">
          <CircleIcon className="h-4 w-4" />
          <span>{data.size.toLocaleString()} bytes</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-blue-700">
          <FolderIcon className="h-4 w-4" />
          <span className="truncate" title={data.filePath}>
            {data.filePath}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-blue-700">
          <ClockIcon className="h-4 w-4" />
          <span>{new Date(data.modTime).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

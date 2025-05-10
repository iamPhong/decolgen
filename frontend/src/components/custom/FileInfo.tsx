import {
  FileIcon,
  HardDriveIcon,
  FolderIcon,
  ClockIcon,
  Maximize2Icon,
} from "lucide-react";

interface FileInfoProps {
  data: {
    name: string;
    size: number;
    filePath: string;
    modTime: string;
    width: number;
    height: number;
  };
}

const FileInfo = ({ data }: FileInfoProps) => {
  return (
    <div className="w-full bg-white rounded-lg border border-blue-100">
      <div className="divide-y divide-blue-100">
        {/* File Name */}
        <div className="flex items-center gap-3 p-4">
          <FileIcon className="h-5 w-5 text-blue-500 flex-shrink-0" />
          <div className="min-w-0">
            <p
              className="text-sm font-medium text-blue-900 truncate"
              title={data.name}
            >
              {data.name}
            </p>
          </div>
        </div>

        {/* File Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-blue-100">
          {/* Left Column */}
          <div className="space-y-3 p-4">
            <div className="flex items-center gap-3">
              <HardDriveIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-700">
                  {data.size.toLocaleString()} bytes
                </p>
              </div>
            </div>

            {data.width && data.height && (
              <div className="flex items-center gap-3">
                <Maximize2Icon className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-700">
                    {data.width} × {data.height} pixels
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-3 p-4">
            <div className="flex items-center gap-3">
              <FolderIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
              <div className="min-w-0">
                <p
                  className="text-sm text-blue-700 truncate"
                  title={data.filePath}
                >
                  {data.filePath}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ClockIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-700">
                  {new Date(data.modTime).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileInfo;

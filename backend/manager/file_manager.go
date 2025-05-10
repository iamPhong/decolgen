package manager

import (
	"encoding/base64"
	"fmt"
	"os"
	"time"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type FileInfo struct {
	Name     string `json:"name"`
	ModTime  string `json:"modTime"`
	IsDir    bool   `json:"isDir"`
	Mode     string `json:"mode"`
	Size     int    `json:"size"`
	FilePath string `json:"filePath"`
}
type FileResult struct {
	FileInfo      FileInfo `json:"fileInfo"`
	Base64Encoded string   `json:"base64Encoded"`
	Status        int      `json:"status"`
	Message       string   `json:"message"`
}

func (am *AppManager) OpenFileDialog() *FileResult {
	filePath, err := runtime.OpenFileDialog(am.ctx, runtime.OpenDialogOptions{
		Title: "Select Image",
		Filters: []runtime.FileFilter{
			{
				DisplayName: "Image Files",
				Pattern:     "*.jpg;*.jpeg;*.png;*.gif;*.bmp;*.tiff;*.ico;*.webp",
			},
		},
	})
	if err != nil {
		return &FileResult{
			FileInfo:      FileInfo{},
			Status:        0,
			Base64Encoded: "",
			Message:       fmt.Sprintf("failed to open file dialog: %w", err),
		}
	}

	if filePath == "" {
		return &FileResult{
			FileInfo:      FileInfo{},
			Status:        0,
			Base64Encoded: "",
			Message:       "User cancelled the open file dialog",
		}
	}

	data, err := os.ReadFile(filePath)
	if err != nil {
		return &FileResult{
			FileInfo:      FileInfo{},
			Status:        0,
			Base64Encoded: "",
			Message:       fmt.Sprintf("failed to read file: %w", err),
		}
	}

	fileInfo, err := os.Stat(filePath)
	if err != nil {
		return &FileResult{
			FileInfo:      FileInfo{},
			Status:        0,
			Base64Encoded: "",
			Message:       fmt.Sprintf("failed to get file info: %w", err),
		}
	}
	encoded := base64.StdEncoding.EncodeToString(data)

	return &FileResult{
		FileInfo: FileInfo{
			Name:     fileInfo.Name(),
			ModTime:  fileInfo.ModTime().Format(time.RFC3339),
			IsDir:    fileInfo.IsDir(),
			Mode:     fmt.Sprintf("%o", fileInfo.Mode()),
			Size:     int(fileInfo.Size()),
			FilePath: filePath,
		},
		Status:        1,
		Base64Encoded: encoded,
		Message:       "",
	}
}

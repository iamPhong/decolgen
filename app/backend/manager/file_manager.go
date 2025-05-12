package manager

import (
	"encoding/base64"
	"fmt"
	"os"
	"os/exec"
	"time"

	"github.com/disintegration/imaging"
	"github.com/wailsapp/wails/v2/pkg/runtime"

	osRuntime "runtime"
)

const MAX_FILE_SIZE = 1024 * 1024 * 50 // 50MB

type FileInfo struct {
	Name     string `json:"name"`
	ModTime  string `json:"modTime"`
	IsDir    bool   `json:"isDir"`
	Mode     string `json:"mode"`
	Width    int    `json:"width"`
	Height   int    `json:"height"`
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
		DefaultDirectory: am.getHomeDir(),
	})
	if err != nil {
		return &FileResult{
			FileInfo:      FileInfo{},
			Status:        0,
			Base64Encoded: "",
			Message:       fmt.Sprintf("failed to open file dialog: %s", err),
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
			Message:       fmt.Sprintf("failed to read file: %s", err),
		}
	}

	fileInfo, err := os.Stat(filePath)
	if err != nil {
		return &FileResult{
			FileInfo:      FileInfo{},
			Status:        0,
			Base64Encoded: "",
			Message:       fmt.Sprintf("failed to get file info: %s", err),
		}
	}

	fileSize := fileInfo.Size()
	if fileSize > MAX_FILE_SIZE {
		return &FileResult{
			FileInfo:      FileInfo{},
			Status:        0,
			Base64Encoded: "",
			Message:       fmt.Sprintf("Max file size is %dMB, your file size is %dMB", MAX_FILE_SIZE/1024/1024, fileSize/1024/1024),
		}
	}

	encoded := base64.StdEncoding.EncodeToString(data)
	width, height := getImageDimensions(filePath)

	return &FileResult{
		FileInfo: FileInfo{
			Name:     fileInfo.Name(),
			ModTime:  fileInfo.ModTime().Format(time.RFC3339),
			IsDir:    fileInfo.IsDir(),
			Width:    width,
			Height:   height,
			Mode:     fmt.Sprintf("%o", fileInfo.Mode()),
			Size:     int(fileSize),
			FilePath: filePath,
		},
		Status:        1,
		Base64Encoded: encoded,
		Message:       "",
	}
}

func (am *AppManager) RevealInExplorer(filePath string) error {
	var cmd *exec.Cmd

	switch osRuntime.GOOS {
	case "windows":
		cmd = exec.Command("explorer", "/select,", filePath)
	case "darwin":
		cmd = exec.Command("open", "-R", filePath)
	case "linux":
		cmd = exec.Command("xdg-open", filePath)
	default:
		return fmt.Errorf("unsupported platform")
	}

	return cmd.Run()
}

func getImageDimensions(filePath string) (int, int) {
	file, err := os.Open(filePath)
	if err != nil {
		return 0, 0
	}
	defer file.Close()

	img, err := imaging.Decode(file)
	if err != nil {
		return 0, 0
	}
	return img.Bounds().Dx(), img.Bounds().Dy()
}

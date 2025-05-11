package manager

import (
	"encoding/base64"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

func (am *AppManager) ResizeByCapacityHandler(filePath string, capacity int) (string, error) {
	data, err := os.ReadFile(filePath)
	extension := filepath.Ext(filePath)
	fileName := strings.TrimSuffix(filepath.Base(filePath), extension)

	if err != nil {
		return "", fmt.Errorf("failed to read file: %w", err)
	}

	actualSize := len(data)

	if capacity <= 0 {
		return "", errors.New("image.required_field_capacity")
	}

	if capacity < actualSize {
		return "", errors.New("image.capacity_must_larger")
	}

	encoded := base64.StdEncoding.EncodeToString(data)
	decoded, err := base64.StdEncoding.DecodeString(encoded)
	if err != nil {
		return "", fmt.Errorf("base64 decode failed: %w", err)
	}

	if padSize := capacity - actualSize; padSize > 0 {
		decoded = append(decoded, []byte(strings.Repeat("a", padSize))...)
	}

	savePath, err := runtime.SaveFileDialog(am.ctx, runtime.SaveDialogOptions{
		Title: "Save Resized Image",
		Filters: []runtime.FileFilter{
			{
				DisplayName: "Image Files",
				Pattern:     "*.jpg;*.jpeg;*.png;*.gif;*.bmp;*.tiff;*.ico;*.webp",
			},
		},
		DefaultFilename:      fileName + "_decolgen_resized" + extension,
		DefaultDirectory:     am.getHomeDir(),
		ShowHiddenFiles:      false,
		CanCreateDirectories: true,
	})

	if err != nil {
		return "", fmt.Errorf("failed to save image: %w", err)
	}

	if savePath == "" {
		return "", fmt.Errorf("User cancelled the save dialog")
	}

	err = os.WriteFile(savePath, decoded, 0644)
	if err != nil {
		return "", fmt.Errorf("failed to create file: %w", err)
	}

	return savePath, nil
}

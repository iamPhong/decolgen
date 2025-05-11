package manager

import (
	"bytes"
	"encoding/base64"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/disintegration/imaging"
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

type PreviewImageHandlerOptions struct {
	Width      int     `json:"width"`
	Height     int     `json:"height"`
	Filter     string  `json:"filter"`
	Blur       float64 `json:"blur"`
	Sharpening float64 `json:"sharpening"`
	Gamma      float64 `json:"gamma"`
	Contrast   int     `json:"contrast"`
	Brightness int     `json:"brightness"`
	Saturation int     `json:"saturation"`
	Invert     bool    `json:"invert"`
}

func (am *AppManager) PreviewImageHandler(filePath string, options PreviewImageHandlerOptions) (string, error) {
	img, err := imaging.Open(filePath)
	extension := filepath.Ext(filePath)
	if err != nil {
		return "", fmt.Errorf("failed to open image: %w", err)
	}

	img = imaging.Resize(img, options.Width, options.Height, am.filterMapping(options.Filter))
	img = imaging.Blur(img, options.Blur)
	img = imaging.Sharpen(img, options.Sharpening)
	img = imaging.AdjustGamma(img, options.Gamma)
	img = imaging.AdjustContrast(img, float64(options.Contrast))
	img = imaging.AdjustBrightness(img, float64(options.Brightness))
	img = imaging.AdjustSaturation(img, float64(options.Saturation))

	if options.Invert {
		img = imaging.Invert(img)
	}

	buf := new(bytes.Buffer)
	err = imaging.Encode(buf, img, am.formatImageMapping(extension))
	if err != nil {
		return "", fmt.Errorf("failed to encode image: %w", err)
	}

	return base64.StdEncoding.EncodeToString(buf.Bytes()), nil
}

func (am *AppManager) SaveEditedImageHandler(filePath string, options PreviewImageHandlerOptions) (string, error) {
	img, err := imaging.Open(filePath)
	extension := filepath.Ext(filePath)
	fileName := strings.TrimSuffix(filepath.Base(filePath), extension)

	if err != nil {
		return "", fmt.Errorf("failed to open image: %w", err)
	}

	img = imaging.Resize(img, options.Width, options.Height, am.filterMapping(options.Filter))
	img = imaging.Blur(img, options.Blur)
	img = imaging.Sharpen(img, options.Sharpening)
	img = imaging.AdjustGamma(img, options.Gamma)
	img = imaging.AdjustContrast(img, float64(options.Contrast))
	img = imaging.AdjustBrightness(img, float64(options.Brightness))
	img = imaging.AdjustSaturation(img, float64(options.Saturation))

	if options.Invert {
		img = imaging.Invert(img)
	}

	savePath, err := runtime.SaveFileDialog(am.ctx, runtime.SaveDialogOptions{
		Title: "Save Edited Image",
		Filters: []runtime.FileFilter{
			{
				DisplayName: "Image Files",
				Pattern:     "*.jpg;*.jpeg;*.png;*.gif;*.bmp;*.tiff;*.ico;*.webp",
			},
		},
		DefaultFilename:      fileName + "_decolgen_edited" + extension,
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

	file, err := os.Create(savePath)
	if err != nil {
		return "", fmt.Errorf("failed to create file: %w", err)
	}
	defer file.Close()

	err = imaging.Encode(file, img, am.formatImageMapping(extension))
	if err != nil {
		return "", fmt.Errorf("failed to encode image: %w", err)
	}

	return savePath, nil
}

func (am *AppManager) filterMapping(filter string) imaging.ResampleFilter {
	switch filter {
	case "none":
		return imaging.CatmullRom
	case "nearest":
		return imaging.NearestNeighbor
	case "linear":
		return imaging.Linear
	case "catmullrom":
		return imaging.CatmullRom
	case "lanczos":
		return imaging.Lanczos
	default:
		return imaging.CatmullRom
	}
}

func (am *AppManager) formatImageMapping(extension string) imaging.Format {
	switch extension {
	case ".jpg":
		return imaging.JPEG
	case ".jpeg":
		return imaging.JPEG
	case ".png":
		return imaging.PNG
	case ".gif":
		return imaging.GIF
	case ".bmp":
		return imaging.BMP
	case ".tiff":
		return imaging.TIFF
	default:
		return imaging.PNG
	}
}

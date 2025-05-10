package main

import (
	"context"
	"embed"
	"fmt"
	"time"

	"github.com/iamPhong/decolgen/backend/manager"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/logger"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/linux"
	"github.com/wailsapp/wails/v2/pkg/options/mac"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
)

//go:embed all:frontend/dist
var frontend embed.FS

//go:embed logo.png
var logo []byte

//go:embed wails.json
var wailsJson string

func main() {
	// Create an instance of the app structure
	app := manager.NewAppManager(wailsJson, logo)

	// Create application with options
	err := wails.Run(&options.App{
		Title:                            manager.Decolgen.Name,
		Width:                            900,
		Height:                           600,
		MinWidth:                         750,
		MinHeight:                        450,
		Frameless:                        false,
		LogLevel:                         logger.DEBUG,
		LogLevelProduction:               logger.DEBUG,
		ErrorFormatter:                   func(err error) any { return err.Error() },
		EnableDefaultContextMenu:         false,
		EnableFraudulentWebsiteDetection: false,
		SingleInstanceLock: &options.SingleInstanceLock{
			UniqueId:               "c9c8fd93-6758-4144-87d1-34bdb0a8bd60",
			OnSecondInstanceLaunch: app.OnSecondInstanceLaunch,
		},
		Windows: &windows.Options{
			Theme:                windows.Light,
			WindowIsTranslucent:  false,
			WebviewIsTransparent: false,
			WebviewUserDataPath:  "",
		},
		Mac: &mac.Options{
			TitleBar: &mac.TitleBar{
				TitlebarAppearsTransparent: true,
				HideTitle:                  true,
				HideTitleBar:               false,
				FullSizeContent:            true,
			},
			Appearance:           mac.NSAppearanceNameAqua,
			WebviewIsTransparent: false,
			WindowIsTranslucent:  true,
			About: &mac.AboutInfo{
				Title:   manager.Decolgen.Name,
				Message: fmt.Sprintf("Version: %s\n%s \n\n © %s %d", manager.Decolgen.Version, manager.Decolgen.Comments, manager.Decolgen.Copyright, time.Now().Year()),
				Icon:    manager.Decolgen.Logo,
			},
		},
		Linux: &linux.Options{
			Icon:                manager.Decolgen.Logo,
			WindowIsTranslucent: true,
			WebviewGpuPolicy:    linux.WebviewGpuPolicyAlways,
			ProgramName:         manager.Decolgen.Name,
		},
		AssetServer: &assetserver.Options{
			Assets: frontend,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup: func(ctx context.Context) {
			app.OnStartup(ctx)
		},
		OnBeforeClose: func(ctx context.Context) bool {
			return app.OnBeforeClose()
		},
		OnShutdown: func(ctx context.Context) {
			app.OnShutdown()
		},
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}

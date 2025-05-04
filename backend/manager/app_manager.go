package manager

import (
	"context"
	"strings"

	"github.com/tidwall/gjson"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

var (
	Decolgen AppInfo
)

type AppInfo struct {
	Name      string
	Version   string
	Copyright string
	Comments  string
	Logo      []byte
}

type AppManager struct {
	ctx context.Context
}

func NewAppManager(wailsJson string, logo []byte) *AppManager {
	Decolgen = AppInfo{}
	Decolgen.Name = gjson.Get(wailsJson, "info.productName").String()
	Decolgen.Version = gjson.Get(wailsJson, "info.productVersion").String()
	Decolgen.Copyright = gjson.Get(wailsJson, "info.copyright").String()
	Decolgen.Comments = gjson.Get(wailsJson, "info.comments").String()
	Decolgen.Logo = logo

	return &AppManager{}
}

func (am *AppManager) OnStartup(ctx context.Context) {
	am.ctx = ctx
}

func (am *AppManager) OnBeforeClose() bool {
	SendBeforeExitEvent(am.ctx, "do exit")
	return false
}

func (am *AppManager) OnShutdown() {
	SendBeforeExitEvent(am.ctx, "do shutdown")
}

func (am *AppManager) OnSecondInstanceLaunch(secondInstanceData options.SecondInstanceData) {
	secondInstanceArgs := secondInstanceData.Args

	println("user opened second instance", strings.Join(secondInstanceData.Args, ","))
	println("user opened second from", secondInstanceData.WorkingDirectory)
	runtime.WindowUnminimise(am.ctx)
	runtime.Show(am.ctx)
	go runtime.EventsEmit(am.ctx, "launchArgs", secondInstanceArgs)
}

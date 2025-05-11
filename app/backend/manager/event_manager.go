package manager

import (
	"context"
	"fmt"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

func SendBeforeExitEvent(ctx context.Context, data interface{}) {
	emit(ctx, eventBeforeExit(), data)
}

func emit(ctx context.Context, event string, data interface{}) {
	runtime.EventsEmit(ctx, event, data)
}

func eventBeforeExit() string {
	return fmt.Sprintf("decolgen-%s-before-exit", Decolgen.Version)
}
